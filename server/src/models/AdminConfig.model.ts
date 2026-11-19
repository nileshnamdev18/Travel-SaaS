import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminConfig extends Document {
  key: 'holiday_global_config';  // singleton document
  partnerMarkupPercent: number;
  groupDiscountPercent: number;
  tourManagerIncludedByDefault: boolean;
  supportHelpline: string;
  whatsappInquiryNumber: string;
  enableInstantBooking: boolean;
  heroHeadline: string;
  heroSubheading: string;
  featuredDestinations: string[];
  announcementBanner?: string;
  announcementBannerEnabled: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const AdminConfigSchema = new Schema<IAdminConfig>(
  {
    key: { type: String, default: 'holiday_global_config', unique: true },
    partnerMarkupPercent: { type: Number, default: 15, min: 0, max: 100 },
    groupDiscountPercent: { type: Number, default: 8, min: 0, max: 100 },
    tourManagerIncludedByDefault: { type: Boolean, default: true },
    supportHelpline: { type: String, default: '1800-209-9100' },
    whatsappInquiryNumber: { type: String, default: '919222211100' },
    enableInstantBooking: { type: Boolean, default: true },
    heroHeadline: { type: String, default: 'Discover India & the World' },
    heroSubheading: { type: String, default: 'Award-Winning Holiday Packages Since 1881' },
    featuredDestinations: {
      type: [String],
      default: ['Kashmir', 'Kerala', 'Goa', 'Himachal', 'Ladakh', 'Dubai', 'Bali', 'Europe', 'Thailand', 'Vietnam']
    },
    announcementBanner: { type: String, default: '' },
    announcementBannerEnabled: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const AdminConfig = mongoose.model<IAdminConfig>('AdminConfig', AdminConfigSchema);
