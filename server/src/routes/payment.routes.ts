import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.middleware';
import { HolidayBooking } from '../models/HolidayBooking.model';

const router = Router();

let Razorpay: any = null;
try { Razorpay = require('razorpay'); } catch { Razorpay = null; }

function getRazorpay() {
  if (!Razorpay) return null;
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) return null;
  return new Razorpay({ key_id: key, key_secret: secret });
}

// POST /api/payments/create-order
router.post('/create-order', [
  body('bookingId').notEmpty()
], async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ success: false, errors: errors.array() }); return; }
  try {
    const booking = await HolidayBooking.findById(req.body.bookingId);
    if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }
    // Optional auth: if token present, enforce ownership; else allow guest
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'travelpulse_secret');
        const uid = decoded.userId || decoded.id || decoded._id;
        if (booking.customerId && booking.customerId.toString() !== uid && decoded.role !== 'super_admin') {
          res.status(403).json({ success: false, message: 'Access denied' }); return;
        }
      } catch { /* ignore invalid token */ }
    }
    const rp = getRazorpay();
    if (rp) {
      const order = await rp.orders.create({ amount: Math.round(booking.totalAmountUSD * 100), currency: 'USD', receipt: booking.bookingRef });
      res.json({ success: true, data: { orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID } });
    } else {
      // Mock order for dev
      res.json({ success: true, data: { orderId: `mock_order_${booking.bookingRef}`, amount: Math.round(booking.totalAmountUSD * 100), currency: 'USD', key: 'mock' } });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Order creation failed' });
  }
});

// POST /api/payments/verify
router.post('/verify', [
  body('bookingId').notEmpty()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await HolidayBooking.findById(req.body.bookingId);
    if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded: any = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || 'travelpulse_secret');
        const uid = decoded.userId || decoded.id || decoded._id;
        if (booking.customerId && booking.customerId.toString() !== uid && decoded.role !== 'super_admin') {
          res.status(403).json({ success: false, message: 'Access denied' }); return;
        }
      } catch { /* ignore */ }
    }
    // Razorpay signature verification (if keys present and signature provided)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature && process.env.RAZORPAY_KEY_SECRET) {
      const crypto = require('crypto');
      const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
      if (expected !== razorpay_signature) {
        res.status(400).json({ success: false, message: 'Invalid payment signature' }); return;
      }
    }
    const updated = await HolidayBooking.findByIdAndUpdate(
      req.body.bookingId,
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
    res.json({ success: true, message: 'Payment verified', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Verification failed' });
  }
});

export default router;
