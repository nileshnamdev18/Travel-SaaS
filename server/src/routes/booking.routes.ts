import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { HolidayBooking } from '../models/HolidayBooking.model';
import { HolidayPackage } from '../models/HolidayPackage.model';
import { AdminConfig } from '../models/AdminConfig.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import { generateBookingRef } from '../utils/jwt.utils';

const router = Router();

// ─── POST /api/bookings ───────────────────────────────────────────────────────
// Customer creates a new booking (must be logged in)
router.post(
  '/',
  authenticate,
  [
    body('packageId').notEmpty().withMessage('Package ID is required'),
    body('customerPhone').notEmpty().withMessage('Phone is required'),
    body('travelDateFrom').isISO8601().withMessage('Valid travel start date required'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
    body('rooms').optional().isInt({ min: 1 }),
    body('children').optional().isInt({ min: 0 }),
    body('hotelTierSelected').optional().isIn(['standard', 'deluxe', 'luxury']),
    body('departureCitySelected').optional().trim()
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const user = req.user!;
      const {
        packageId, customerPhone, travelDateFrom, travelDateTo,
        adults = 2, children = 0, rooms = 1,
        hotelTierSelected = 'standard', departureCitySelected = 'Mumbai',
        activitySwaps = [], specialRequests
      } = req.body;

      // Fetch package
      const pkg = await HolidayPackage.findOne({ _id: packageId, isActive: true });
      if (!pkg) {
        res.status(404).json({ success: false, message: 'Holiday package not found or inactive' });
        return;
      }

      // Fetch admin config for markup
      const config = await AdminConfig.findOne({ key: 'holiday_global_config' });
      const markupPct = config?.partnerMarkupPercent ?? 15;
      const discountPct = pkg.discountPercent ?? 0;

      // Calculate price
      const basePerPerson = pkg.basePrice;
      const activityExtra = (activitySwaps as Array<{ priceDelta: number }>)
        .reduce((sum: number, s) => sum + (s.priceDelta || 0), 0);
      const priceWithMarkup = basePerPerson * (1 + markupPct / 100);
      const priceAfterDiscount = priceWithMarkup * (1 - discountPct / 100);
      const totalAmountUSD = Math.round((priceAfterDiscount + activityExtra) * (adults + children * 0.5) * rooms * 100) / 100;

      const booking = await HolidayBooking.create({
        bookingRef: generateBookingRef('TCH'),
        packageId: pkg._id,
        packageTitle: pkg.title,
        packageDestination: pkg.destination,
        customerId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone,
        travelDateFrom: new Date(travelDateFrom),
        travelDateTo: travelDateTo ? new Date(travelDateTo) : undefined,
        rooms,
        adults,
        children,
        hotelTierSelected,
        departureCitySelected,
        basePricePerPerson: basePerPerson,
        markup: markupPct,
        discountPercent: discountPct,
        totalAmountUSD,
        activitySwaps,
        specialRequests,
        status: 'inquiry_received'
      });

      res.status(201).json({
        success: true,
        message: 'Booking inquiry submitted successfully!',
        data: booking
      });
    } catch (err) {
      console.error('[Booking Error]', err);
      res.status(500).json({ success: false, message: 'Error creating booking' });
    }
  }
);

// ─── GET /api/bookings/my ─────────────────────────────────────────────────────
// Customer sees their own bookings
router.get('/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await HolidayBooking.find({ customerId: req.user!._id })
      .sort({ createdAt: -1 })
      .populate('packageId', 'heroImage destination durationDays durationNights')
      .lean();
    res.json({ success: true, data: bookings });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching your bookings' });
  }
});

// ─── GET /api/bookings/:id ────────────────────────────────────────────────────
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await HolidayBooking.findById(req.params.id)
      .populate('packageId', 'heroImage destination durationDays durationNights inclusions exclusions days')
      .lean();

    if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }

    // Customers can only see their own booking; admins see all
    const uid = req.user!._id.toString();
    if (req.user!.role !== 'super_admin' && booking.customerId.toString() !== uid) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    res.json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching booking' });
  }
});

// ─── PATCH /api/bookings/:id/status ──────────────────────────────────────────
// Admin updates booking status
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  [body('status').isIn(['inquiry_received', 'customizing', 'quote_sent', 'confirmed', 'cancelled', 'completed'])],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }
    try {
      const booking = await HolidayBooking.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, adminNotes: req.body.adminNotes },
        { new: true }
      );
      if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }
      res.json({ success: true, message: 'Status updated', data: booking });
    } catch {
      res.status(500).json({ success: false, message: 'Error updating status' });
    }
  }
);

// ─── DELETE /api/bookings/:id ─────────────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await HolidayBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Error deleting booking' });
  }
});

export default router;
