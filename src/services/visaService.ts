import { 
  CountryVisaInfo, 
  VisaApplicationRecord, 
  AdminVisaConfig, 
  VisaApplicationStatus,
  DoorstepAddress,
  PassportOCRData
} from '../types';

// ======================== ATLYS INDIA INITIAL DATABASE SEED ========================

export const INITIAL_ATLYS_DESTINATIONS: CountryVisaInfo[] = [
  {
    id: 'uae',
    countryName: 'United Arab Emirates (Dubai)',
    countryCode: 'AE',
    flag: '🇦🇪',
    bannerImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'instant_evisa',
    guaranteeSlaDays: 2,
    fastestTurnaround: '24–36 Hours',
    tagline: 'Instant Tourist & Transit eVisa with 99.8% On-Time Record',
    rejectionRefundPolicy: '100% Service Fee Refund if Delayed',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'uae-30d-single',
        title: 'Dubai 30 Days Tourist eVisa',
        validityDays: 60,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: '24–36 Hours',
        processingTimeExpress: '6 Hours Express',
        govFee: 85,
        platformFee: 18,
        expressSurcharge: 25,
        visaType: 'evisa'
      },
      {
        id: 'uae-60d-multiple',
        title: 'Dubai 60 Days Multiple Entry',
        validityDays: 60,
        maxStayDays: 60,
        entryType: 'Multiple',
        processingTimeStandard: '48 Hours',
        govFee: 180,
        platformFee: 30,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Front & Back Copies', description: 'Color scans of first and last biodata pages', isRequired: true, acceptedFormats: 'PDF, JPG' },
      { id: 'r2', title: 'White Background Photograph', description: 'Recent color photo meeting ICAO standards', isRequired: true, acceptedFormats: 'JPG, PNG' },
      { id: 'r3', title: 'Confirmed Return Flight Ticket', description: 'Return flight reservation for immigration', isRequired: false, acceptedFormats: 'PDF' }
    ],
    icaoRules: [
      'Plain white background, high resolution 300 DPI',
      'Full face visible without hair covering forehead or ears',
      'No filters or software touch-ups'
    ]
  },
  {
    id: 'vietnam',
    countryName: 'Vietnam',
    countryCode: 'VN',
    flag: '🇻🇳',
    bannerImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'popular',
    guaranteeSlaDays: 3,
    fastestTurnaround: '3 Working Days',
    tagline: 'Official Vietnam Immigration e-Visa directly delivered',
    rejectionRefundPolicy: '100% Atlys Fee Refund on Late Delivery',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'vn-30d-single',
        title: 'Vietnam 30-Day Single Entry e-Visa',
        validityDays: 30,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: '3 Working Days',
        processingTimeExpress: '24h Rush',
        govFee: 25,
        platformFee: 15,
        expressSurcharge: 20,
        visaType: 'evisa'
      },
      {
        id: 'vn-90d-multiple',
        title: 'Vietnam 90-Day Multiple Entry e-Visa',
        validityDays: 90,
        maxStayDays: 90,
        entryType: 'Multiple',
        processingTimeStandard: '4 Working Days',
        govFee: 50,
        platformFee: 25,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Bio Page Scan', description: 'Valid for minimum 6 months from arrival', isRequired: true, acceptedFormats: 'JPG, PDF' },
      { id: 'r2', title: 'Digital Portrait Photo (4x6 cm)', description: 'Straight look, white background, no glasses', isRequired: true, acceptedFormats: 'JPG' }
    ],
    icaoRules: [
      'Strict white background, face covers 75% of image',
      'Clear lighting, no reflections or headwear'
    ]
  },
  {
    id: 'thailand',
    countryName: 'Thailand',
    countryCode: 'TH',
    flag: '🇹🇭',
    bannerImage: 'https://images.unsplash.com/photo-1506665531395-9d07a6e5a49c?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'on_arrival',
    guaranteeSlaDays: 1,
    fastestTurnaround: 'Instant / 24 Hours',
    tagline: 'Skip the airport queues with Pre-Approved Digital e-VOA',
    rejectionRefundPolicy: 'Full refund guarantee on missed SLA',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'th-evisa-60d',
        title: 'Thailand 60-Day Tourist e-Visa',
        validityDays: 90,
        maxStayDays: 60,
        entryType: 'Single',
        processingTimeStandard: '24–48 Hours',
        govFee: 40,
        platformFee: 18,
        visaType: 'evisa'
      },
      {
        id: 'th-evoa-express',
        title: 'Express e-VOA (Airport Fast-Track)',
        validityDays: 15,
        maxStayDays: 15,
        entryType: 'Single',
        processingTimeStandard: '2–4 Hours',
        govFee: 65,
        platformFee: 20,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Bio-data Page', description: 'Clean color photo/scan of passport', isRequired: true, acceptedFormats: 'JPG, PDF' },
      { id: 'r2', title: 'Recent White Background Photo', description: 'Taken within the last 6 months', isRequired: true, acceptedFormats: 'JPG' },
      { id: 'r3', title: 'Accommodation Proof', description: 'Hotel booking voucher in Thailand', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: [
      'White background, shoulders visible, neutral expression'
    ]
  },
  {
    id: 'schengen',
    countryName: 'Schengen Area (France / Switzerland / Germany)',
    countryCode: 'EU',
    flag: '🇪🇺',
    bannerImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'sticker',
    guaranteeSlaDays: 15,
    fastestTurnaround: '12–15 Working Days',
    tagline: 'Doorstep Passport Pickup + 24/7 VFS Appointment Slot Monitoring',
    rejectionRefundPolicy: 'Atlys Assure: Dedicated appeals assistance & reapplication guarantee',
    requiresPassportOCR: true,
    supportsStickerVisa: true,
    appointmentRequired: true,
    vfsCenters: ['Mumbai (BKC)', 'New Delhi (Shivaji Stadium)', 'Bengaluru (Gopalan Mall)', 'Chennai', 'Hyderabad'],
    options: [
      {
        id: 'schengen-sticker-tourist',
        title: 'Schengen Type C Sticker Visa (Embassy Stamped)',
        validityDays: 180,
        maxStayDays: 90,
        entryType: 'Multiple',
        processingTimeStandard: '12–15 Working Days',
        govFee: 95,
        platformFee: 45,
        visaType: 'sticker'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Original Passport', description: 'With at least 2 blank pages, collected via doorstep courier', isRequired: true, acceptedFormats: 'Physical Passport' },
      { id: 'r2', title: 'ICAO Biometric Photos (35mm x 45mm)', description: 'Matte paper, 80% face coverage, grey/white backdrop', isRequired: true, acceptedFormats: 'Physical & JPG' },
      { id: 'r3', title: '6 Months Bank Statements', description: 'Attested with bank seal and minimum balance proof', isRequired: true, acceptedFormats: 'PDF' },
      { id: 'r4', title: 'Schengen Travel Medical Insurance', description: 'Minimum €30,000 emergency medical coverage', isRequired: true, acceptedFormats: 'PDF' },
      { id: 'r5', title: '3 Years ITR / Form 16', description: 'Income Tax Return acknowledgment slips', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: [
      'Strict 35mm x 45mm dimensions',
      'Light grey or white background, no teeth showing'
    ]
  },
  {
    id: 'uk',
    countryName: 'United Kingdom (UK)',
    countryCode: 'GB',
    flag: '🇬🇧',
    bannerImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'sticker',
    guaranteeSlaDays: 15,
    fastestTurnaround: '15 Working Days',
    tagline: 'Standard Visitor Visa with Atlys Doorstep Document Verification',
    rejectionRefundPolicy: '100% Service Fee Refund if UKVI SLA breached',
    requiresPassportOCR: true,
    supportsStickerVisa: true,
    appointmentRequired: true,
    vfsCenters: ['Mumbai', 'New Delhi', 'Bengaluru', 'Kolkata', 'Ahmedabad'],
    options: [
      {
        id: 'uk-standard-6m',
        title: 'UK Standard Visitor Visa (6 Months)',
        validityDays: 180,
        maxStayDays: 180,
        entryType: 'Multiple',
        processingTimeStandard: '15 Working Days',
        govFee: 145,
        platformFee: 45,
        visaType: 'sticker'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Original Physical Passport', description: 'Valid for 6 months beyond intended departure', isRequired: true, acceptedFormats: 'Physical' },
      { id: 'r2', title: 'Financial Proof & 6-Month Statements', description: 'Bank statement with official stamped bank verification', isRequired: true, acceptedFormats: 'PDF' },
      { id: 'r3', title: 'Employment / Business Proof', description: 'NOC from employer or business registration certificate', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: [
      'Clear, focused, no shadows on face or background'
    ]
  },
  {
    id: 'singapore',
    countryName: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    bannerImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'instant_evisa',
    guaranteeSlaDays: 3,
    fastestTurnaround: '3 Working Days',
    tagline: 'Singapore ICA Authorized Authorized Agent eVisa Submission',
    rejectionRefundPolicy: 'Guaranteed processing within committed timeline',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'sg-evisa-30d',
        title: 'Singapore e-Visa (Entry Visa)',
        validityDays: 35,
        maxStayDays: 30,
        entryType: 'Multiple',
        processingTimeStandard: '3–4 Working Days',
        govFee: 30,
        platformFee: 15,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Biodata Page', description: 'Clear scan showing MRZ codes', isRequired: true, acceptedFormats: 'JPG, PDF' },
      { id: 'r2', title: 'Digital Photo with Matte Finish Look', description: 'ICAO standard with pure white background', isRequired: true, acceptedFormats: 'JPG' }
    ],
    icaoRules: [
      'Pure white background, 400x514 pixels minimum',
      'Eyes clearly open and visible without reflections'
    ]
  },
  {
    id: 'malaysia',
    countryName: 'Malaysia',
    countryCode: 'MY',
    flag: '🇲🇾',
    bannerImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    popular: false,
    category: 'on_arrival',
    guaranteeSlaDays: 1,
    fastestTurnaround: 'Instant 24 Hours',
    tagline: 'MDAC Digital Arrival Card & Visa-Free Entry Facilitation',
    rejectionRefundPolicy: 'Instant dispatch guarantee',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'my-mdac-instant',
        title: 'Malaysia Digital Arrival Card (MDAC)',
        validityDays: 30,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: 'Instant / 2 Hours',
        govFee: 0,
        platformFee: 12,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Scan', description: 'Clear front page image', isRequired: true, acceptedFormats: 'JPG, PDF' },
      { id: 'r2', title: 'Confirmed Flight Tickets', description: 'Arrival & departure dates', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: ['Standard passport photo rules']
  },
  {
    id: 'indonesia',
    countryName: 'Indonesia (Bali)',
    countryCode: 'ID',
    flag: '🇮🇩',
    bannerImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'on_arrival',
    guaranteeSlaDays: 1,
    fastestTurnaround: 'Instant / 1 Hour',
    tagline: 'Official Electronic Visa on Arrival (e-VOA) for Bali',
    rejectionRefundPolicy: '100% instant verification guarantee',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'id-evoa-30d',
        title: 'Indonesia 30-Day e-VOA (Extendable)',
        validityDays: 90,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: '1–2 Hours',
        govFee: 35,
        platformFee: 14,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Biodata Page', description: 'Minimum 6 months validity', isRequired: true, acceptedFormats: 'JPG, PDF' },
      { id: 'r2', title: 'Passport Photograph', description: 'Color digital photo on white backdrop', isRequired: true, acceptedFormats: 'JPG' }
    ],
    icaoRules: ['White background, clear contrast']
  },
  {
    id: 'saudi-arabia',
    countryName: 'Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    bannerImage: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'instant_evisa',
    guaranteeSlaDays: 2,
    fastestTurnaround: '24–48 Hours',
    tagline: '1-Year Tourist & Umrah Multiple Entry eVisa with Nusuk Sync',
    rejectionRefundPolicy: 'Official MOFA direct transmission',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
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
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Bio Page', description: 'Valid minimum 6 months from entry', isRequired: true, acceptedFormats: 'PDF, JPG' },
      { id: 'r2', title: 'Passport-Size Photo', description: 'ICAO standard with pure white background', isRequired: true, acceptedFormats: 'JPG, PNG' }
    ],
    icaoRules: ['Strict white background, neutral expression']
  },
  {
    id: 'usa',
    countryName: 'United States of America (US)',
    countryCode: 'US',
    flag: '🇺🇸',
    bannerImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
    popular: true,
    category: 'sticker',
    guaranteeSlaDays: 30,
    fastestTurnaround: '24/7 Appointment Slot Tracker',
    tagline: 'B1/B2 Visa DS-160 Filing + Automated 24/7 Consulate Slot Hunter',
    rejectionRefundPolicy: 'Full Atlys fee refund if earliest slot is not secured within commitment window',
    requiresPassportOCR: true,
    supportsStickerVisa: true,
    appointmentRequired: true,
    vfsCenters: ['US Embassy New Delhi', 'US Consulate Mumbai', 'US Consulate Chennai', 'US Consulate Hyderabad', 'US Consulate Kolkata'],
    options: [
      {
        id: 'us-b1-b2-10y',
        title: 'US B1/B2 Visitor Visa (10 Years Multiple Entry)',
        validityDays: 3650,
        maxStayDays: 180,
        entryType: 'Multiple',
        processingTimeStandard: 'Slot Monitoring Active',
        govFee: 185,
        platformFee: 65,
        visaType: 'sticker'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Current & Old Passports', description: 'Original travel documents', isRequired: true, acceptedFormats: 'Physical Passport' },
      { id: 'r2', title: 'US Visa Spec Photos (51mm x 51mm)', description: 'Square format taken within last 6 months', isRequired: true, acceptedFormats: 'Physical & JPG' },
      { id: 'r3', title: 'Completed DS-160 Form', description: 'Auto-filled via Atlys AI assistant', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: ['Square 2x2 inch (51x51 mm) format, pure white background']
  },
  {
    id: 'japan',
    countryName: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    bannerImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    popular: false,
    category: 'instant_evisa',
    guaranteeSlaDays: 5,
    fastestTurnaround: '4–5 Working Days',
    tagline: 'Japan eVisa for Indian Passport Holders with VFS Verification',
    rejectionRefundPolicy: 'On-time delivery commitment',
    requiresPassportOCR: true,
    supportsStickerVisa: true,
    options: [
      {
        id: 'jp-tourist-evisa',
        title: 'Japan Single Entry Tourist e-Visa (90 Days)',
        validityDays: 90,
        maxStayDays: 15,
        entryType: 'Single',
        processingTimeStandard: '4–5 Working Days',
        govFee: 25,
        platformFee: 20,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Scan', description: 'Valid minimum 6 months', isRequired: true, acceptedFormats: 'PDF, JPG' },
      { id: 'r2', title: 'ITR V & 6 Months Bank Statement', description: 'Proof of financial stability', isRequired: true, acceptedFormats: 'PDF' }
    ],
    icaoRules: ['Standard Japanese consular photo guidelines']
  },
  {
    id: 'azerbaijan',
    countryName: 'Azerbaijan (Baku)',
    countryCode: 'AZ',
    flag: '🇦🇿',
    bannerImage: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
    popular: false,
    category: 'instant_evisa',
    guaranteeSlaDays: 1,
    fastestTurnaround: '3 Hours Express',
    tagline: 'ASAN Official Visa directly linked to passport',
    rejectionRefundPolicy: '3-hour rapid dispatch commitment',
    requiresPassportOCR: true,
    supportsStickerVisa: false,
    options: [
      {
        id: 'az-asan-30d',
        title: 'Azerbaijan 30-Day ASAN e-Visa',
        validityDays: 90,
        maxStayDays: 30,
        entryType: 'Single',
        processingTimeStandard: '24 Hours',
        processingTimeExpress: '3 Hours Express',
        govFee: 26,
        platformFee: 14,
        expressSurcharge: 18,
        visaType: 'evisa'
      }
    ],
    requirements: [
      { id: 'r1', title: 'Passport Scan', description: 'High quality color scan of bio page', isRequired: true, acceptedFormats: 'JPG, PDF' }
    ],
    icaoRules: ['Standard passport copy requirement']
  }
];

export const INITIAL_ATLYS_APPLICATIONS: VisaApplicationRecord[] = [
  {
    id: 'app-001',
    trackingId: 'ATLYS-IN-482910',
    applicantName: 'Rahul Verma',
    applicantEmail: 'rahul.verma@gmail.com',
    applicantPhone: '+91 98201 44552',
    passportNumber: 'Z5819024',
    countryId: 'vietnam',
    country: 'Vietnam',
    visaType: 'Vietnam 30-Day Single Entry e-Visa',
    flowType: 'evisa',
    status: 'embassy_processing',
    submissionDate: '2026-11-14 10:20',
    estimatedCompletion: '2026-11-17',
    guaranteedDeliveryDate: '17 Nov 2026, 06:00 PM',
    ocrExtracted: true,
    whatsappNotified: true,
    govFeeUSD: 25,
    platformFeeUSD: 15,
    totalAmountUSD: 40,
    timeline: [
      { status: 'submitted', timestamp: '14 Nov, 10:20 AM', title: 'Application Submitted', description: 'Passport data received and fee settled.', completed: true },
      { status: 'ocr_verified', timestamp: '14 Nov, 10:22 AM', title: 'AI OCR & Biometrics Passed', description: 'MRZ check and ICAO white background validated.', completed: true },
      { status: 'embassy_processing', timestamp: '14 Nov, 02:45 PM', title: 'Filed with Vietnam Immigration', description: 'Application under official consular evaluation.', completed: true },
      { status: 'approved', timestamp: 'Pending', title: 'e-Visa Issuance & Download', description: 'PDF foil generation and WhatsApp notification.', completed: false }
    ],
    adminNotes: 'Documents in order. Standard processing speed.'
  },
  {
    id: 'app-002',
    trackingId: 'ATLYS-IN-910248',
    applicantName: 'Ananya Sengupta',
    applicantEmail: 'ananya.s@outlook.com',
    applicantPhone: '+91 98711 02938',
    passportNumber: 'K4910284',
    countryId: 'uae',
    country: 'United Arab Emirates (Dubai)',
    visaType: 'Dubai 30 Days Tourist eVisa',
    flowType: 'evisa',
    status: 'approved',
    submissionDate: '2026-11-13 14:10',
    estimatedCompletion: '2026-11-15',
    guaranteedDeliveryDate: '15 Nov 2026, 02:00 PM',
    ocrExtracted: true,
    whatsappNotified: true,
    govFeeUSD: 85,
    platformFeeUSD: 18,
    totalAmountUSD: 103,
    timeline: [
      { status: 'submitted', timestamp: '13 Nov, 02:10 PM', title: 'Application Submitted', description: 'Dubai tourist request logged.', completed: true },
      { status: 'ocr_verified', timestamp: '13 Nov, 02:12 PM', title: 'AI OCR Verified', description: 'Valid biometric passport confirmed.', completed: true },
      { status: 'embassy_processing', timestamp: '13 Nov, 05:30 PM', title: 'GDRFA Dubai Verification', description: 'Federal authority review complete.', completed: true },
      { status: 'approved', timestamp: '14 Nov, 11:45 AM', title: 'e-Visa Officially Issued', description: 'Delivered to WhatsApp & ready for download.', completed: true }
    ],
    adminNotes: 'Approved ahead of SLA schedule by 18 hours.'
  },
  {
    id: 'app-003',
    trackingId: 'ATLYS-IN-759102',
    applicantName: 'Vikramaditya Malhotra',
    applicantEmail: 'vikram.m@apexgroup.com',
    applicantPhone: '+91 98199 87654',
    passportNumber: 'L8391027',
    countryId: 'schengen',
    country: 'Schengen Area (France / Switzerland / Germany)',
    visaType: 'Schengen Type C Sticker Visa (Embassy Stamped)',
    flowType: 'sticker',
    status: 'docs_uploaded',
    submissionDate: '2026-11-15 09:30',
    estimatedCompletion: '2026-11-30',
    guaranteedDeliveryDate: '30 Nov 2026, 06:00 PM',
    ocrExtracted: true,
    whatsappNotified: true,
    govFeeUSD: 95,
    platformFeeUSD: 45,
    totalAmountUSD: 140,
    doorstepAddress: {
      fullName: 'Vikramaditya Malhotra',
      phone: '+91 98199 87654',
      addressLine: 'Apt 1402, Lodha Bellissimo, NM Joshi Marg, Mahalaxmi',
      city: 'Mumbai',
      pincode: '400011',
      pickupSlot: '16 Nov 2026 (10:00 AM - 01:00 PM)'
    },
    timeline: [
      { status: 'submitted', timestamp: '15 Nov, 09:30 AM', title: 'Application Submitted', description: 'Sticker visa concierge booked.', completed: true },
      { status: 'docs_uploaded', timestamp: '15 Nov, 09:40 AM', title: 'Doorstep Courier Scheduled', description: 'Atlys courier assigned for physical passport pickup.', completed: true },
      { status: 'embassy_processing', timestamp: 'Pending', title: 'VFS Submission & Stamping', description: 'Consulate foil attachment and biometric matching.', completed: false },
      { status: 'approved', timestamp: 'Pending', title: 'Stamped Passport Home Delivery', description: 'Insured return courier to doorstep.', completed: false }
    ],
    adminNotes: 'Courier pickup scheduled with Mumbai logistics team.'
  }
];

export const INITIAL_ADMIN_VISA_CONFIG: AdminVisaConfig = {
  globalPlatformFeeUSD: 18,
  expressTurnaroundSurchargeUSD: 20,
  onTimeGuaranteeActive: true,
  doorstepCourierFeeUSD: 15,
  supportHelpline: '+91 22 4066 6400',
  whatsappSupportNumber: '919876543210'
};

// ======================== DATABASE & SERVICE LAYER ========================

class VisaBackendService {
  private STORAGE_KEY_DESTINATIONS = 'atlys_visa_destinations_db';
  private STORAGE_KEY_APPLICATIONS = 'atlys_visa_applications_db';
  private STORAGE_KEY_CONFIG = 'atlys_visa_admin_config_db';

  // 1. Destinations CRUD
  public getDestinations(): CountryVisaInfo[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_DESTINATIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    // Seed initial
    this.saveDestinations(INITIAL_ATLYS_DESTINATIONS);
    return INITIAL_ATLYS_DESTINATIONS;
  }

  public saveDestinations(destinations: CountryVisaInfo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_DESTINATIONS, JSON.stringify(destinations));
    } catch (e) {
      // ignore
    }
  }

  public updateDestination(id: string, updates: Partial<CountryVisaInfo>): CountryVisaInfo[] {
    const list = this.getDestinations();
    const updated = list.map(d => d.id === id ? { ...d, ...updates } : d);
    this.saveDestinations(updated);
    return updated;
  }

  public addDestination(newDest: CountryVisaInfo): CountryVisaInfo[] {
    const list = this.getDestinations();
    const updated = [newDest, ...list];
    this.saveDestinations(updated);
    return updated;
  }

  public deleteDestination(id: string): CountryVisaInfo[] {
    const list = this.getDestinations();
    const updated = list.filter(d => d.id !== id);
    this.saveDestinations(updated);
    return updated;
  }

  // 2. Applications Database
  public getApplications(): VisaApplicationRecord[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_APPLICATIONS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    this.saveApplications(INITIAL_ATLYS_APPLICATIONS);
    return INITIAL_ATLYS_APPLICATIONS;
  }

  public saveApplications(apps: VisaApplicationRecord[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      // ignore
    }
  }

  public createApplication(app: Partial<VisaApplicationRecord>): VisaApplicationRecord {
    const apps = this.getApplications();
    const trackingId = `ATLYS-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: VisaApplicationRecord = {
      id: `app-${Date.now()}`,
      trackingId,
      applicantName: app.applicantName || 'Applicant',
      applicantEmail: app.applicantEmail || '',
      applicantPhone: app.applicantPhone || '',
      passportNumber: app.passportNumber || '',
      countryId: app.countryId || '',
      country: app.country || '',
      visaType: app.visaType || 'Tourist Visa',
      flowType: app.flowType || 'evisa',
      status: 'docs_uploaded',
      submissionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      estimatedCompletion: app.estimatedCompletion || this.calculateGuaranteedDate(3),
      guaranteedDeliveryDate: app.guaranteedDeliveryDate || this.calculateGuaranteedDate(app.flowType === 'sticker' ? 15 : 3),
      ocrExtracted: app.ocrExtracted ?? true,
      whatsappNotified: true,
      govFeeUSD: app.govFeeUSD || 50,
      platformFeeUSD: app.platformFeeUSD || 18,
      totalAmountUSD: app.totalAmountUSD || 68,
      doorstepAddress: app.doorstepAddress,
      timeline: [
        { status: 'submitted', timestamp: 'Just now', title: 'Application Registered', description: 'Application received and verified in Atlys pipeline.', completed: true },
        { status: 'docs_uploaded', timestamp: 'Just now', title: app.flowType === 'sticker' ? 'Doorstep Courier Scheduled' : 'Documents & Biometrics Verified', description: app.flowType === 'sticker' ? 'Passport pickup scheduled at your address.' : 'Ready for electronic consular submission.', completed: true },
        { status: 'embassy_processing', timestamp: 'Pending', title: 'Government Consular Processing', description: 'Official evaluation under way.', completed: false },
        { status: 'approved', timestamp: 'Pending', title: app.flowType === 'sticker' ? 'Passport Stamped & Dispatched' : 'e-Visa Issuance', description: 'Final delivery.', completed: false }
      ],
      adminNotes: 'Application created via customer online portal.'
    };

    const updated = [newRecord, ...apps];
    this.saveApplications(updated);
    return newRecord;
  }

  public updateApplicationStatus(trackingId: string, status: VisaApplicationStatus, note?: string): VisaApplicationRecord[] {
    const apps = this.getApplications();
    const updated = apps.map(a => {
      if (a.trackingId === trackingId || a.id === trackingId) {
        return {
          ...a,
          status,
          adminNotes: note ? `${a.adminNotes || ''} [Admin: ${note}]` : a.adminNotes
        };
      }
      return a;
    });
    this.saveApplications(updated);
    return updated;
  }

  // 3. Admin Config
  public getAdminConfig(): AdminVisaConfig {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    this.saveAdminConfig(INITIAL_ADMIN_VISA_CONFIG);
    return INITIAL_ADMIN_VISA_CONFIG;
  }

  public saveAdminConfig(cfg: AdminVisaConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_CONFIG, JSON.stringify(cfg));
    } catch (e) {
      // ignore
    }
  }

  // Helper date calculator
  public calculateGuaranteedDate(days: number): string {
    const target = new Date();
    target.setDate(target.getDate() + (days || 3));
    return target.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}

export const visaBackend = new VisaBackendService();
