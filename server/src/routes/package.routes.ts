import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { HolidayPackage } from '../models/HolidayPackage.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── GET /api/packages ─────────────────────────────────────────────────────────
// Public — customer facing listing with filters & search
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search, destinationType, theme, category, minPrice, maxPrice,
      isBestSeller, isFeatured, isTrending, sort, page = '1', limit = '12'
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { isActive: true };

    if (search) filter.$text = { $search: search };
    if (destinationType && destinationType !== 'all') filter.destinationType = destinationType;
    if (theme && theme !== 'all') filter.theme = theme;
    if (category && category !== 'all') filter.category = category;
    if (isBestSeller === 'true') filter.isBestSeller = true;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isTrending === 'true') filter.isTrending = true;

    if (minPrice || maxPrice) {
      filter.basePrice = {} as Record<string, number>;
      if (minPrice) (filter.basePrice as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.basePrice as Record<string, number>).$lte = Number(maxPrice);
    }

    const sortMap: Record<string, Record<string, number>> = {
      recommended: { sortOrder: 1, isFeatured: -1 },
      price_asc: { basePrice: 1 },
      price_desc: { basePrice: -1 },
      duration_asc: { durationDays: 1 },
      duration_desc: { durationDays: -1 },
      newest: { createdAt: -1 }
    };
    const sortOpts = sortMap[sort || 'recommended'] || sortMap['recommended'];

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [packages, total] = await Promise.all([
      HolidayPackage.find(filter)
        .sort(sortOpts as any)
        .skip(skip)
        .limit(limitNum)
        .select('-wholesaleCost -__v')
        .lean(),
      HolidayPackage.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: packages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching packages' });
  }
});

// ─── GET /api/packages/featured ───────────────────────────────────────────────
router.get('/featured', async (_req: Request, res: Response): Promise<void> => {
  try {
    const featured = await HolidayPackage.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1 })
      .limit(6)
      .select('-wholesaleCost -__v')
      .lean();
    res.json({ success: true, data: featured });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching featured packages' });
  }
});

// ─── GET /api/packages/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg = await HolidayPackage.findOne({ _id: req.params.id, isActive: true })
      .select('-wholesaleCost -__v')
      .lean();
    if (!pkg) { res.status(404).json({ success: false, message: 'Package not found' }); return; }
    res.json({ success: true, data: pkg });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching package' });
  }
});

// ─── POST /api/packages ───────────────────────────────────────────────────────
// Admin only — create new package
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('destinationType').isIn(['domestic', 'international']),
    body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('durationDays').isInt({ min: 1 }),
    body('durationNights').isInt({ min: 1 })
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    try {
      const pkg = await HolidayPackage.create({
        ...req.body,
        createdBy: req.user!._id
      });
      res.status(201).json({ success: true, message: 'Package created', data: pkg });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error creating package' });
    }
  }
);

// ─── PUT /api/packages/:id ────────────────────────────────────────────────────
// Admin only — full update
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pkg = await HolidayPackage.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedBy: req.user!._id },
        { new: true, runValidators: true }
      );
      if (!pkg) { res.status(404).json({ success: false, message: 'Package not found' }); return; }
      res.json({ success: true, message: 'Package updated', data: pkg });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error updating package' });
    }
  }
);

// ─── PATCH /api/packages/:id ──────────────────────────────────────────────────
// Admin only — partial update (toggle active, update price, etc.)
router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pkg = await HolidayPackage.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body, updatedBy: req.user!._id } },
        { new: true }
      );
      if (!pkg) { res.status(404).json({ success: false, message: 'Package not found' }); return; }
      res.json({ success: true, message: 'Package patched', data: pkg });
    } catch {
      res.status(500).json({ success: false, message: 'Error patching package' });
    }
  }
);

// ─── DELETE /api/packages/:id ─────────────────────────────────────────────────
// Admin only — soft delete (sets isActive = false)
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pkg = await HolidayPackage.findByIdAndUpdate(
        req.params.id,
        { isActive: false, updatedBy: req.user!._id },
        { new: true }
      );
      if (!pkg) { res.status(404).json({ success: false, message: 'Package not found' }); return; }
      res.json({ success: true, message: 'Package deactivated (soft deleted)' });
    } catch {
      res.status(500).json({ success: false, message: 'Error deleting package' });
    }
  }
);

export default router;
