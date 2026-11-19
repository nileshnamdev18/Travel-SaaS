import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AdminConfig } from '../models/AdminConfig.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── GET /api/config/holiday ──────────────────────────────────────────────────
// Public — customer facing config (no wholesaleCost, no internal fields)
router.get('/holiday', async (_req, res: Response): Promise<void> => {
  try {
    let config = await AdminConfig.findOne({ key: 'holiday_global_config' });
    if (!config) {
      // Create default if not found
      config = await AdminConfig.create({ key: 'holiday_global_config' });
    }
    // Strip internal fields for public response
    const { partnerMarkupPercent: _m, ...publicConfig } = config.toObject();
    res.json({ success: true, data: publicConfig });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching config' });
  }
});

// ─── GET /api/config/holiday/admin ───────────────────────────────────────────
// Admin full config including markup
router.get('/holiday/admin', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    let config = await AdminConfig.findOne({ key: 'holiday_global_config' });
    if (!config) config = await AdminConfig.create({ key: 'holiday_global_config' });
    res.json({ success: true, data: config });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching admin config' });
  }
});

// ─── PUT /api/config/holiday ──────────────────────────────────────────────────
// Admin updates global holiday config
router.put(
  '/holiday',
  authenticate,
  requireAdmin,
  [
    body('partnerMarkupPercent').optional().isFloat({ min: 0, max: 100 }),
    body('groupDiscountPercent').optional().isFloat({ min: 0, max: 100 }),
    body('tourManagerIncludedByDefault').optional().isBoolean(),
    body('supportHelpline').optional().trim(),
    body('whatsappInquiryNumber').optional().trim(),
    body('enableInstantBooking').optional().isBoolean(),
    body('heroHeadline').optional().trim(),
    body('heroSubheading').optional().trim(),
    body('featuredDestinations').optional().isArray(),
    body('announcementBannerEnabled').optional().isBoolean()
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    try {
      const config = await AdminConfig.findOneAndUpdate(
        { key: 'holiday_global_config' },
        { $set: { ...req.body, updatedBy: req.user!._id } },
        { new: true, upsert: true, runValidators: true }
      );
      res.json({ success: true, message: 'Config updated successfully', data: config });
    } catch {
      res.status(500).json({ success: false, message: 'Error updating config' });
    }
  }
);

export default router;
