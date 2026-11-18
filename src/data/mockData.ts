import {
  CurrencyConfig,
  UmrahPackage,
  CountryVisaInfo,
  HolidayPackage,
  AgencyBranding,
  AgencyWallet,
  QuotationRecord,
  LeadRecord,
  StaffMember,
  VendorLedgerRecord,
  OfflineRateSheet,
  AuditLogEntry,
  InvoiceDocument,
  FlightOption,
  HotelOption,
  BookingRecord,
  CorporateTravelPolicy,
  AdminMarkupConfig,
  Airport
} from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateToUSD: 1.0 },
  SAR: { code: 'SAR', symbol: 'SR', rateToUSD: 3.75 },
  INR: { code: 'INR', symbol: '₹', rateToUSD: 83.5 },
  AED: { code: 'AED', symbol: 'AED', rateToUSD: 3.67 },
  EUR: { code: 'EUR', symbol: '€', rateToUSD: 0.92 },
};

// ======================== UMRAH MOCK PACKAGES (umrahcenter.com style) ========================
export const INITIAL_UMRAH_PACKAGES: UmrahPackage[] = [
  {
    id: 'umrah-fixed-super-saver',
    title: 'Super Saver 14-Day Umrah Group Departure',
    type: 'fixed',
    badge: 'Best Value for Groups',
    durationNightsMakkah: 8,
    durationNightsMadinah: 6,
    makkahHotel: {
      id: 'h-makkah-kiswah',
      name: 'Al Kiswah Towers Hotel',
      city: 'Makkah',
      stars: 4,
      distanceMeters: 850,
      distanceLabel: '850m from Haram (24/7 Free AC Shuttle)',
      isShuttleService: true,
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    },
    madinahHotel: {
      id: 'h-madinah-taiba',
      name: 'Emaar Taiba Hotel',
      city: 'Madinah',
      stars: 4,
      distanceMeters: 250,
      distanceLabel: '250m from Masjid An-Nabawi (Gate 25)',
      isShuttleService: false,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    },
    flightIncluded: true,
    airline: 'Saudia Airlines (SV) Direct Group PNR',
    departureCity: 'Mumbai / Delhi / Dubai',
    departureDates: ['15 Oct 2026', '28 Oct 2026', '12 Nov 2026', '26 Nov 2026'],
    pricingPerPax: {
      quad: 980,
      triple: 1090,
      double: 1250,
      single: 1680,
    },
    supplierWholesaleBaseCost: 820,
    ziyarahSites: [
      { id: 'z1', name: 'Jabal al-Nour & Cave of Hira', city: 'Makkah', description: 'Mount of the first revelation', isIncluded: true, durationHours: 3 },
      { id: 'z2', name: 'Mina, Muzdalifah & Arafat', city: 'Makkah', description: 'Pilgrimage spiritual monuments', isIncluded: true, durationHours: 4 },
      { id: 'z3', name: 'Jabal Thawr', city: 'Makkah', description: 'Sanctuary of the Hijrah migration', isIncluded: true, durationHours: 2 },
      { id: 'z4', name: 'Masjid Quba', city: 'Madinah', description: 'First mosque built in Islam', isIncluded: true, durationHours: 2 },
      { id: 'z5', name: 'Mount Uhud & Martyrs Cemetery', city: 'Madinah', description: 'Historic battleground of Uhud', isIncluded: true, durationHours: 3 },
      { id: 'z6', name: 'Masjid Al-Qiblatayn', city: 'Madinah', description: 'Mosque of the Two Qiblas', isIncluded: true, durationHours: 1.5 },
    ],
    mutawwifGuideIncluded: true,
    zamzamWaterIncluded: true,
    nusukPermitSyncStatus: 'Ready',
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'umrah-vip-clocktower',
    title: '5-Star Royal Abraj Al-Bait & Haram View Umrah',
    type: 'fixed',
    badge: 'VIP Executive',
    durationNightsMakkah: 5,
    durationNightsMadinah: 5,
    makkahHotel: {
      id: 'h-makkah-swissotel',
      name: 'Swissôtel Al Maqam (Clock Tower)',
      city: 'Makkah',
      stars: 5,
      distanceMeters: 25,
      distanceLabel: 'Direct Haram Courtyard Access (0m Walk)',
      isShuttleService: false,
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
    },
    madinahHotel: {
      id: 'h-madinah-pullman',
      name: 'Pullman Zamzam Madinah',
      city: 'Madinah',
      stars: 5,
      distanceMeters: 60,
      distanceLabel: '60m from Prophet’s Mosque Main Plaza',
      isShuttleService: false,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    },
    flightIncluded: true,
    airline: 'Emirates / Saudia Business Class Option',
    departureCity: 'London / New York / Dubai / Mumbai',
    departureDates: ['05 Nov 2026', '20 Nov 2026', '10 Dec 2026'],
    pricingPerPax: {
      quad: 1850,
      triple: 2100,
      double: 2450,
      single: 3350,
    },
    supplierWholesaleBaseCost: 1540,
    ziyarahSites: [
      { id: 'z1', name: 'Private Luxury GMC Ziyarah - Makkah', city: 'Makkah', description: 'Cave Hira, Jabal Thawr, Exhibition of Two Holy Mosques Architecture', isIncluded: true, durationHours: 4 },
      { id: 'z2', name: 'Private Luxury GMC Ziyarah - Madinah', city: 'Madinah', description: 'Masjid Quba, Mount Uhud, Date Farms, King Fahd Holy Quran Printing Complex', isIncluded: true, durationHours: 4 },
    ],
    mutawwifGuideIncluded: true,
    zamzamWaterIncluded: true,
    nusukPermitSyncStatus: 'Ready',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
  }
];

// ======================== VISA MOCK CATALOG (visa2fly.com style) ========================
export const INITIAL_VISA_COUNTRIES: CountryVisaInfo[] = [
  {
    id: 'saudi-arabia',
    countryName: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    bannerImage: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
    popular: true,
    requiresPassportOCR: true,
    options: [
      {
        id: 'sa-umrah-tourist',
        title: 'Tourist & Umrah 1-Year eVisa (Multiple Entry)',
        validityDays: 365,
        maxStayDays: 90,
        entryType: 'Multiple',
        processingTimeStandard: '24–48 Hours',
        processingTimeExpress: 'Instant / 4 Hours',
        govFee: 110,
        platformFee: 25,
        expressSurcharge: 30,
      },
      {
        id: 'sa-single-entry',
        title: 'Single Entry Tourist Visa (30 Days)',
        validityDays: 90,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: '48–72 Hours',
        govFee: 85,
        platformFee: 20,
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Bio Page', description: 'Valid minimum 6 months from intended date of entry', isRequired: true, acceptedFormats: 'PDF, JPG, PNG' },
      { id: 'r2', title: 'Passport-Size Digital Photograph', description: 'White background, 200x200px min, ICAO standard, no glare', isRequired: true, acceptedFormats: 'JPG, PNG' },
      { id: 'r3', title: 'Confirmed Flight Itinerary or PNR', description: 'Return or onward flight ticket', isRequired: false, acceptedFormats: 'PDF' },
    ],
    icaoRules: [
      'Neutral facial expression with mouth closed and eyes directly facing camera',
      'Solid pure white background with uniform studio lighting (no shadows)',
      'Face covers between 70% to 80% of the total frame height',
      'No spectacles with tinted glasses or headgear obstructing hairline unless religious'
    ]
  },
  {
    id: 'uae',
    countryName: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    bannerImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    popular: true,
    requiresPassportOCR: true,
    options: [
      {
        id: 'uae-30d-single',
        title: 'Dubai 30 Days Tourist Visa',
        validityDays: 60,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: '24–36 Hours',
        processingTimeExpress: '6 Hours Express',
        govFee: 85,
        platformFee: 18,
        expressSurcharge: 25,
      },
      {
        id: 'uae-60d-multiple',
        title: 'Dubai 60 Days Multiple Entry Long Stay',
        validityDays: 60,
        maxStayDays: 60,
        entryType: 'Multiple',
        processingTimeStandard: '48 Hours',
        govFee: 180,
        platformFee: 30,
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Front & Back Copies', description: 'Color scans of first and last pages', isRequired: true, acceptedFormats: 'PDF, JPG' },
      { id: 'r2', title: 'White Background Photo', description: 'Recent color photograph, ICAO standard', isRequired: true, acceptedFormats: 'JPG, PNG' },
    ],
    icaoRules: [
      'Plain white background, high resolution 300 DPI',
      'Full face visible without hair covering forehead or ears',
      'No filters or software touch-ups'
    ]
  },
  {
    id: 'schengen',
    countryName: 'Schengen Area (France / Switzerland / Italy)',
    countryCode: 'EU',
    flag: '🇪🇺',
    bannerImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    popular: true,
    requiresPassportOCR: true,
    options: [
      {
        id: 'schengen-tourist-c',
        title: 'Type C Short Stay Tourist Visa',
        validityDays: 180,
        maxStayDays: 90,
        entryType: 'Multiple',
        processingTimeStandard: '12–15 Working Days',
        govFee: 90,
        platformFee: 35,
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Valid for 3 Months beyond stay', description: 'Must have at least 2 blank pages', isRequired: true, acceptedFormats: 'PDF' },
      { id: 'r2', title: 'ICAO Biometric Photos (35mm x 45mm)', description: 'Taken within last 6 months', isRequired: true, acceptedFormats: 'JPG' },
      { id: 'r3', title: 'Travel Medical Insurance (€30,000 min)', description: 'Covering repatriation and hospital emergencies', isRequired: true, acceptedFormats: 'PDF' },
      { id: 'r4', title: '6-Months Bank Statement', description: 'Stamped by bank with sufficient proof of funds', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: [
      'Strict 35mm x 45mm dimensions',
      'Light grey or white background',
      'No teeth showing, neutral gaze'
    ]
  },
  {
    id: 'singapore',
    countryName: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    bannerImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    popular: true,
    requiresPassportOCR: true,
    options: [
      {
        id: 'sg-evisa-30',
        title: 'Singapore e-Visa (Entry Visa)',
        validityDays: 35,
        maxStayDays: 30,
        entryType: 'Multiple',
        processingTimeStandard: '3–4 Working Days',
        govFee: 30,
        platformFee: 15,
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Biodata Page', description: 'Clear scan showing MRZ codes', isRequired: true, acceptedFormats: 'JPG, PDF' },
      { id: 'r2', title: 'Digital Photo with Matte Finish Look', description: 'ICAO standard with pure white background', isRequired: true, acceptedFormats: 'JPG' },
    ],
    icaoRules: [
      'Pure white background, 400x514 pixels minimum',
      'Eyes clearly open and visible without reflections'
    ]
  }
];

// ======================== HOLIDAYS MOCK PACKAGES ========================
export const INITIAL_HOLIDAYS: HolidayPackage[] = [
  {
    id: 'kashmir-alpine',
    title: 'Kashmir Majestic Valleys & Alpine Gondola Odyssey',
    destination: 'Kashmir, India',
    category: 'Customized',
    durationDays: 6,
    basePrice: 650,
    wholesaleCost: 510,
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80',
    highlights: ['Luxury Dal Lake Houseboat Stay', 'Gulmarg Gondola Cable Car Ride', 'Pahalgam Betaab Valley Safari', 'Saffron Heritage Walk in Pampore'],
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Srinagar & Dal Lake Sunset Shikara',
        destination: 'Srinagar',
        currentActivity: {
          id: 'act-shikara',
          title: 'Sunset Shikara Cruise across Floating Gardens',
          duration: '2 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80',
          description: 'Glide peacefully across serene waters witnessing majestic mountain reflections.'
        },
        alternativeActivities: [
          {
            id: 'act-heritage-walk',
            title: 'Old City Artisan & Pashmina Weaver Trail',
            duration: '3 Hours',
            priceDelta: 25,
            image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=500&q=80',
            description: 'Visit century-old wooden mosques and meet master silk carpet weavers.'
          },
          {
            id: 'act-heli-flight',
            title: 'Private Srinagar City Helicopter Scenic Tour',
            duration: '30 Mins',
            priceDelta: 160,
            image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=500&q=80',
            description: 'Aerial panoramic vantage of Shankaracharya Temple and Zabarwan range.'
          }
        ],
        hotelName: 'Mascot Heritage Luxury Houseboat',
        hotelTier: 'Superior'
      },
      {
        dayNumber: 2,
        dayTitle: 'Gulmarg Meadow of Flowers & Snow Glaciers',
        destination: 'Gulmarg',
        currentActivity: {
          id: 'act-gondola-p1',
          title: 'Gulmarg Gondola Cable Car (Phase 1 Kongdoori)',
          duration: '4 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=500&q=80',
          description: 'Ascend to 10,000 feet amidst pine forests and snowy meadows.'
        },
        alternativeActivities: [
          {
            id: 'act-gondola-p2',
            title: 'High-Altitude Gondola Phase 2 Apharwat Peak (13,780 ft)',
            duration: 'Full Day',
            priceDelta: 45,
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80',
            description: 'Reach the edge of perpetual alpine glaciers with guided safety escort.'
          }
        ],
        hotelName: 'The Khyber Himalayan Resort & Spa',
        hotelTier: 'Luxury 5-Star'
      },
      {
        dayNumber: 3,
        dayTitle: 'Pahalgam Valley of Shepherds & River Rafting',
        destination: 'Pahalgam',
        currentActivity: {
          id: 'act-betaab',
          title: 'Betaab Valley & Aru Pine Woods Excursion',
          duration: '5 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
          description: 'Picturesque valley framed by babbling streams and snow-clad peaks.'
        },
        alternativeActivities: [
          {
            id: 'act-pony-baisaran',
            title: 'Equestrian Pony Trek to Baisaran Mini-Switzerland',
            duration: '3.5 Hours',
            priceDelta: 30,
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
            description: 'Trek up emerald hill glades with panoramic views of the Lidder Valley.'
          }
        ],
        hotelName: 'Pahalgam Hotel Lidder Riverside',
        hotelTier: 'Superior'
      }
    ]
  },
  {
    id: 'bali-luxury',
    title: 'Bali Tropical Luxury: Ubud Terraces & Uluwatu Clifftops',
    destination: 'Bali, Indonesia',
    category: 'Customized',
    durationDays: 7,
    basePrice: 890,
    wholesaleCost: 710,
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    highlights: ['Private Infinity Pool Villa in Ubud', 'Nusa Penida Kelingking Beach Fastboat', 'Uluwatu Sunset Kecak Fire Dance', 'Floating Breakfast & Spa Rituals'],
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival in Denpasar & Ubud Rainforest Welcome',
        destination: 'Ubud',
        currentActivity: {
          id: 'act-ubud-walk',
          title: 'Tegallalang Emerald Rice Terraces & Jungle Swing',
          duration: '3 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=500&q=80',
          description: 'Wander sculpted rice paddies and experience the world-famous jungle swing.'
        },
        alternativeActivities: [
          {
            id: 'act-ubud-spa',
            title: 'Royal Balinese Herbal Boreh 2-Hour Spa Ritual',
            duration: '2 Hours',
            priceDelta: 50,
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80',
            description: 'Relax with traditional volcanic warm clay wrap and flower petal bath.'
          }
        ],
        hotelName: 'The Kayon Jungle Resort Ubud',
        hotelTier: 'Luxury 5-Star'
      }
    ]
  }
];

// ======================== M.I.C.E. MOCK DATA ========================
export const MICE_VENUES = [
  { name: 'Grand Hyatt Convention Center, Dubai', maxPax: 2200, stars: 5, hallAreaSqM: 4500, airportDistKm: 12 },
  { name: 'Madinat Jumeirah Conference Arena, Dubai', maxPax: 1800, stars: 5, hallAreaSqM: 3800, airportDistKm: 25 },
  { name: 'Swissôtel The Bosphorus Congress Hub, Istanbul', maxPax: 900, stars: 5, hallAreaSqM: 2100, airportDistKm: 35 },
  { name: 'Riyadh International Convention & Exhibition Centre', maxPax: 5000, stars: 5, hallAreaSqM: 10000, airportDistKm: 20 },
];

// ======================== B2B AGENCY PROFILE ========================
export const INITIAL_AGENCY_BRANDING: AgencyBranding = {
  agencyName: 'Al-Safwa Global Travel & Tours',
  licenseNumber: 'IATA-96284102 / KSA-UMR-4019',
  logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=120&q=80',
  primaryColor: '#0d9488',
  phone: '+971 4 388 9011',
  email: 'bookings@alsafwatravel.com',
  address: 'Suite 1402, Al-Barsha Business Center, Dubai, UAE',
  footerDisclaimer: 'Prices are valid for 7 calendar days. Government visa fees are subject to embassy regulation updates.'
};

export const INITIAL_AGENCY_WALLET: AgencyWallet = {
  balance: 34250,
  creditLimit: 75000,
  usedCredit: 18400,
  availablePower: 90850,
  currency: 'USD'
};

export const INITIAL_QUOTATIONS: QuotationRecord[] = [
  {
    id: 'qt-1001',
    quoteNumber: 'QT-2026-0891',
    clientName: 'Dr. Tariq Al-Hashimi & Family',
    clientPhone: '+966 50 123 4567',
    clientEmail: 'tariq.hashimi@corp.sa',
    vertical: 'Umrah',
    packageTitle: 'Super Saver 14-Day Umrah Group Departure (Quad Sharing)',
    pax: 4,
    wholesaleSupplierCost: 3280, // $820 x 4
    markupType: 'percentage',
    markupValue: 12,
    clientSellingPrice: 3673.6,
    validUntil: '2026-10-15',
    status: 'Sent',
    agencyBrandingSnapshot: INITIAL_AGENCY_BRANDING,
    deliveryStatus: {
      downloaded: true,
      whatsappSent: true,
      emailSent: true,
      lastDeliveredAt: '2026-09-22 14:15'
    }
  },
  {
    id: 'qt-1002',
    quoteNumber: 'QT-2026-0892',
    clientName: 'Apex Infotech Executive Delegation',
    clientPhone: '+91 98201 44556',
    clientEmail: 'procurement@apexinfotech.in',
    vertical: 'Visa',
    packageTitle: 'Dubai 30 Days Tourist Visa (Express)',
    pax: 15,
    wholesaleSupplierCost: 1545, // ($85 + $18) x 15
    markupType: 'flat',
    markupValue: 300,
    clientSellingPrice: 1845,
    validUntil: '2026-09-30',
    status: 'Draft',
    agencyBrandingSnapshot: INITIAL_AGENCY_BRANDING,
    deliveryStatus: {
      downloaded: false,
      whatsappSent: false,
      emailSent: false
    }
  }
];

// ======================== SUPER ADMIN CRM & OPERATIONS ========================
export const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'lead-701',
    clientName: 'Rashid Khan',
    clientPhone: '+971 52 884 1920',
    clientEmail: 'rashid.k@emiratesoil.ae',
    vertical: 'Umrah',
    source: 'Google Ads Search',
    utmCampaign: 'umrah_clocktower_vip_2026',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Tariq Mansoor',
    pipelineStatus: 'Quotation Sent',
    estimatedValue: 4900,
    createdAt: '2026-09-22 09:30',
    slaDeadline: '2026-09-22 11:30',
    isSlaViolated: false
  },
  {
    id: 'lead-702',
    clientName: 'Ananya Deshmukh',
    clientPhone: '+91 99300 28190',
    clientEmail: 'ananya.d@fintechmumbai.com',
    vertical: 'Holidays',
    source: 'Meta Reels / Ads',
    utmCampaign: 'kashmir_autumn_honeymoon',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Fatima Zahra',
    pipelineStatus: 'Contacted',
    estimatedValue: 1950,
    createdAt: '2026-09-22 10:15',
    slaDeadline: '2026-09-22 12:15',
    isSlaViolated: false
  },
  {
    id: 'lead-703',
    clientName: 'Nabil Al-Zahrani',
    clientPhone: '+966 54 330 9182',
    clientEmail: 'nabil@alzahranicorp.com',
    vertical: 'MICE',
    source: 'Organic SEO',
    utmCampaign: 'organic_mice_dubai_summit',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Omar Al-Sayed',
    pipelineStatus: 'New',
    estimatedValue: 28000,
    createdAt: '2026-09-22 11:45',
    slaDeadline: '2026-09-22 13:45',
    isSlaViolated: false
  },
  {
    id: 'lead-704',
    clientName: 'Kareem Mostafa',
    clientPhone: '+20 100 293 8471',
    clientEmail: 'kareem.m@cairoventures.eg',
    vertical: 'Visa',
    source: 'TikTok Umrah Special',
    utmCampaign: 'saudi_evisa_instant_promo',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Tariq Mansoor',
    pipelineStatus: 'Booking Confirmed',
    estimatedValue: 810,
    createdAt: '2026-09-21 16:00',
    slaDeadline: '2026-09-21 18:00',
    isSlaViolated: false
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Tariq Mansoor',
    role: 'Sales Executive',
    activeLeads: 14,
    conversionsThisMonth: 18,
    conversionRate: 34.2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'staff-2',
    name: 'Fatima Zahra',
    role: 'Reservations Specialist',
    activeLeads: 19,
    conversionsThisMonth: 23,
    conversionRate: 42.6,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'staff-3',
    name: 'Omar Al-Sayed',
    role: 'Umrah Ground Operations',
    activeLeads: 8,
    conversionsThisMonth: 15,
    conversionRate: 58.0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  }
];

export const INITIAL_VENDOR_LEDGER: VendorLedgerRecord[] = [
  {
    id: 'v-101',
    vendorName: 'Accor Hospitality (Clock Tower Makkah & Madinah)',
    vendorType: 'Hotel Chain',
    totalBookedAmount: 184500,
    amountPaid: 120000,
    pendingBalance: 64500,
    nextDueDate: '2026-09-28',
    isOverdue: false,
    reconciliationStatus: 'Reconciled',
    paymentMode: 'Bank Wire'
  },
  {
    id: 'v-102',
    vendorName: 'Saudia Airlines Group Sales Desk',
    vendorType: 'Aviation Block',
    totalBookedAmount: 95000,
    amountPaid: 95000,
    pendingBalance: 0,
    nextDueDate: '2026-10-15',
    isOverdue: false,
    reconciliationStatus: 'Reconciled',
    paymentMode: 'Direct Gateway'
  },
  {
    id: 'v-103',
    vendorName: 'Al-Wessam VIP GMC & Luxury Coaster Fleet',
    vendorType: 'Transport Fleet',
    totalBookedAmount: 34200,
    amountPaid: 18000,
    pendingBalance: 16200,
    nextDueDate: '2026-09-24',
    isOverdue: true,
    reconciliationStatus: 'Pending Review',
    paymentMode: 'Corporate Card'
  },
  {
    id: 'v-104',
    vendorName: 'Saudi Ministry of Foreign Affairs (Nusuk Platform)',
    vendorType: 'Visa Facilitation',
    totalBookedAmount: 42100,
    amountPaid: 38000,
    pendingBalance: 4100,
    nextDueDate: '2026-10-01',
    isOverdue: false,
    reconciliationStatus: 'Reconciled',
    paymentMode: 'Direct Gateway'
  }
];

export const INITIAL_OFFLINE_RATES: OfflineRateSheet[] = [
  {
    id: 'off-1',
    vendorName: 'Al-Shohada Hotel Makkah (Direct Contract)',
    category: 'Deluxe Quad Room (Per Night)',
    validFrom: '2026-09-01',
    validTo: '2026-11-30',
    unitPrice: 145,
    currency: 'USD',
    sourceTag: 'Offline/Manual',
    expiryWarning: false
  },
  {
    id: 'off-2',
    vendorName: 'Al-Buraq Transport Makkah',
    category: 'GMC Yukon XL Private Transfer (Jeddah to Makkah)',
    validFrom: '2026-08-01',
    validTo: '2026-09-30',
    unitPrice: 220,
    currency: 'USD',
    sourceTag: 'Offline/Manual',
    expiryWarning: true // expires in 8 days!
  },
  {
    id: 'off-3',
    vendorName: 'Kashmir Alpine Guides Union',
    category: 'Apharwat Peak Mountaineering Guide per Pax',
    validFrom: '2026-06-01',
    validTo: '2026-12-31',
    unitPrice: 35,
    currency: 'USD',
    sourceTag: 'Offline/Manual',
    expiryWarning: false
  }
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-22 13:40:12',
    actorName: 'Super Admin',
    actorRole: 'super_admin',
    action: 'Commission Override Approved',
    entityType: 'Commission',
    entityId: 'agency-al-safwa',
    previousValue: 'Wholesale Base + 8%',
    newValue: 'Wholesale Base + 12% Gold Tier',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-22 11:22:45',
    actorName: 'Super Admin',
    actorRole: 'super_admin',
    action: 'Vendor Wire Remittance Recorded',
    entityType: 'Offline Rate',
    entityId: 'v-101',
    previousValue: 'Owed: $184,500',
    newValue: 'Paid $120,000, Pending $64,500',
    ipAddress: '192.168.1.118'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-21 17:05:01',
    actorName: 'Super Admin',
    actorRole: 'super_admin',
    action: 'Markup Adjusted on Proposal QT-2026-0891',
    entityType: 'Markup',
    entityId: 'qt-1001',
    previousValue: 'Flat $200',
    newValue: 'Percentage 12% (+$393.60)',
    ipAddress: '185.22.140.91'
  }
];

export const INITIAL_INVOICES: InvoiceDocument[] = [
  {
    id: 'inv-8901',
    invoiceNumber: 'TX-2026-00412',
    type: 'tax_invoice',
    bookingOrQuoteId: 'qt-1001',
    clientOrAgencyName: 'Dr. Tariq Al-Hashimi',
    dateIssued: '2026-09-22',
    dueDate: '2026-09-29',
    items: [
      { description: 'Super Saver 14-Day Umrah Package (Quad Sharing x 4 Pax)', quantity: 4, unitPrice: 918.4, total: 3673.6 },
      { description: '5L Sealed Zamzam Containers Compliment Delivery', quantity: 4, unitPrice: 0, total: 0 },
      { description: 'Ministry of Hajj & Umrah Ground Handling Fee', quantity: 4, unitPrice: 25, total: 100 },
    ],
    subtotal: 3773.6,
    taxRatePercent: 5,
    taxAmount: 188.68,
    grandTotal: 3962.28,
    isPaid: true,
    issuerDetails: {
      name: 'TravelPulse AI Global Platform Ltd.',
      taxRegNumber: 'VAT-SA-310928419200003',
      address: 'King Fahd Road, Al-Olaya, Riyadh 12214, Saudi Arabia'
    }
  }
];

// ======================== AIRPORTS DATA ========================
export const AIRPORTS: Airport[] = [
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'United Arab Emirates' },
  { code: 'LHR', city: 'London', name: 'London Heathrow Airport', country: 'United Kingdom' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International Airport', country: 'Saudi Arabia' },
  { code: 'MED', city: 'Madinah', name: 'Prince Mohammad Bin Abdulaziz Airport', country: 'Saudi Arabia' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport', country: 'United States' },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi Airport', country: 'Singapore' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France' },
  { code: 'DPS', city: 'Bali', name: 'Ngurah Rai International Airport', country: 'Indonesia' },
  { code: 'HND', city: 'Tokyo', name: 'Tokyo Haneda Airport', country: 'Japan' }
];

// ======================== FLIGHTS MOCK DATA (Navan / Booking.com Benchmark) ========================
export const INITIAL_FLIGHTS: FlightOption[] = [
  {
    id: 'fl-ek-001',
    airline: 'Emirates',
    airlineCode: 'EK-204',
    airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    origin: 'LHR',
    originCity: 'London',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureDate: '2026-10-14',
    departureTime: '08:40',
    arrivalTime: '18:50',
    duration: '7h 10m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 520,
    baggageAllowance: '30 kg Checked + 7 kg Cabin',
    seatsAvailable: 9,
    inPolicy: true,
    policyNote: 'Complies with Corporate Travel Cap ($750)',
    carbonKg: 340,
    refundable: true
  },
  {
    id: 'fl-sv-002',
    airline: 'Saudia Airlines',
    airlineCode: 'SV-116',
    airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
    origin: 'LHR',
    originCity: 'London',
    destination: 'JED',
    destinationCity: 'Jeddah',
    departureDate: '2026-10-15',
    departureTime: '13:15',
    arrivalTime: '21:30',
    duration: '6h 15m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 590,
    baggageAllowance: '2 x 23 kg Checked + 7 kg Cabin',
    seatsAvailable: 14,
    inPolicy: true,
    policyNote: 'Direct Umrah Corridor Flight • In Policy',
    carbonKg: 310,
    refundable: true
  },
  {
    id: 'fl-qr-003',
    airline: 'Qatar Airways',
    airlineCode: 'QR-008',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
    origin: 'JFK',
    originCity: 'New York',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureDate: '2026-10-18',
    departureTime: '21:00',
    arrivalTime: '20:15 (+1d)',
    duration: '15h 15m',
    stops: 1,
    stopCities: ['Doha (DOH) 1h 45m layover'],
    cabinClass: 'Economy',
    basePriceUSD: 720,
    baggageAllowance: '2 x 23 kg Checked + 7 kg Cabin',
    seatsAvailable: 6,
    inPolicy: true,
    policyNote: 'Within NYC-DXB Global Cap',
    carbonKg: 680,
    refundable: false
  },
  {
    id: 'fl-ek-biz-004',
    airline: 'Emirates',
    airlineCode: 'EK-206',
    airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    origin: 'LHR',
    originCity: 'London',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureDate: '2026-10-20',
    departureTime: '14:20',
    arrivalTime: '00:30 (+1d)',
    duration: '7h 10m',
    stops: 0,
    cabinClass: 'Business',
    basePriceUSD: 2450,
    baggageAllowance: '40 kg Checked + 2 x 7 kg Cabin + Chauffeur',
    seatsAvailable: 4,
    inPolicy: false,
    policyNote: 'Exceeds Economy Class Policy Rule (Approval Required)',
    carbonKg: 890,
    refundable: true
  },
  {
    id: 'fl-sq-005',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ-317',
    airlineLogo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=120&q=80',
    origin: 'LHR',
    originCity: 'London',
    destination: 'SIN',
    destinationCity: 'Singapore',
    departureDate: '2026-10-22',
    departureTime: '11:25',
    arrivalTime: '07:30 (+1d)',
    duration: '13h 05m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 680,
    baggageAllowance: '30 kg Checked + 7 kg Cabin',
    seatsAvailable: 11,
    inPolicy: true,
    policyNote: 'World Best Airline Rating • In Policy',
    carbonKg: 610,
    refundable: true
  },
  {
    id: 'fl-ba-006',
    airline: 'British Airways',
    airlineCode: 'BA-107',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
    origin: 'LHR',
    originCity: 'London',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureDate: '2026-10-24',
    departureTime: '12:50',
    arrivalTime: '23:05',
    duration: '7h 15m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 495,
    baggageAllowance: '23 kg Checked + 8 kg Cabin',
    seatsAvailable: 8,
    inPolicy: true,
    policyNote: 'Best Fare for Corporate Route',
    carbonKg: 350,
    refundable: true
  },
  {
    id: 'fl-6e-bom-dxb',
    airline: 'IndiGo',
    airlineCode: '6E-1453',
    airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    origin: 'BOM',
    originCity: 'Mumbai',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureDate: '2026-10-15',
    departureTime: '06:15',
    arrivalTime: '08:05',
    duration: '3h 20m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 195,
    baggageAllowance: '30 kg Checked + 7 kg Cabin',
    seatsAvailable: 18,
    inPolicy: true,
    policyNote: 'Lowest Fare Guarantee • Instant E-Ticket',
    carbonKg: 180,
    refundable: true
  },
  {
    id: 'fl-ek-bom-dxb',
    airline: 'Emirates',
    airlineCode: 'EK-501',
    airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    origin: 'BOM',
    originCity: 'Mumbai',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureDate: '2026-10-15',
    departureTime: '04:30',
    arrivalTime: '06:15',
    duration: '3h 15m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 285,
    baggageAllowance: '35 kg Checked + 7 kg Cabin + Hot Meal',
    seatsAvailable: 9,
    inPolicy: true,
    policyNote: 'Complimentary In-Flight Dining • In Policy',
    carbonKg: 210,
    refundable: true
  },
  {
    id: 'fl-ai-del-lhr',
    airline: 'Air India',
    airlineCode: 'AI-161',
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
    origin: 'DEL',
    originCity: 'Delhi',
    destination: 'LHR',
    destinationCity: 'London',
    departureDate: '2026-10-16',
    departureTime: '02:45',
    arrivalTime: '07:30',
    duration: '9h 15m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 420,
    baggageAllowance: '2 x 23 kg Checked + 8 kg Cabin',
    seatsAvailable: 12,
    inPolicy: true,
    policyNote: 'Direct Non-Stop Flight • In Policy',
    carbonKg: 490,
    refundable: true
  },
  {
    id: 'fl-sv-bom-jed',
    airline: 'Saudia Airlines',
    airlineCode: 'SV-741',
    airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
    origin: 'BOM',
    originCity: 'Mumbai',
    destination: 'JED',
    destinationCity: 'Jeddah',
    departureDate: '2026-10-17',
    departureTime: '08:30',
    arrivalTime: '11:45',
    duration: '5h 45m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 310,
    baggageAllowance: '2 x 23 kg Checked + 5L Zamzam Allowance',
    seatsAvailable: 24,
    inPolicy: true,
    policyNote: 'Official Holy Umrah Carrier • Direct Group PNR',
    carbonKg: 310,
    refundable: true
  },
  {
    id: 'fl-6e-del-bom',
    airline: 'IndiGo',
    airlineCode: '6E-2051',
    airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    origin: 'DEL',
    originCity: 'Delhi',
    destination: 'BOM',
    destinationCity: 'Mumbai',
    departureDate: '2026-10-15',
    departureTime: '07:00',
    arrivalTime: '09:15',
    duration: '2h 15m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 75,
    baggageAllowance: '15 kg Checked + 7 kg Cabin',
    seatsAvailable: 16,
    inPolicy: true,
    policyNote: 'Domestic High-Frequency Trunk Route',
    carbonKg: 95,
    refundable: true
  },
  {
    id: 'fl-sq-blr-sin',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ-503',
    airlineLogo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=120&q=80',
    origin: 'BLR',
    originCity: 'Bengaluru',
    destination: 'SIN',
    destinationCity: 'Singapore',
    departureDate: '2026-10-18',
    departureTime: '23:10',
    arrivalTime: '06:10 (+1d)',
    duration: '4h 30m',
    stops: 0,
    cabinClass: 'Economy',
    basePriceUSD: 240,
    baggageAllowance: '30 kg Checked + 7 kg Cabin',
    seatsAvailable: 10,
    inPolicy: true,
    policyNote: 'Top Rated Airline • Free In-Flight Entertainment',
    carbonKg: 220,
    refundable: true
  }
];

// ======================== HOTELS MOCK DATA (Booking.com Benchmark) ========================
export const INITIAL_HOTELS: HotelOption[] = [
  {
    id: 'ht-swissotel-makkah',
    name: 'Swissôtel Al Maqam Makkah',
    city: 'Makkah',
    country: 'Saudi Arabia',
    address: 'Abraj Al-Bait Complex, King Abdulaziz Endowment, Makkah',
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 3840,
    distanceToCenter: 'Direct Courtyard Access (25m)',
    distanceToHaramMeters: 25,
    distanceToHaramLabel: 'Direct Haram Courtyard Walk (0 min)',
    heroImage: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Direct Haram Access', 'Free High-Speed WiFi', 'Al-Khair Restaurant', '24/7 Room Service', 'Concierge Desk', 'Soundproof Suites'],
    tags: ['Near Haram', '5-Star Luxury', 'Nusuk Verified', 'Free Breakfast Option'],
    basePriceUSD: 240,
    inPolicy: true,
    rooms: [
      {
        id: 'rm-classic-haram',
        title: 'Classic King Room with Partial Haram View',
        bedType: '1 Extra-Large Double Bed',
        maxGuests: 2,
        pricePerNightUSD: 240,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
        features: ['38 m²', 'Haram Audio Feed', 'En-suite Marble Bathroom', 'City & Courtyard View']
      },
      {
        id: 'rm-exec-kaaba',
        title: 'Executive Panoramic Kaaba View Suite',
        bedType: '1 King Bed + 1 Sofa Bed',
        maxGuests: 3,
        pricePerNightUSD: 410,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        features: ['54 m²', 'Direct Unobstructed Kaaba View', 'Lounge Access', 'Personal Butler Service']
      }
    ]
  },
  {
    id: 'ht-pullman-madinah',
    name: 'Pullman Zamzam Madinah',
    city: 'Madinah',
    country: 'Saudi Arabia',
    address: 'Amr Bin Al-Aas Street, Central Area, Madinah',
    starRating: 5,
    reviewScore: 9.2,
    reviewCount: 2910,
    distanceToCenter: '60m to Gate 25',
    distanceToHaramMeters: 60,
    distanceToHaramLabel: '60m from Prophet’s Mosque Courtyard',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['60m to Gate 25', 'Free WiFi', 'International Buffet', 'Disabled Access', 'Underground Valet'],
    tags: ['Courtyard View', '5-Star', 'Umrah Top Pick'],
    basePriceUSD: 195,
    inPolicy: true,
    rooms: [
      {
        id: 'rm-madinah-deluxe',
        title: 'Deluxe Twin Room with Courtyard View',
        bedType: '2 Single Beds',
        maxGuests: 2,
        pricePerNightUSD: 195,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
        features: ['32 m²', 'View of Green Dome Area', 'Tea/Coffee Maker', 'Walk-in Rain Shower']
      }
    ]
  },
  {
    id: 'ht-atlantis-dubai',
    name: 'Atlantis The Royal Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Palm Jumeirah, Crescent Rd, Dubai',
    starRating: 5,
    reviewScore: 9.6,
    reviewCount: 4120,
    distanceToCenter: '15 min to Marina',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Beach', 'Infinity Sky Pool', '17 Michelin Restaurants', 'Helipad', 'Luxury Spa', 'Free Valet'],
    tags: ['Ultra Luxury', 'Iconic Landmark', 'Private Beach'],
    basePriceUSD: 520,
    inPolicy: false,
    rooms: [
      {
        id: 'rm-atlantis-seaview',
        title: 'Seascape King Room with Palm Terrace',
        bedType: '1 Extra-Large Double Bed',
        maxGuests: 2,
        pricePerNightUSD: 520,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        features: ['55 m²', 'Panoramic Palm Jumeirah Balcony', 'Smart Room Controls', 'Bespoke Amenities']
      }
    ]
  },
  {
    id: 'ht-ritz-paris',
    name: 'Hôtel Plaza Athénée & Spa',
    city: 'Paris',
    country: 'France',
    address: '25 Avenue Montaigne, 75008 Paris',
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 1840,
    distanceToCenter: '5 min to Champs-Élysées',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Eiffel Tower Views', 'Dior Spa', 'Courtyard Garden', 'Michelin-Starred Dining', 'Limousine Transfer'],
    tags: ['Haute Couture', 'Eiffel View', 'Historic Landmark'],
    basePriceUSD: 680,
    inPolicy: false,
    rooms: [
      {
        id: 'rm-paris-deluxe',
        title: 'Deluxe Parisian Suite with Eiffel Balcony',
        bedType: '1 King Bed',
        maxGuests: 2,
        pricePerNightUSD: 680,
        freeBreakfast: true,
        freeCancellation: false,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
        features: ['45 m²', 'View of Eiffel Tower', 'Classic Louis XVI Decor', 'Dior Bath Products']
      }
    ]
  },
  {
    id: 'ht-bali-fourseasons',
    name: 'Four Seasons Resort Bali at Jimbaran Bay',
    city: 'Bali',
    country: 'Indonesia',
    address: 'Jimbaran Bay, Kuta Selatan, Bali',
    starRating: 5,
    reviewScore: 9.7,
    reviewCount: 2280,
    distanceToCenter: 'Beachfront Resort',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Plunge Pool', 'Beach Club', 'Holistic Balinese Spa', 'Ocean Sunset Yoga', 'Butler Service'],
    tags: ['Private Villa', 'Beachfront', 'Honeymoon Favorite'],
    basePriceUSD: 360,
    inPolicy: false,
    rooms: [
      {
        id: 'rm-bali-ocean-villa',
        title: 'Ocean View Pool Villa with Private Garden',
        bedType: '1 Extra-Large Double Bed',
        maxGuests: 2,
        pricePerNightUSD: 360,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        features: ['120 m²', 'Private Infinity Plunge Pool', 'Outdoor Pavilion', 'Ocean Sunset Views']
      }
    ]
  },
  {
    id: 'ht-tokyo-ginza',
    name: 'The Tokyo EDITION, Ginza',
    city: 'Tokyo',
    country: 'Japan',
    address: '2-8-13 Ginza, Chuo-ku, Tokyo',
    starRating: 5,
    reviewScore: 9.3,
    reviewCount: 1450,
    distanceToCenter: 'In the heart of Ginza Shopping District',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Rooftop Cocktail Bar', 'Design by Kengo Kuma', 'Gym', 'High Speed 5G WiFi', 'Japanese Teahouse'],
    tags: ['Boutique Luxury', 'Ginza Central', 'Designer Interior'],
    basePriceUSD: 275,
    inPolicy: true,
    rooms: [
      {
        id: 'rm-tokyo-premier',
        title: 'Premier King Room with Ginza Skyline View',
        bedType: '1 King Bed',
        maxGuests: 2,
        pricePerNightUSD: 275,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
        features: ['41 m²', 'Custom Walnut Furniture', 'Soaking Bathtub', 'Smart Lighting']
      }
    ]
  }
];

// ======================== CORPORATE TRAVEL POLICY (Navan Benchmark) ========================
export const INITIAL_CORPORATE_POLICY: CorporateTravelPolicy = {
  companyName: 'Apex Global Tech & Energy Corp',
  maxFlightBudgetUSD: 750,
  maxFlightEconomyUSD: 750,
  maxFlightBusinessUSD: 2500,
  businessRequiresApproval: true,
  maxHotelNightlyUSD: 280,
  allowBnB: false,
  allowedCabinClass: 'Economy',
  requireAdvanceNoticeDays: 7,
  autoApproveInPolicy: true,
  enableEmergencyAssistance: true
};

// ======================== DYNAMIC PLATFORM MARKUP (Admin Managed) ========================
export const INITIAL_ADMIN_MARKUP: AdminMarkupConfig = {
  flightsFlatUSD: 25,
  hotelsPercent: 10,
  umrahPercent: 12,
  visasFlatUSD: 18,
  holidaysPercent: 8
};

// ======================== INITIAL BOOKINGS & APPROVALS LEDGER ========================
export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-1001',
    referenceCode: 'TP-UM-849201',
    vertical: 'umrah',
    title: '5-Star Royal Abraj Al-Bait & Haram View Umrah',
    subtitle: '5 Nights Makkah (Swissôtel) + 5 Nights Madinah (Pullman)',
    imageUrl: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
    bookingDate: '2026-09-20',
    travelDates: '15 Oct 2026 - 25 Oct 2026',
    passenger: {
      fullName: 'Ahmed Al-Mansoor',
      email: 'ahmed.mansoor@apexenergy.com',
      phone: '+966 50 123 4567',
      passportNumber: 'N9812480',
      nationality: 'Saudi Arabia',
      dateOfBirth: '1985-06-14'
    },
    paxCount: 2,
    totalAmountUSD: 4960,
    appliedCurrency: 'USD',
    convertedAmount: 4960,
    status: 'confirmed',
    policyCompliance: {
      inPolicy: true,
      approvedBy: 'Executive Pre-Approved Allocation',
      approvalDate: '2026-09-20'
    },
    addons: [
      { name: 'Private Luxury GMC Yukon Transfer (JED-MAK-MED)', priceUSD: 350 },
      { name: 'Mutawwif Scholar Dedicated Companion', priceUSD: 180 }
    ],
    paymentMethod: 'Corporate Credit Line',
    details: {
      makkahHotel: 'Swissôtel Al Maqam (Clock Tower)',
      madinahHotel: 'Pullman Zamzam Madinah',
      roomTier: 'Kaaba Panoramic Suite'
    }
  },
  {
    id: 'bk-1002',
    referenceCode: 'TP-FL-920144',
    vertical: 'flight',
    title: 'London (LHR) → Dubai (DXB) Business Class',
    subtitle: 'Emirates EK-206 • 1 Passenger',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    bookingDate: '2026-09-22',
    travelDates: '20 Oct 2026',
    passenger: {
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@apexenergy.com',
      phone: '+44 7700 900481',
      passportNumber: 'GB8823901',
      nationality: 'United Kingdom',
      dateOfBirth: '1990-11-23'
    },
    paxCount: 1,
    totalAmountUSD: 2475,
    appliedCurrency: 'USD',
    convertedAmount: 2475,
    status: 'pending_approval',
    policyCompliance: {
      inPolicy: false,
      reason: 'Exceeds Corporate Economy Class Limit ($750 Cap vs $2,450 Requested). Requires Travel Director Sign-Off.'
    },
    addons: [
      { name: 'Emirates Chauffeur Drive Service', priceUSD: 0 }
    ],
    paymentMethod: 'Corporate Card',
    details: {
      flightNumber: 'EK-206',
      airline: 'Emirates',
      departureTime: '14:20 LHR',
      arrivalTime: '00:30 DXB'
    }
  },
  {
    id: 'bk-1003',
    referenceCode: 'TP-HT-410982',
    vertical: 'hotel',
    title: 'The Tokyo EDITION, Ginza',
    subtitle: 'Premier King Room with Ginza Skyline View • 4 Nights',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    bookingDate: '2026-09-18',
    travelDates: '05 Nov 2026 - 09 Nov 2026',
    passenger: {
      fullName: 'David Tanaka',
      email: 'd.tanaka@apexenergy.com',
      phone: '+1 415 555 2671',
      passportNumber: 'US4729104',
      nationality: 'United States',
      dateOfBirth: '1982-03-30'
    },
    paxCount: 1,
    totalAmountUSD: 1100,
    appliedCurrency: 'USD',
    convertedAmount: 1100,
    status: 'confirmed',
    policyCompliance: {
      inPolicy: true,
      reason: 'Nightly rate $275 <= $280 Corporate Cap. Auto-Approved.'
    },
    addons: [
      { name: 'Daily Artisan Japanese Breakfast', priceUSD: 120 }
    ],
    paymentMethod: 'Corporate Credit Line',
    details: {
      hotelName: 'The Tokyo EDITION, Ginza',
      nights: 4,
      roomType: 'Premier King Room'
    }
  }
];
