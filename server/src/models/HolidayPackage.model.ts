import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-document schemas ─────────────────────────────────────────────────────
const ActivityOptionSchema = new Schema({
  id: String,
  title: { type: String, required: true },
  duration: String,
  priceDelta: { type: Number, default: 0 },
  image: String,
  description: String
}, { _id: false });

const DayItinerarySchema = new Schema({
  dayNumber: { type: Number, required: true },
  dayTitle: { type: String, required: true },
  destination: String,
  currentActivity: ActivityOptionSchema,
  alternativeActivities: [ActivityOptionSchema],
  hotelName: String,
  hotelTier: String,
  mealsIncluded: [String]
}, { _id: false });

const HotelTiersSchema = new Schema({
  standard: String,
  deluxe: String,
  luxury: String
}, { _id: false });

// ─── Main Holiday Package Document ───────────────────────────────────────────
export interface IHolidayPackage extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  destination: string;
  destinationType: 'domestic' | 'international';
  region: string;
  theme: string;
  category: string;
  durationDays: number;
  durationNights: number;
  departureCities: string[];
  basePrice: number;         // USD — selling price to customer
  wholesaleCost: number;     // USD — internal cost
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  hotelTiers: {
    standard?: string;
    deluxe?: string;
    luxury?: string;
  };
  days: Array<{
    dayNumber: number;
    dayTitle: string;
    destination?: string;
    currentActivity?: {
      id?: string;
      title: string;
      duration?: string;
      priceDelta: number;
      image?: string;
      description?: string;
    };
    alternativeActivities?: Array<{
      id?: string;
      title: string;
      duration?: string;
      priceDelta: number;
      image?: string;
      description?: string;
    }>;
    hotelName?: string;
    hotelTier?: string;
    mealsIncluded?: string[];
  }>;
  isBestSeller: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  slug?: string;
  rating: number;
  reviewCount: number;
  discountPercent: number;
  cancellationPolicy: string;
  tags: string[];
  sortOrder: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HolidayPackageSchema = new Schema<IHolidayPackage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, sparse: true, index: true },
    destination: { type: String, required: true, trim: true },
    destinationType: { type: String, enum: ['domestic', 'international'], required: true },
    region: { type: String, default: '' },
    theme: { type: String, default: 'family' },
    category: { type: String, default: 'Customized' },
    durationDays: { type: Number, required: true, min: 1 },
    durationNights: { type: Number, required: true, min: 1 },
    departureCities: [String],
    basePrice: { type: Number, required: true, min: 0 },
    wholesaleCost: { type: Number, default: 0 },
    heroImage: { type: String, default: '' },
    galleryImages: [String],
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    hotelTiers: HotelTiersSchema,
    days: [DayItinerarySchema],
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 120, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    cancellationPolicy: { type: String, default: 'Non-refundable after booking.' },
    tags: [String],
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Indexes for search/filter performance
HolidayPackageSchema.index({ destinationType: 1, isActive: 1 });
HolidayPackageSchema.index({ theme: 1 });
HolidayPackageSchema.index({ isBestSeller: 1, isFeatured: 1 });
HolidayPackageSchema.index({ basePrice: 1 });
HolidayPackageSchema.index({ title: 'text', destination: 'text', region: 'text' });

export const HolidayPackage = mongoose.model<IHolidayPackage>('HolidayPackage', HolidayPackageSchema);
