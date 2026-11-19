import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.model';
import { generateToken } from '../utils/jwt.utils';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const { name, email, password, phone } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(409).json({ success: false, message: 'Email already registered' });
        return;
      }

      const user = await User.create({ name, email, password, phone, role: 'customer' });
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error during registration' });
    }
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
        return;
      }

      const token = generateToken(user);
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: req.user });
});

// ─── POST /api/auth/change-password ──────────────────────────────────────────
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const user = await User.findById(req.user!._id).select('+password');
      if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }

      const isMatch = await user.comparePassword(req.body.currentPassword);
      if (!isMatch) { res.status(400).json({ success: false, message: 'Current password is incorrect' }); return; }

      user.password = req.body.newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } catch {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

export default router;
