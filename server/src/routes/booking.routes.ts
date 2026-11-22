import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { HolidayBooking } from '../models/HolidayBooking.model';
import { HolidayPackage } from '../models/HolidayPackage.model';
import { AdminConfig } from '../models/AdminConfig.model';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import { generateBookingRef } from '../utils/jwt.utils';
import { sendBookingEmail } from '../utils/email.utils';

const router = Router();

// ─── POST /api/bookings ───────────────────────────────────────────────────────
// Customer creates a new booking (auth optional — guest inquiries allowed)
router.post(
  '/',
  [
    body('packageId').notEmpty().withMessage('Package ID is required'),
    body('customerPhone').notEmpty().withMessage('Phone is required'),
    body('travelDateFrom').isISO8601().withMessage('Valid travel start date required'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
    body('rooms').optional().isInt({ min: 1 }),
    body('children').optional().isInt({ min: 0 }),
    body('hotelTierSelected').optional().isIn(['standard', 'deluxe', 'luxury']),
    body('departureCitySelected').optional().trim(),
    body('customerName').optional().trim(),
    body('customerEmail').optional().isEmail()
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      // Optional auth: attach user if token present
      const authHeader = req.headers.authorization;
      let user: any = null;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded: any = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'travelpulse_secret');
          user = { _id: decoded.userId || decoded.id || decoded._id, name: decoded.name, email: decoded.email, role: decoded.role };
        } catch { user = null; }
      }
      const {
        packageId, customerPhone, travelDateFrom, travelDateTo,
        adults = 2, children = 0, rooms = 1,
        hotelTierSelected = 'standard', departureCitySelected = 'Mumbai',
        activitySwaps = [], specialRequests,
        customerName, customerEmail, departureId
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
        customerId: user?._id,
        customerName: customerName || user?.name || 'Guest Traveler',
        customerEmail: customerEmail || user?.email || 'guest@travelpulse.in',
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

      // Send confirmation email (fire-and-forget)
      sendBookingEmail(
        booking.customerEmail,
        `Booking received: ${booking.bookingRef}`,
        `<h2>Thank you for your inquiry, ${booking.customerName}!</h2><p>Your booking reference is <strong>${booking.bookingRef}</strong>.</p><p>Package: ${booking.packageTitle}</p><p>Total: USD ${booking.totalAmountUSD}</p><p>Status: ${booking.status}</p>`
      ).catch(() => {});

      // Decrement departure seats if provided
      if (departureId && mongoose.Types.ObjectId.isValid(departureId) === false) {
        // departureId is an index into pkg.departures; handle by date match instead below
      }
      if (departureId) {
        try {
          const idx = Number(departureId);
          if (!isNaN(idx)) {
            await HolidayPackage.updateOne(
              { _id: pkg._id },
              { $inc: { [`departures.${idx}.seatsBooked`]: adults + children } }
            );
          }
        } catch { /* ignore */ }
      }

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
    if (req.user!.role !== 'super_admin' && booking.customerId && booking.customerId.toString() !== uid) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    res.json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching booking' });
  }
});

// ─── GET /api/bookings/track/:ref ─────────────────────────────────────────────
// Public — track a booking by reference (no auth)
router.get('/track/:ref', async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await HolidayBooking.findOne({
      $or: [{ bookingRef: req.params.ref }, { _id: mongoose.Types.ObjectId.isValid(req.params.ref) ? req.params.ref : undefined }]
    }).populate('packageId', 'heroImage destination durationDays durationNights').lean();
    if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }
    res.json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, message: 'Error tracking booking' });
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
      sendBookingEmail(
        booking.customerEmail,
        `Booking ${booking.bookingRef} updated: ${booking.status}`,
        `<h2>Your booking status has been updated</h2><p>Reference: <strong>${booking.bookingRef}</strong></p><p>New status: <strong>${booking.status}</strong></p>${req.body.adminNotes ? `<p>Note: ${req.body.adminNotes}</p>` : ''}`
      ).catch(() => {});
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
