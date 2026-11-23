import mongoose, { Schema, Document } from 'mongoose';

export type BookingStatus =
  | 'inquiry_received'
  | 'customizing'
  | 'quote_sent'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface IHolidayBooking extends Document {
  _id: mongoose.Types.ObjectId;
  bookingRef: string;         // e.g. TCH-20241119-XXXX
  packageId: mongoose.Types.ObjectId;
  packageTitle: string;
  packageDestination: string;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDateFrom: Date;
  travelDateTo: Date;
  rooms: number;
  adults: number;
  children: number;
  hotelTierSelected: 'standard' | 'deluxe' | 'luxury';
  departureCitySelected: string;
  basePricePerPerson: number;
  markup: number;              // admin configurable markup %
  discountPercent: number;
  totalAmountUSD: number;
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'refunded';
  status: BookingStatus;
  activitySwaps: Array<{
    dayNumber: number;
    chosenActivityId: string;
    chosenActivityTitle: string;
    priceDelta: number;
  }>;
  specialRequests?: string;
  adminNotes?: string;
  pdfBrochureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HolidayBookingSchema = new Schema<IHolidayBooking>(
  {
    bookingRef: { type: String, required: true, unique: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'HolidayPackage', required: true },
    packageTitle: { type: String, required: true },
    packageDestination: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    travelDateFrom: { type: Date, required: true },
    travelDateTo: { type: Date },
    rooms: { type: Number, default: 1, min: 1 },
    adults: { type: Number, default: 2, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    hotelTierSelected: { type: String, enum: ['standard', 'deluxe', 'luxury'], default: 'standard' },
    departureCitySelected: { type: String, default: 'Mumbai' },
    basePricePerPerson: { type: Number, required: true },
    markup: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    totalAmountUSD: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'refunded'], default: 'unpaid' },
    status: {
      type: String,
      enum: ['inquiry_received', 'customizing', 'quote_sent', 'confirmed', 'cancelled', 'completed'],
      default: 'inquiry_received'
    },
    activitySwaps: [
      {
        dayNumber: Number,
        chosenActivityId: String,
        chosenActivityTitle: String,
        priceDelta: Number,
        _id: false
      }
    ],
    specialRequests: String,
    adminNotes: String,
    pdfBrochureUrl: String
  },
  { timestamps: true }
);

HolidayBookingSchema.index({ customerId: 1 });
HolidayBookingSchema.index({ packageId: 1 });
HolidayBookingSchema.index({ status: 1 });

export const HolidayBooking = mongoose.model<IHolidayBooking>('HolidayBooking', HolidayBookingSchema);
