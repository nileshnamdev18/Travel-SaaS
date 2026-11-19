import mongoose, { Schema, Document } from 'mongoose';

export interface IFeaturedDestination {
  name: string;
  imageUrl: string;
}

export interface ITrustPillar {
  icon: string;
  title: string;
  description: string;
}

export interface IAdminConfig extends Document {
  key: 'holiday_global_config'; // singleton document
  partnerMarkupPercent: number;
  groupDiscountPercent: number;
  tourManagerIncludedByDefault: boolean;
  supportHelpline: string;
  whatsappInquiryNumber: string;
  enableInstantBooking: boolean;
  heroHeadline: string;
  heroSubheading: string;
  featuredDestinations: IFeaturedDestination[];
  announcementBanner?: string;
  announcementBannerEnabled: boolean;
  assuranceTitle: string;
  assuranceBadges: string[];
  trustPillars: ITrustPillar[];
  loyaltyPointsRate: number; // e.g., 0.05 = 5%
  hotelTierMultiplierComfort: number;
  hotelTierMultiplierSuperior: number;
  hotelTierMultiplierLuxury: number;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const FeaturedDestinationSchema = new Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  { _id: false }
);

const TrustPillarSchema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const AdminConfigSchema = new Schema<IAdminConfig>(
  {
    key: { type: String, default: 'holiday_global_config', unique: true },
    partnerMarkupPercent: { type: Number, default: 15, min: 0, max: 100 },
    groupDiscountPercent: { type: Number, default: 8, min: 0, max: 100 },
    tourManagerIncludedByDefault: { type: Boolean, default: true },
    supportHelpline: { type: String, default: '1800-209-9100' },
    whatsappInquiryNumber: { type: String, default: '+919222211100' },
    enableInstantBooking: { type: Boolean, default: true },
    heroHeadline: { type: String, default: 'Explore Handcrafted Holidays Across the World' },
    heroSubheading: {
      type: String,
      default:
        'Discover breathtaking holidays from majestic Kashmir & tropical Kerala to glamorous Dubai & the Swiss Alps. Guaranteed 4★ stays, authentic meals, and customizable day itineraries.'
    },
    featuredDestinations: {
      type: [FeaturedDestinationSchema],
      default: [
        {
          name: 'Kashmir',
          imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Kerala',
          imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Dubai',
          imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Europe',
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Thailand',
          imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Bali',
          imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Ladakh',
          imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Himachal',
          imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    announcementBanner: { type: String, default: '🎉 Summer Special Offer: Flat 10% OFF on European & Domestic Group Tours!' },
    announcementBannerEnabled: { type: Boolean, default: true },
    assuranceTitle: { type: String, default: '140+ Years of Heritage & Seamless Holiday Assurance' },
    assuranceBadges: {
      type: [String],
      default: ['All Meals Included Options', 'Flexi-Cancellation & Reschedule', '24/7 Dedicated Tour Manager']
    },
    trustPillars: {
      type: [TrustPillarSchema],
      default: [
        {
          icon: 'shield',
          title: '140+ Years of Heritage',
          description: "Trusted by 3 crore+ Indians since 1881 — India's original travel brand."
        },
        {
          icon: 'star',
          title: 'Award-Winning Packages',
          description: 'Winner of 15+ national travel excellence awards for best holiday value.'
        },
        {
          icon: 'users',
          title: 'Expert Tour Managers',
          description: 'Every group tour comes with a dedicated Hindi/English speaking tour manager.'
        },
        {
          icon: 'map',
          title: '500+ Destinations',
          description: 'From Leh to Lisbon — we craft journeys to 500+ global destinations.'
        },
        {
          icon: 'phone',
          title: '24/7 Holiday Helpdesk',
          description: 'Round-the-clock support — our specialists are always a call away.'
        }
      ]
    },
    loyaltyPointsRate: { type: Number, default: 0.05, min: 0, max: 1 },
    hotelTierMultiplierComfort: { type: Number, default: 0.9 },
    hotelTierMultiplierSuperior: { type: Number, default: 1.0 },
    hotelTierMultiplierLuxury: { type: Number, default: 1.35 },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const AdminConfig = mongoose.model<IAdminConfig>('AdminConfig', AdminConfigSchema);
