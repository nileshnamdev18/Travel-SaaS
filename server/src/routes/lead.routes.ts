import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import { Lead } from '../models/Lead.model';

const router = Router();

// POST /api/leads (public - callback/inquiry)
router.post('/', [
  body('phone').notEmpty(),
  body('name').optional().trim(),
  body('email').optional().isEmail(),
  body('source').optional().trim()
], async (req: any, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ success: false, errors: errors.array() }); return; }
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Failed' });
  }
});

// GET /api/leads (admin)
router.get('/', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, data: leads });
  } catch {
    res.status(500).json({ success: false, message: 'Failed' });
  }
});

export default router;
