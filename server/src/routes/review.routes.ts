import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { HolidayPackage } from '../models/HolidayPackage.model';

const router = Router();

// In-memory-ish: store reviews in a separate collection via dynamic model
const ReviewSchema = new (require('mongoose').Schema)({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'HolidayPackage', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// GET /api/packages/:id/reviews
router.get('/:id/reviews', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ success: false, message: 'Invalid package id' }); return;
    }
    const reviews = await Review.find({ packageId: req.params.id }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
});

// POST /api/packages/:id/reviews  (auth)
router.post('/:id/reviews', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim()
], async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ success: false, errors: errors.array() }); return; }
  try {
    const pkg = await HolidayPackage.findById(req.params.id);
    if (!pkg) { res.status(404).json({ success: false, message: 'Package not found' }); return; }
    // Verified booking check
    const verifiedBooking = await (require('../models/HolidayBooking.model').HolidayBooking).findOne({
      packageId: pkg._id,
      customerId: req.user!._id,
      status: 'completed'
    });
    const review = await Review.create({
      packageId: pkg._id,
      customerId: req.user!._id,
      customerName: req.user!.name || 'Traveler',
      rating: req.body.rating,
      comment: req.body.comment || '',
      verified: !!verifiedBooking
    });
    // Recompute aggregate
    const agg = await Review.aggregate([
      { $match: { packageId: pkg._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (agg[0]) {
      await HolidayPackage.findByIdAndUpdate(pkg._id, { rating: Math.round(agg[0].avg * 10) / 10, reviewCount: agg[0].count });
    }
    res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Error creating review' });
  }
});

export default router;
