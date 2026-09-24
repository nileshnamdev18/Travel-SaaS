// Domain Types for TravelPulse AI Platform

export type PortalType = 'b2c' | 'b2b' | 'admin';

export type UserRole = 
  | 'traveler'
  | 'agency_agent'
  | 'agency_admin'
  | 'support_agent'
  | 'finance_admin'
  | 'super_admin';

export type CurrencyCode = 'USD' | 'SAR' | 'INR' | 'EUR' | 'AED';

export type ThemeMode = 'light' | 'dark';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToUSD: number; // e.g. USD = 1.0, SAR = 3.75, INR = 83.5, EUR = 0.92, AED = 3.67
}

// ======================== FLIGHT TYPES (Navan & Booking.com Benchmark) ========================
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
  inPolicy: boolean; // Corporate compliance indicator
  policyNote?: string;
  carbonKg: number;
  refundable: boolean;
}

// ======================== HOTEL TYPES (Booking.com Benchmark) ========================
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
  reviewScore: number; // e.g. 9.3
  reviewCount: number;
  distanceToCenter: string;
  distanceToHaramMeters?: number; // for Makkah / Madinah
  distanceToHaramLabel?: string;
  heroImage: string;
  galleryImages: string[];
  amenities: string[];
  tags: string[]; // e.g. 'Near Haram', 'Free Breakfast', 'Luxury Spa'
  basePriceUSD: number;
  inPolicy: boolean;
  rooms: HotelRoomTier[];
}

// ======================== UMRAH TYPES (umrahcenter.com benchmark) ========================
export type RoomSharingType = 'quad' | 'triple' | 'double' | 'single';

export interface ZiyarahSite {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah';
  description: string;
  isIncluded: boolean;
  durationHours: number;
}

export interface UmrahHotel {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah';
  stars: number;
  distanceMeters: number;
  distanceLabel: string; // e.g. "50m from Haram (Clock Tower)"
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
  ziyarahSites: ZiyarahSite[];
  mutawwifGuideIncluded: boolean;
  zamzamWaterIncluded: boolean; // 5L sealed container
  nusukPermitSyncStatus: 'Ready' | 'In Progress' | 'Requires Verification';
  image: string;
  supplierWholesaleBaseCost: number; // for B2B markup calculation
}

// ======================== VISA TYPES (visa2fly.com benchmark) ========================
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
}

export interface CountryVisaInfo {
  id: string;
  countryName: string;
  countryCode: string;
  flag: string;
  bannerImage: string;
  popular: boolean;
  requiresPassportOCR: boolean;
  options: VisaOption[];
  requirements: VisaDocumentRequirement[];
  icaoRules: string[];
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
  confidenceScore: number; // e.g. 99.4
}

export type VisaApplicationStatus = 
  | 'draft'
  | 'docs_uploaded'
  | 'ocr_verified'
  | 'embassy_processing'
  | 'approved'
  | 'rejected';

export interface VisaApplicationRecord {
  id: string;
  applicantName: string;
  passportNumber: string;
  country: string;
  visaType: string;
  status: VisaApplicationStatus;
  submissionDate: string;
  estimatedCompletion: string;
  ocrExtracted: boolean;
  whatsappNotified: boolean;
  trackingId: string;
}

// ======================== HOLIDAYS TYPES ========================
export interface ActivityOption {
  id: string;
  title: string;
  duration: string;
  priceDelta: number; // 0 for base, +$ for upgrade
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
}

export interface HolidayPackage {
  id: string;
  title: string;
  destination: string;
  category: 'Customized' | 'Fixed Departure';
  durationDays: number;
  basePrice: number;
  wholesaleCost: number;
  heroImage: string;
  highlights: string[];
  days: DayItinerary[];
}

// ======================== M.I.C.E. TYPES ========================
export interface MiceRfqForm {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paxCount: number;
  destination: string;
  eventType: 'Conference & Summit' | 'Incentive Trip' | 'Annual Gala' | 'Board Retreat';
  durationDays: number;
  cateringTier: 'Executive Standard' | 'Premium Gourmet' | 'Royal Banquet';
  requiresShuttleLogistics: boolean;
  requiresSimultaneousTranslation: boolean;
  specialRequests: string;
}

export interface MiceCopilotOutput {
  estimatedTotalMin: number;
  estimatedTotalMax: number;
  estimatedPerPax: number;
  recommendedVenues: string[];
  logisticsOverview: string;
  confidenceBand: string; // e.g. "± 6.5%"
}

// ======================== B2B AGENCY & CORPORATE TYPES ========================
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
  vertical: 'Umrah' | 'Visa' | 'Holidays' | 'MICE' | 'Flights' | 'Hotels';
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

// ======================== REAL BOOKING RECORD & POLICY ========================
export type BookingStatus = 'confirmed' | 'pending_approval' | 'cancelled' | 'completed' | 'approved' | 'rejected';
export type BookingVertical = 'flight' | 'hotel' | 'umrah' | 'visa' | 'holiday' | 'mice';

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
  referenceCode: string; // e.g. TP-FL-83921
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
  details: Record<string, any>; // Extra specific details (e.g., flight code, hotel address, room tier)
}

// Corporate Travel Policy Engine (Navan / TravelPerk Benchmark)
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

// Dynamic Platform Markup Config (Admin Managed)
export interface AdminMarkupConfig {
  flightsFlatUSD: number;
  hotelsPercent: number;
  umrahPercent: number;
  visasFlatUSD: number;
  holidaysPercent: number;
}

// ======================== SUPER ADMIN & OPERATIONS ========================
export type LeadPipelineStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Booking Confirmed' | 'Lost';

export interface LeadRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  vertical: 'Umrah' | 'Visa' | 'Holidays' | 'MICE';
  source: 'Google Ads Search' | 'Meta Reels / Ads' | 'TikTok Umrah Special' | 'Organic SEO' | 'Agent Referral';
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
  role: 'Sales Executive' | 'Reservations Specialist' | 'Umrah Ground Operations' | 'Visa Processing Desk';
  activeLeads: number;
  conversionsThisMonth: number;
  conversionRate: number; // percentage
  avatar: string;
}

export interface VendorLedgerRecord {
  id: string;
  vendorName: string;
  vendorType: 'Hotel Chain' | 'Aviation Block' | 'Transport Fleet' | 'Ground Ziyarah Operator' | 'Visa Facilitation';
  totalBookedAmount: number;
  amountPaid: number;
  pendingBalance: number;
  nextDueDate: string;
  isOverdue: boolean;
  reconciliationStatus: 'Reconciled' | 'Pending Review' | 'Disputed';
  paymentMode: 'Bank Wire' | 'Corporate Card' | 'Direct Gateway';
}

export interface OfflineRateSheet {
  id: string;
  vendorName: string;
  category: string; // e.g. "GMC Yukon Fleet - Makkah to Madinah"
  validFrom: string;
  validTo: string;
  unitPrice: number;
  currency: CurrencyCode;
  sourceTag: 'Offline/Manual' | 'API Feed';
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
  taxRatePercent: number; // VAT or GST
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
