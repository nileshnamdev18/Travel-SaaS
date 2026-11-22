import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelpulse';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected:', MONGODB_URI);
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
