import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './app';
import { seedDatabase } from './scripts/seed';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpulse';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected:', MONGODB_URI);
    // Auto-seed if no packages exist (first deploy)
    try {
      const count = await mongoose.connection.collection('holidaypackages').countDocuments();
      if (count === 0) {
        console.log('🌱 No packages found — running seed...');
        await seedDatabase();
      }
    } catch (e) { console.warn('Auto-seed skipped:', e); }
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`🚀 TravelPulse API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default createApp;
