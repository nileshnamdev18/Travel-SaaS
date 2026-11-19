// Domain Types for TravelPulse AI Platform - 2-Role System (Customer & Super Admin)

export type PortalType = 'customer' | 'admin' | 'b2c';

export type UserRole = 
  | 'customer'
  | 'super_admin'
  // Legacy roles kept for type backwards-compatibility:
  | 'traveler'
  | 'agency_agent'
  | 'agency_admin'
  | 'support_agent'
  | 'finance_admin';

export type CurrencyCode = 'USD' | 'SAR' | 'INR' | 'EUR' | 'AED';

export type ThemeMode = 'light' | 'dark';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToUSD: number; // e.g. USD = 1.0, SAR = 3.75, INR = 83.5, EUR = 0.92, AED = 3.67
}

// ======================== FLIGHT TYPES (Akbar Travels Benchmark) ========================
export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface FlightSegment {
  flightNumber: string;
  airlineName: string;
  airlineCode: string;
  airlineLogo: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  durationMinutes: number;
  aircraft: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number; // 0 = Direct, 1 = 1 Stop
  stopCities?: string[];
  cabinClass: CabinClass;
  basePriceUSD: number;
  baggageAllowance: string;
  seatsAvailable: number;
  inPolicy: boolean;
  policyNote?: string;
  carbonKg: number;
  refundable: boolean;
}

// ======================== HOTEL TYPES (Akbar Travels Benchmark) ========================
export interface HotelRoomTier {
  id: string;
  title: string;
  bedType: string;
  maxGuests: number;
  pricePerNightUSD: number;
  freeBreakfast: boolean;
  freeCancellation: boolean;
  image: string;
  features: string[];
}

export interface HotelOption {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  distanceToCenter: string;
  distanceToHaramMeters?: number;
  distanceToHaramLabel?: string;
  heroImage: string;
  galleryImages: string[];
  amenities: string[];
  tags: string[];
  basePriceUSD: number;
  inPolicy: boolean;
  rooms: HotelRoomTier[];
}

// ======================== VISA TYPES (Atlys Benchmark: eVisa & Sticker Visa) ========================
export type VisaFlowType = 'evisa' | 'sticker';
export type VisaCategory = 'popular' | 'instant_evisa' | 'sticker' | 'on_arrival';

export interface VisaDocumentRequirement {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  acceptedFormats: string;
}

export interface VisaOption {
  id: string;
  title: string;
  validityDays: number;
  maxStayDays: number;
  entryType: 'Single' | 'Multiple';
  processingTimeStandard: string;
  processingTimeExpress?: string;
  govFee: number;
  platformFee: number;
  expressSurcharge?: number;
  visaType?: VisaFlowType; // eVisa or Sticker
}

export interface CountryVisaInfo {
  id: string;
  countryName: string;
  countryCode: string;
  flag: string;
  bannerImage: string;
  popular: boolean;
  category?: VisaCategory;
  guaranteeSlaDays?: number; // e.g. 2 for 48 hrs, 4 for 4 days
  fastestTurnaround?: string; // e.g. '24h Express'
  tagline?: string;
  rejectionRefundPolicy?: string; // e.g. '100% Atlys Fee Refund on Delay'
  requiresPassportOCR: boolean;
  options: VisaOption[];
  requirements: VisaDocumentRequirement[];
  icaoRules: string[];
  supportsStickerVisa?: boolean;
  embassyLocation?: string;
  appointmentRequired?: boolean;
  vfsCenters?: string[];
}

export interface PassportOCRData {
  fullName: string;
  passportNumber: string;
  nationality: string;
  countryCode: string;
  dob: string;
  expiryDate: string;
  gender: 'M' | 'F';
  mrzLine1: string;
  mrzLine2: string;
  confidenceScore: number; // e.g. 99.4%
}

export type VisaApplicationStatus = 
  | 'draft'
  | 'docs_uploaded'
  | 'ocr_verified'
  | 'embassy_processing'
  | 'approved'
  | 'rejected';

export interface VisaTimelineEvent {
  status: string;
  timestamp: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface DoorstepAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
  pickupSlot: string;
}

export interface VisaApplicationRecord {
  id: string;
  trackingId: string; // e.g. ATLYS-IN-41982
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  passportNumber: string;
  countryId?: string;
  country: string;
  visaType: string;
  flowType?: VisaFlowType;
  status: VisaApplicationStatus;
  submissionDate: string;
  estimatedCompletion: string;
  guaranteedDeliveryDate?: string;
  ocrExtracted: boolean;
  whatsappNotified: boolean;
  govFeeUSD?: number;
  platformFeeUSD?: number;
  totalAmountUSD?: number;
  doorstepAddress?: DoorstepAddress;
  timeline?: VisaTimelineEvent[];
  adminNotes?: string;
}

export interface AdminVisaConfig {
  globalPlatformFeeUSD: number;
  expressTurnaroundSurchargeUSD: number;
  onTimeGuaranteeActive: boolean;
  doorstepCourierFeeUSD: number;
  supportHelpline: string;
  whatsappSupportNumber: string;
}

// ======================== HOLIDAYS TYPES (Thomas Cook Benchmark) ========================
export type HolidayDestinationType = 'domestic' | 'international';
export type HolidayTheme = 'all' | 'honeymoon' | 'family' | 'adventure' | 'luxury' | 'group_tour' | 'wildlife';
export type HolidayBookingStatus = 'inquiry_received' | 'customizing' | 'quote_sent' | 'confirmed' | 'cancelled';

export interface ActivityOption {
  id: string;
  title: string;
  duration: string;
  priceDelta: number;
  image: string;
  description: string;
}

export interface DayItinerary {
  dayNumber: number;
  dayTitle: string;
  destination: string;
  currentActivity: ActivityOption;
  alternativeActivities: ActivityOption[];
  hotelName: string;
  hotelTier: 'Comfort' | 'Superior' | 'Luxury 5-Star';
  mealsIncluded?: string[];
}

export interface HolidayPackage {
  id: string;
  title: string;
  destination: string;
  destinationType?: HolidayDestinationType;
  region?: string;
  theme?: HolidayTheme;
  category: 'Customized' | 'Fixed Departure' | 'Group Tour';
  durationDays: number;
  durationNights?: number;
  departureCities?: string[];
  basePrice: number;
  wholesaleCost: number;
  heroImage: string;
  galleryImages?: string[];
  highlights: string[];
  inclusions?: string[];
  exclusions?: string[];
  days: DayItinerary[];
  hotelTiers?: { standard: string; deluxe: string; luxury: string };
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent?: number;
  cancellationPolicy?: string;
}

export interface HolidayBookingRecord {
  id: string;
  bookingReference: string;
  packageId: string;
  packageTitle: string;
  destination: string;
  destinationType: HolidayDestinationType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureCity: string;
  travelDate: string;
  paxAdults: number;
  paxChildren: number;
  selectedHotelTier: 'Comfort' | 'Superior' | 'Luxury 5-Star';
  totalAmountUSD: number;
  wholesaleCostUSD: number;
  markupAmountUSD: number;
  status: HolidayBookingStatus;
  customNotes?: string;
  createdAt: string;
}

export interface FeaturedDestinationItem {
  name: string;
  imageUrl: string;
}

export interface TrustPillarItem {
  icon: string;
  title: string;
  description: string;
}

export interface AdminHolidayConfig {
  partnerMarkupPercent: number;
  groupDiscountPercent: number;
  tourManagerIncludedByDefault: boolean;
  supportHelpline: string;
  whatsappInquiryNumber: string;
  enableInstantBooking: boolean;
  heroHeadline?: string;
  heroSubheading?: string;
  featuredDestinations?: FeaturedDestinationItem[];
  announcementBanner?: string;
  announcementBannerEnabled?: boolean;
  assuranceTitle?: string;
  assuranceBadges?: string[];
  trustPillars?: TrustPillarItem[];
  loyaltyPointsRate?: number;
  hotelTierMultiplierComfort?: number;
  hotelTierMultiplierSuperior?: number;
  hotelTierMultiplierLuxury?: number;
}

// ======================== CHATBOT & CUSTOM TRIP INQUIRY TYPES ========================
export interface TravelInquiry {
  id: string;
  name: string;
  phone: string;
  travelType: 'Domestic' | 'International';
  destination: string;
  travelDates: string;
  travelers: number;
  service: string;
  timestamp: string;
  source: 'Chatbot' | 'CustomTripAI';
  notes?: string;
}

// ======================== REAL BOOKING RECORD & POLICY ========================
export type BookingStatus = 'confirmed' | 'pending_approval' | 'cancelled' | 'completed' | 'approved' | 'rejected';
export type BookingVertical = 'flight' | 'hotel' | 'visa' | 'holiday' | 'umrah' | 'mice';

export interface BookingPassenger {
  fullName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  specialRequests?: string;
}

export interface BookingRecord {
  id: string;
  referenceCode: string;
  bookingRef?: string;
  vertical: BookingVertical;
  title: string;
  subtitle: string;
  imageUrl: string;
  bookingDate: string;
  travelDates: string;
  travelDate?: string;
  travelerName?: string;
  passenger: BookingPassenger;
  paxCount: number;
  totalAmountUSD: number;
  totalCost?: number;
  appliedCurrency: CurrencyCode;
  convertedAmount: number;
  status: BookingStatus;
  policyCompliance: {
    inPolicy: boolean;
    reason?: string;
    approvedBy?: string;
    approvalDate?: string;
    rejectionReason?: string;
  };
  policyViolationReason?: string;
  addons: Array<{
    name: string;
    priceUSD: number;
  }>;
  paymentMethod: 'Corporate Credit Line' | 'Corporate Card' | 'Personal Visa' | 'Apple Pay';
  details: Record<string, any>;
}

export interface CorporateTravelPolicy {
  companyName: string;
  maxFlightBudgetUSD: number;
  maxFlightEconomyUSD?: number;
  maxFlightBusinessUSD?: number;
  businessRequiresApproval?: boolean;
  maxHotelNightlyUSD: number;
  allowBnB?: boolean;
  allowedCabinClass: CabinClass;
  requireAdvanceNoticeDays: number;
  autoApproveInPolicy: boolean;
  enableEmergencyAssistance: boolean;
}

export interface AdminMarkupConfig {
  flightsFlatUSD: number;
  hotelsPercent: number;
  umrahPercent: number;
  visasFlatUSD: number;
  holidaysPercent: number;
}

// ======================== LEGACY / AUDIT / COMPATIBILITY TYPES ========================
export type LeadPipelineStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Booking Confirmed' | 'Lost';

export interface LeadRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  vertical: 'Umrah' | 'Visa' | 'Holidays' | 'MICE';
  source: string;
  utmCampaign: string;
  assignedStaffId: string;
  assignedStaffName: string;
  pipelineStatus: LeadPipelineStatus;
  estimatedValue: number;
  createdAt: string;
  slaDeadline: string;
  isSlaViolated: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  activeLeads: number;
  conversionsThisMonth: number;
  conversionRate: number;
  avatar: string;
}

export interface VendorLedgerRecord {
  id: string;
  vendorName: string;
  vendorType: string;
  totalBookedAmount: number;
  amountPaid: number;
  pendingBalance: number;
  nextDueDate: string;
  isOverdue: boolean;
  reconciliationStatus: 'Reconciled' | 'Pending Review' | 'Disputed';
  paymentMode: string;
}

export interface OfflineRateSheet {
  id: string;
  vendorName: string;
  category: string;
  validFrom: string;
  validTo: string;
  unitPrice: number;
  currency: CurrencyCode;
  sourceTag: string;
  expiryWarning: boolean;
}

export interface InvoiceDocument {
  id: string;
  invoiceNumber: string;
  type: 'proforma' | 'tax_invoice' | 'credit_note';
  bookingOrQuoteId: string;
  clientOrAgencyName: string;
  dateIssued: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  grandTotal: number;
  isPaid: boolean;
  issuerDetails: {
    name: string;
    taxRegNumber: string;
    address: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'Markup' | 'Commission' | 'Refund' | 'Agency Tier' | 'Offline Rate' | 'Invoice' | 'Travel Policy' | 'Booking Approval';
  entityId: string;
  previousValue: string;
  newValue: string;
  ipAddress: string;
}

export interface AgencyBranding {
  agencyName: string;
  licenseNumber: string;
  logoUrl?: string;
  primaryColor: string;
  phone: string;
  email: string;
  address: string;
  footerDisclaimer: string;
}

export interface AgencyWallet {
  balance: number;
  creditLimit: number;
  usedCredit: number;
  availablePower: number;
  currency: CurrencyCode;
}

export interface QuotationRecord {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  vertical: string;
  packageTitle: string;
  pax: number;
  wholesaleSupplierCost: number;
  markupType: 'percentage' | 'flat';
  markupValue: number;
  clientSellingPrice: number;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Expired';
  agencyBrandingSnapshot: AgencyBranding;
  deliveryStatus: {
    downloaded: boolean;
    whatsappSent: boolean;
    emailSent: boolean;
    lastDeliveredAt?: string;
  };
}

export interface UmrahHotel {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah';
  stars: number;
  distanceMeters: number;
  distanceLabel: string;
  isShuttleService: boolean;
  image: string;
}

export interface UmrahPackage {
  id: string;
  title: string;
  type: 'fixed' | 'custom';
  badge?: string;
  durationNightsMakkah: number;
  durationNightsMadinah: number;
  makkahHotel: UmrahHotel;
  madinahHotel: UmrahHotel;
  flightIncluded: boolean;
  airline?: string;
  departureCity?: string;
  departureDates?: string[];
  pricingPerPax: {
    quad: number;
    triple: number;
    double: number;
    single: number;
  };
  ziyarahSites: any[];
  mutawwifGuideIncluded: boolean;
  zamzamWaterIncluded: boolean;
  nusukPermitSyncStatus: string;
  image: string;
  supplierWholesaleBaseCost: number;
}
