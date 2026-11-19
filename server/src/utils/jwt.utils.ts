import jwt from 'jsonwebtoken';
import { IUser } from '../models/User.model';

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'travelpulse_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

export const generateBookingRef = (prefix = 'TCH'): string => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).toUpperCase().substring(2, 6);
  return `${prefix}-${dateStr}-${random}`;
};
