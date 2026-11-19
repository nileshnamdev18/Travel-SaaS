import { Router, Response } from 'express';
import { HolidayBooking } from '../models/HolidayBooking.model';
import { HolidayPackage } from '../models/HolidayPackage.model';
import { User } from '../models/User.model';
import { AdminConfig } from '../models/AdminConfig.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require auth + super_admin role
router.use(authenticate, requireAdmin);

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────
router.get('/dashboard', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalPackages, activePackages, totalBookings,
      confirmedBookings, pendingBookings, totalCustomers,
      recentBookings
    ] = await Promise.all([
      HolidayPackage.countDocuments(),
      HolidayPackage.countDocuments({ isActive: true }),
      HolidayBooking.countDocuments(),
      HolidayBooking.countDocuments({ status: 'confirmed' }),
      HolidayBooking.countDocuments({ status: { $in: ['inquiry_received', 'customizing', 'quote_sent'] } }),
      User.countDocuments({ role: 'customer' }),
      HolidayBooking.find().sort({ createdAt: -1 }).limit(10).lean()
    ]);

    // Revenue calculation
    const revenueAgg = await HolidayBooking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmountUSD' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: {
        stats: { totalPackages, activePackages, totalBookings, confirmedBookings, pendingBookings, totalCustomers, totalRevenue },
        recentBookings
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

// ─── GET /api/admin/bookings ──────────────────────────────────────────────────
router.get('/bookings', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20', search } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { bookingRef: { $regex: search, $options: 'i' } },
        { packageTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      HolidayBooking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      HolidayBooking.countDocuments(filter)
    ]);

    res.json({ success: true, data: bookings, pagination: { total, page: pageNum, limit: limitNum } });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password').lean();
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// ─── PATCH /api/admin/users/:id/toggle ───────────────────────────────────────
router.patch('/users/:id/toggle', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    // Cannot deactivate yourself
    if (user._id.toString() === req.user!._id.toString()) {
      res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
      return;
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Error toggling user status' });
  }
});

// ─── GET /api/admin/packages ──────────────────────────────────────────────────
// Admin sees ALL packages including inactive, with wholesaleCost
router.get('/packages', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const packages = await HolidayPackage.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();
    res.json({ success: true, data: packages });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching packages' });
  }
});

export default router;
