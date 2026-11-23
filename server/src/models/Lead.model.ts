import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const LeadSchema = new Schema({
  name: String,
  phone: { type: String, required: true },
  email: String,
  source: { type: String, default: 'callback' },
  vertical: { type: String, default: 'Holidays' },
  packageId: String,
  packageTitle: String,
  notes: String,
  status: { type: String, default: 'new' }
}, { timestamps: true });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
export default Lead;
