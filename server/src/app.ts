import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import packageRoutes from './routes/package.routes';
import bookingRoutes from './routes/booking.routes';
import adminRoutes from './routes/admin.routes';
import configRoutes from './routes/config.routes';
import pdfExtractRoutes from './routes/pdfExtract.routes';
import uploadRoutes from './routes/upload.routes';
import reviewRoutes from './routes/review.routes';
import paymentRoutes from './routes/payment.routes';
import leadRoutes from './routes/lead.routes';

dotenv.config();

export function createApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(s => s.trim()).filter(Boolean);
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (/\.vercel\.app$/.test(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000, standardHeaders: true, legacyHeaders: false }));

  app.use('/api/auth', authRoutes);
  app.use('/api/packages', pdfExtractRoutes);
  app.use('/api/packages', uploadRoutes);
  app.use('/api/packages', reviewRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/leads', leadRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'TravelPulse API is running', mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
  return app;
}
