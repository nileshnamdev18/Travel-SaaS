import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';

// Extend Express Request to carry authenticated user
export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'travelpulse_secret';
    const decoded = jwt.verify(token, secret) as { userId: string; role: string };

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User not found or inactive.' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403).json({ success: false, message: 'Access denied. Super admin role required.' });
    return;
  }
  next();
};

export const requireCustomerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !['customer', 'super_admin'].includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }
  next();
};
