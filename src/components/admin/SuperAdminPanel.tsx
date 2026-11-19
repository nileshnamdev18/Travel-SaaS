import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { checkApiHealth, packagesApi } from '../../services/apiClient';
import { holidayBackend } from '../../services/holidayService';
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Layers, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Download, 
  Building, 
  Briefcase, 
  Calendar,
  Plane,
  FileSpreadsheet,
  XCircle,
  Tag,
  Globe,
  Truck,
  Trash2,
  Edit3,
  PhoneCall,
  Save,
  Zap,
  Star,
  Palmtree,
  Compass,
  MessageSquare,
  Sparkles,
  FileUp,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  MapPin,
  Sliders,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CountryVisaInfo, 
  VisaApplicationStatus, 
  VisaCategory,
  HolidayPackage,
  HolidayBookingRecord,
  AdminHolidayConfig,
  HolidayBookingStatus,
  HolidayDestinationType
} from '../../types';

export const SuperAdminPanel: React.FC = () => {
  const { 
    formatPrice, 
    bookings,
    approveBooking,
    cancelBooking,
    adminMarkup,
    updateAdminMarkup,
    leads, 
    updateLeadPipeline, 
    assignLeadToStaff, 
    staff,
    openModal,
    // Visa Full-Stack Engine
    visaDestinations,
    updateVisaDestination,
    addVisaDestination,
    deleteVisaDestination,
    visaApplications,
    updateVisaApplicationStatus,
    adminVisaConfig,
    updateAdminVisaConfig,
    // Thomas Cook Holiday Engine
    holidayPackages,
    updateHolidayPackage,
    addHolidayPackage,
    deleteHolidayPackage,
    holidayBookings,
    updateHolidayBookingStatus,
    adminHolidayConfig,
    updateAdminHolidayConfig
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'bookings' | 'markups' | 'visas' | 'holidays' | 'leads'>('analytics');
  
  // Real Express + MongoDB status
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  useEffect(() => {
    checkApiHealth().then(connected => setIsDbConnected(connected));
  }, []);

  const handleSyncWithDb = async () => {
    setIsSyncingDb(true);
    try {
      await holidayBackend.syncFromBackend();
      const connected = await checkApiHealth();
      setIsDbConnected(connected);
    } finally {
      setIsSyncingDb(false);
    }
  };
  
  // Markups local state
  const [markupValues, setMarkupValues] = useState({
    flightsFlatUSD: adminMarkup.flightsFlatUSD,
    hotelsPercent: adminMarkup.hotelsPercent,
    visasFlatUSD: adminMarkup.visasFlatUSD,
    holidaysPercent: adminMarkup.holidaysPercent
  });
  const [savedMarkupSuccess, setSavedMarkupSuccess] = useState(false);

  // Global Visa Engine local state
  const [visaEngineConfig, setVisaEngineConfig] = useState({
    globalPlatformFeeUSD: adminVisaConfig.globalPlatformFeeUSD,
    expressTurnaroundSurchargeUSD: adminVisaConfig.expressTurnaroundSurchargeUSD,
    doorstepCourierFeeUSD: adminVisaConfig.doorstepCourierFeeUSD,
    onTimeGuaranteeActive: adminVisaConfig.onTimeGuaranteeActive,
    supportHelpline: adminVisaConfig.supportHelpline,
    whatsappSupportNumber: adminVisaConfig.whatsappSupportNumber
  });
  const [savedVisaEngineSuccess, setSavedVisaEngineSuccess] = useState(false);

  // Global Holiday Engine local state (with full dynamic marketing configuration)
  const [holidayEngineConfig, setHolidayEngineConfig] = useState({
    partnerMarkupPercent: adminHolidayConfig.partnerMarkupPercent || 15,
    groupDiscountPercent: adminHolidayConfig.groupDiscountPercent || 8,
    tourManagerIncludedByDefault: adminHolidayConfig.tourManagerIncludedByDefault ?? true,
    supportHelpline: adminHolidayConfig.supportHelpline || '1800-209-9100',
    whatsappInquiryNumber: adminHolidayConfig.whatsappInquiryNumber || '+919222211100',
    enableInstantBooking: adminHolidayConfig.enableInstantBooking ?? true,
    heroHeadline: adminHolidayConfig.heroHeadline || 'Explore Handcrafted Holidays Across the World',
    heroSubheading: adminHolidayConfig.heroSubheading || 'Discover breathtaking holidays from majestic Kashmir & tropical Kerala to glamorous Dubai & the Swiss Alps. Guaranteed 4★ stays, authentic meals, and customizable day itineraries.',
    announcementBanner: adminHolidayConfig.announcementBanner || '🎉 Summer Special Offer: Flat 10% OFF on European & Domestic Group Tours!',
    announcementBannerEnabled: adminHolidayConfig.announcementBannerEnabled ?? true,
    assuranceTitle: adminHolidayConfig.assuranceTitle || '140+ Years of Heritage & Seamless Holiday Assurance',
    assuranceBadges: adminHolidayConfig.assuranceBadges || ['All Meals Included Options', 'Flexi-Cancellation & Reschedule', '24/7 Dedicated Tour Manager'],
    loyaltyPointsRate: adminHolidayConfig.loyaltyPointsRate ?? 0.05,
    hotelTierMultiplierComfort: adminHolidayConfig.hotelTierMultiplierComfort ?? 0.9,
    hotelTierMultiplierSuperior: adminHolidayConfig.hotelTierMultiplierSuperior ?? 1.0,
    hotelTierMultiplierLuxury: adminHolidayConfig.hotelTierMultiplierLuxury ?? 1.35
  });
  const [savedHolidayEngineSuccess, setSavedHolidayEngineSuccess] = useState(false);

  // Sync state if adminHolidayConfig changes from DB sync
  useEffect(() => {
    if (adminHolidayConfig) {
      setHolidayEngineConfig(prev => ({
        ...prev,
        ...adminHolidayConfig
      }));
    }
  }, [adminHolidayConfig]);

  // Destination Management state
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  const [editDestForm, setEditDestForm] = useState<Partial<CountryVisaInfo>>({});
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [newDestForm, setNewDestForm] = useState<Partial<CountryVisaInfo>>({
    countryName: '',
    countryCode: '',
    flag: '✈️',
    category: 'instant_evisa',
    guaranteeSlaDays: 3,
    fastestTurnaround: '24 Hours',
    tagline: 'Instant e-Visa processing',
    rejectionRefundPolicy: '100% Platform Fee Refund on Delay',
    supportsStickerVisa: false,
    requiresPassportOCR: true,
    popular: false
  });

  // PDF Extraction & Full Package Builder state
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [isPdfExtracting, setIsPdfExtracting] = useState(false);
  const [pdfExtractError, setPdfExtractError] = useState<string | null>(null);
  const [pdfExtractSuccess, setPdfExtractSuccess] = useState<string | null>(null);
  const [builderTab, setBuilderTab] = useState<'basic' | 'pricing' | 'media' | 'itinerary' | 'inclusions'>('basic');
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const initialNewHolidayState: Partial<HolidayPackage> = {
    title: '',
    destination: '',
    destinationType: 'domestic',
    region: 'North India',
    theme: 'family',
    category: 'Customized',
    durationDays: 5,
    durationNights: 4,
    departureCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad'],
    basePrice: 550,
    wholesaleCost: 420,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=800&q=80'
    ],
    highlights: ['Scenic Guided Tour', '4-Star Handpicked Stays', 'Breakfast & Dinners Included'],
    inclusions: [
      'Accommodation in 4-Star Handpicked Hotels',
      'Daily Buffet Breakfasts & Dinners',
      'Private AC Transfers & Sightseeing',
      'Dedicated Hindi / English Tour Guide'
    ],
    exclusions: ['Airfare / Train tickets to destination', 'Personal shopping and room service'],
    hotelTiers: {
      standard: 'Selected 3-Star Quality Hotel',
      deluxe: 'Selected 4-Star Premium Hotel',
      luxury: 'Selected 5-Star Luxury Resort'
    },
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Arrival & Welcome Excursion',
        destination: 'Srinagar',
        hotelName: 'Heritage Luxury Resort',
        hotelTier: 'Superior',
        mealsIncluded: ['Dinner'],
        currentActivity: {
          id: 'act-1',
          title: 'Orientation City Sightseeing & Evening Walk',
          duration: '3 Hours',
          priceDelta: 0,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
          description: 'Guided arrival tour of historic quarters.'
        },
        alternativeActivities: []
      }
    ],
    isBestSeller: false,
    isFeatured: true,
    isTrending: false,
    rating: 4.6,
    reviewCount: 140,
    discountPercent: 10,
    cancellationPolicy: 'Free cancellation up to 10 days before departure.'
  };

  // Holiday Package CRUD state
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [editHolidayForm, setEditHolidayForm] = useState<Partial<HolidayPackage>>({});
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  const [newHolidayForm, setNewHolidayForm] = useState<Partial<HolidayPackage>>(initialNewHolidayState);

  // Filters state
  const [visaAppStatusFilter, setVisaAppStatusFilter] = useState<string>('all');
  const [holidayBookingStatusFilter, setHolidayBookingStatusFilter] = useState<string>('all');

  // Marketing Attribution Campaigns Data
  const attributionCampaigns = [
    { source: 'Google Ads Search', campaign: 'akbar_flights_dubai_2026', spend: 8400, leads: 92, converted: 34, gbv: 166600, netProfit: 21400, cac: 247 },
    { source: 'Meta Reels / Ads', campaign: 'thomascook_kashmir_tour', spend: 4200, leads: 110, converted: 26, gbv: 50700, netProfit: 7800, cac: 161 },
    { source: 'Instagram Stories', campaign: 'atlys_instant_evisa_promo', spend: 2800, leads: 145, converted: 48, gbv: 38880, netProfit: 5400, cac: 58 },
    { source: 'Direct Organic SEO', campaign: 'akbar_hotels_best_rates', spend: 0, leads: 44, converted: 19, gbv: 82000, netProfit: 14200, cac: 0 },
  ];

  const totalGBV = attributionCampaigns.reduce((acc, c) => acc + c.gbv, 0);
  const totalNetProfit = attributionCampaigns.reduce((acc, c) => acc + c.netProfit, 0);
  const totalAdSpend = attributionCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const blendedROAS = ((totalNetProfit / totalAdSpend) * 100).toFixed(0);

  const handleSaveMarkups = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminMarkup('flightsFlatUSD', markupValues.flightsFlatUSD);
    updateAdminMarkup('hotelsPercent', markupValues.hotelsPercent);
    updateAdminMarkup('visasFlatUSD', markupValues.visasFlatUSD);
    updateAdminMarkup('holidaysPercent', markupValues.holidaysPercent);
    setSavedMarkupSuccess(true);
    setTimeout(() => setSavedMarkupSuccess(false), 2500);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleSaveVisaEngine = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminVisaConfig(visaEngineConfig);
    setSavedVisaEngineSuccess(true);
    setTimeout(() => setSavedVisaEngineSuccess(false), 3000);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleSaveHolidayEngine = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminHolidayConfig(holidayEngineConfig);
    setSavedHolidayEngineSuccess(true);
    setTimeout(() => setSavedHolidayEngineSuccess(false), 3000);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleStartEditDestination = (dest: CountryVisaInfo) => {
    setEditingDestinationId(dest.id);
    setEditDestForm({
      countryName: dest.countryName,
      category: dest.category,
      guaranteeSlaDays: dest.guaranteeSlaDays,
      fastestTurnaround: dest.fastestTurnaround,
      tagline: dest.tagline,
      rejectionRefundPolicy: dest.rejectionRefundPolicy,
      supportsStickerVisa: dest.supportsStickerVisa
    });
  };

  const handleSaveEditDestination = (id: string) => {
    updateVisaDestination(id, editDestForm);
    setEditingDestinationId(null);
  };

  const handleCreateNewDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestForm.countryName) return;
    const destId = (newDestForm.countryCode || newDestForm.countryName).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const createdDest: CountryVisaInfo = {
      id: destId,
      countryName: newDestForm.countryName,
      countryCode: newDestForm.countryCode || destId.toUpperCase().slice(0, 3),
      flag: newDestForm.flag || '✈️',
      bannerImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      popular: newDestForm.popular ?? false,
      category: newDestForm.category || 'instant_evisa',
      guaranteeSlaDays: newDestForm.guaranteeSlaDays || 3,
      fastestTurnaround: newDestForm.fastestTurnaround || '24 Hours',
      tagline: newDestForm.tagline || 'Fastest tourist e-Visa',
      rejectionRefundPolicy: newDestForm.rejectionRefundPolicy || '100% Platform Fee Refund on Delay',
      requiresPassportOCR: true,
      supportsStickerVisa: newDestForm.supportsStickerVisa ?? false,
      options: [
        {
          id: `${destId}-tourist-30`,
          title: '30-Day Single Entry Tourist Visa',
          validityDays: 30,
          maxStayDays: 30,
          entryType: 'Single',
          govFee: 45,
          platformFee: adminVisaConfig.globalPlatformFeeUSD,
          processingTimeStandard: `${newDestForm.guaranteeSlaDays || 3} Business Days`,
          processingTimeExpress: newDestForm.fastestTurnaround || '24 Hours'
        }
      ],
      requirements: [
        { id: 'req-passport', title: 'Passport Front & Back', description: 'Min 6 months validity from date of entry', acceptedFormats: 'PDF, JPG, PNG', isRequired: true },
        { id: 'req-photo', title: 'ICAO Standard Photograph', description: 'White background, neutral expression', acceptedFormats: 'JPG, PNG', isRequired: true }
      ],
      icaoRules: ['Plain white background', '70-80% face coverage', 'Neutral expression']
    };
    addVisaDestination(createdDest);
    setShowAddDestModal(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleStartEditHoliday = (pkg: HolidayPackage) => {
    setEditingHolidayId(pkg.id);
    setEditHolidayForm({
      title: pkg.title,
      destination: pkg.destination,
      destinationType: pkg.destinationType,
      category: pkg.category,
      durationDays: pkg.durationDays,
      basePrice: pkg.basePrice,
      wholesaleCost: pkg.wholesaleCost,
      isBestSeller: pkg.isBestSeller,
      discountPercent: pkg.discountPercent
    });
  };

  const handleSaveEditHoliday = (id: string) => {
    updateHolidayPackage(id, editHolidayForm);
    setEditingHolidayId(null);
  };

  // Open Full Package Builder in Edit mode
  const handleOpenFullEditModal = (pkg: HolidayPackage) => {
    setEditingPackageId(pkg.id);
    setNewHolidayForm({
      ...pkg,
      departureCities: pkg.departureCities || ['Mumbai', 'Delhi', 'Bengaluru'],
      galleryImages: pkg.galleryImages || [],
      highlights: pkg.highlights || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      hotelTiers: pkg.hotelTiers || {
        standard: 'Standard Quality Accommodation',
        deluxe: 'Deluxe 4-Star Accommodation',
        luxury: 'Luxury 5-Star Accommodation'
      },
      days: (pkg.days && pkg.days.length > 0) ? pkg.days : [
        {
          dayNumber: 1,
          dayTitle: 'Arrival & Welcome Excursion',
          destination: pkg.destination,
          hotelName: 'Heritage Luxury Resort',
          hotelTier: 'Superior',
          mealsIncluded: ['Dinner'],
          currentActivity: {
            id: 'act-1',
            title: 'Orientation City Sightseeing & Evening Walk',
            duration: '3 Hours',
            priceDelta: 0,
            image: pkg.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
            description: 'Guided arrival tour of historic quarters.'
          },
          alternativeActivities: []
        }
      ]
    });
    setBuilderTab('basic');
    setPdfExtractError(null);
    setPdfExtractSuccess(null);
    setShowAddHolidayModal(true);
  };

  // Open Full Package Builder in Create mode
  const handleOpenNewPackageModal = () => {
    setEditingPackageId(null);
    setNewHolidayForm(initialNewHolidayState);
    setBuilderTab('basic');
    setPdfExtractError(null);
    setPdfExtractSuccess(null);
    setShowAddHolidayModal(true);
  };

  // PDF Extraction Handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setPdfExtractError('Please upload a valid PDF brochure file.');
      return;
    }
    setIsPdfExtracting(true);
    setPdfExtractError(null);
    setPdfExtractSuccess(null);

    try {
      const res = await packagesApi.extractFromPdf(file);
      if (res.success && res.data) {
        const extracted = res.data;
        setNewHolidayForm(prev => ({
          ...prev,
          ...(extracted as any),
          theme: (extracted.theme as any) || prev.theme || 'family',
          category: (extracted.category as any) || prev.category || 'Customized',
          destinationType: (extracted.destinationType as any) || prev.destinationType || 'domestic',
          days: (extracted.days && extracted.days.length > 0) ? (extracted.days as any) : prev.days,
          hotelTiers: extracted.hotelTiers || prev.hotelTiers,
          inclusions: (extracted.inclusions && extracted.inclusions.length > 0) ? extracted.inclusions : prev.inclusions,
          exclusions: (extracted.exclusions && extracted.exclusions.length > 0) ? extracted.exclusions : prev.exclusions,
          highlights: (extracted.highlights && extracted.highlights.length > 0) ? extracted.highlights : prev.highlights
        }));
        setPdfExtractSuccess(`✓ Extracted "${extracted.title || 'Tour'}" (${extracted.durationDays || 5} Days) from ${file.name}! Review and save below.`);
        setShowAddHolidayModal(true);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      } else {
        setPdfExtractError(res.message || 'Failed to extract package details from PDF.');
      }
    } catch (err: any) {
      setPdfExtractError(err.message || 'Error communicating with PDF extraction API.');
    } finally {
      setIsPdfExtracting(false);
      e.target.value = '';
    }
  };

  // Builder Day-by-Day Handlers
  const handleAddDay = () => {
    const currentDays = newHolidayForm.days || [];
    const nextNum = currentDays.length + 1;
    const newDay = {
      dayNumber: nextNum,
      dayTitle: `Day ${nextNum}: Sightseeing & Excursions`,
      destination: newHolidayForm.destination || 'Destination City',
      hotelName: 'Selected 4-Star Resort',
      hotelTier: 'Superior' as const,
      mealsIncluded: ['Breakfast', 'Dinner'],
      currentActivity: {
        id: `act-${nextNum}`,
        title: 'Curated Heritage & Cultural Tour',
        duration: '4-5 Hours',
        priceDelta: 0,
        image: newHolidayForm.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
        description: 'Explore scenic landmarks and local cultural highlights.'
      },
      alternativeActivities: []
    };
    setNewHolidayForm({
      ...newHolidayForm,
      days: [...currentDays, newDay],
      durationDays: Math.max(newHolidayForm.durationDays || 1, nextNum),
      durationNights: Math.max(newHolidayForm.durationNights || 1, nextNum - 1)
    });
  };

  const handleRemoveDay = (index: number) => {
    const currentDays = (newHolidayForm.days || []).filter((_, i) => i !== index);
    const reindexed = currentDays.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setNewHolidayForm({
      ...newHolidayForm,
      days: reindexed,
      durationDays: Math.max(1, reindexed.length),
      durationNights: Math.max(1, reindexed.length - 1)
    });
  };

  const handleUpdateDay = (index: number, updates: any) => {
    const currentDays = [...(newHolidayForm.days || [])];
    currentDays[index] = { ...currentDays[index], ...updates };
    setNewHolidayForm({ ...newHolidayForm, days: currentDays });
  };

  // Save from Builder (Create or Update)
  const handleSavePackageFromBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayForm.title || !newHolidayForm.destination) {
      alert('Package Title and Destination are required.');
      return;
    }

    if (editingPackageId) {
      // Update existing package
      updateHolidayPackage(editingPackageId, newHolidayForm);
      setEditingPackageId(null);
      setShowAddHolidayModal(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      // Create new package
      const pkgId = (newHolidayForm.title).toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24) || `pkg-${Date.now()}`;
      const createdPkg: HolidayPackage = {
        id: pkgId,
        title: newHolidayForm.title,
        destination: newHolidayForm.destination,
        destinationType: newHolidayForm.destinationType || 'domestic',
        region: newHolidayForm.region || 'Regional',
        category: newHolidayForm.category || 'Customized',
        theme: newHolidayForm.theme || 'family',
        durationDays: newHolidayForm.durationDays || 5,
        durationNights: newHolidayForm.durationNights || (newHolidayForm.durationDays ? newHolidayForm.durationDays - 1 : 4),
        departureCities: newHolidayForm.departureCities || ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad'],
        basePrice: newHolidayForm.basePrice || 500,
        wholesaleCost: newHolidayForm.wholesaleCost || 400,
        heroImage: newHolidayForm.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        galleryImages: newHolidayForm.galleryImages || [],
        highlights: newHolidayForm.highlights || ['Scenic Guided Tour', '4-Star Stay', 'Breakfast & Dinner'],
        inclusions: newHolidayForm.inclusions || [
          'Accommodation in 4-Star Handpicked Hotels',
          'Daily Buffet Breakfasts & Dinners',
          'Private AC Transfers & Sightseeing',
          'Dedicated Hindi / English Tour Guide'
        ],
        exclusions: newHolidayForm.exclusions || ['Airfare / Train tickets to destination', 'Personal shopping and room service'],
        hotelTiers: newHolidayForm.hotelTiers || {
          standard: 'Selected 3-Star Quality Hotel',
          deluxe: 'Selected 4-Star Premium Hotel',
          luxury: 'Selected 5-Star Luxury Resort'
        },
        days: (newHolidayForm.days && newHolidayForm.days.length > 0) ? newHolidayForm.days : [
          {
            dayNumber: 1,
            dayTitle: 'Arrival & Welcome Excursion',
            destination: newHolidayForm.destination,
            currentActivity: {
              id: 'act-arrival',
              title: 'Orientation City Sightseeing & Evening Walk',
              duration: '3 Hours',
              priceDelta: 0,
              image: newHolidayForm.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
              description: 'Relaxed introductory exploration of key local viewpoints and markets.'
            },
            alternativeActivities: [],
            hotelName: 'Premium 4-Star City Hotel',
            hotelTier: 'Superior',
            mealsIncluded: ['Dinner']
          }
        ],
        isBestSeller: newHolidayForm.isBestSeller ?? false,
        isFeatured: newHolidayForm.isFeatured ?? true,
        isTrending: newHolidayForm.isTrending ?? false,
        rating: newHolidayForm.rating ?? 4.6,
        reviewCount: newHolidayForm.reviewCount ?? 140,
        discountPercent: newHolidayForm.discountPercent || 10,
        cancellationPolicy: newHolidayForm.cancellationPolicy || 'Free cancellation up to 10 days before departure.'
      };
      addHolidayPackage(createdPkg);
      setShowAddHolidayModal(false);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const filteredVisaApplications = visaApplications.filter(app => {
    if (visaAppStatusFilter === 'all') return true;
    return app.status === visaAppStatusFilter;
  });

  const filteredHolidayBookings = holidayBookings.filter(b => {
    if (holidayBookingStatusFilter === 'all') return true;
    return b.status === holidayBookingStatusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #032559 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.75rem' }}>
              <ShieldCheck size={14} color="#fca5a5" />
              Super Admin Executive Portal • Full Governance
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              Platform Super Admin Hub
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#c7d2fe', marginTop: '6px', maxWidth: '650px', lineHeight: 1.5 }}>
              Manage platform gross booking value, customer reservations across Akbar Travels, Atlys & Thomas Cook, adjust partner markups, and configure holiday & visa engines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => openModal('audit')}
            >
              View Immutable Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="card" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeAdminTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('analytics')}
          >
            <TrendingUp size={15} /> Executive Revenue & Analytics
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('bookings')}
          >
            <Calendar size={15} /> Customer Bookings ({bookings.length})
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'markups' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('markups')}
          >
            <Tag size={15} /> Partner Markups & Pricing
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'visas' ? 'btn-primary' : 'btn-secondary'}`}
            style={activeAdminTab === 'visas' ? { background: '#7c3aed', borderColor: '#7c3aed', color: '#fff' } : {}}
            onClick={() => setActiveAdminTab('visas')}
          >
            <Globe size={15} /> 🛂 Atlys Visa Operations ({visaApplications.length})
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'holidays' ? 'btn-primary' : 'btn-secondary'}`}
            style={activeAdminTab === 'holidays' ? { background: '#d97706', borderColor: '#d97706', color: '#fff' } : {}}
            onClick={() => setActiveAdminTab('holidays')}
          >
            <Palmtree size={15} /> 🏖️ Thomas Cook Holidays ({holidayBookings.length})
          </button>

          <button 
            className={`btn btn-sm ${activeAdminTab === 'leads' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveAdminTab('leads')}
          >
            <Users size={15} /> Customer Inquiries & CRM ({leads.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Executive Analytics */}
      {activeAdminTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Gross Booking Value (GBV)</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-heading)', margin: '6px 0' }}>
                {formatPrice(totalGBV)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>+24.6% vs last calendar month</div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Platform Net Commission</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', margin: '6px 0' }}>
                {formatPrice(totalNetProfit)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Margin: 14.8% blended</div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--brand-accent)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Bookings</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-accent)', margin: '6px 0' }}>
                {bookings.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 6 Travel Verticals</div>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Marketing ROAS</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#8b5cf6', margin: '6px 0' }}>
                {blendedROAS}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ad Spend: {formatPrice(totalAdSpend)}</div>
            </div>
          </div>

          {/* Marketing Campaigns Table */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1rem' }}>
              Channel Marketing Attribution Performance
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Ad Channel & Partner</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Ad Spend</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Leads</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Converted</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>GBV Generated</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Net Profit</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Blended CAC</th>
                  </tr>
                </thead>
                <tbody>
                  {attributionCampaigns.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                        {c.source}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{c.campaign}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>{formatPrice(c.spend)}</td>
                      <td style={{ padding: '12px 14px' }}>{c.leads}</td>
                      <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 700 }}>{c.converted}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{formatPrice(c.gbv)}</td>
                      <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 700 }}>{formatPrice(c.netProfit)}</td>
                      <td style={{ padding: '12px 14px' }}>{formatPrice(c.cac)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Bookings */}
      {activeAdminTab === 'bookings' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Live Customer Bookings
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Real reservations created via Akbar Travels (Flights/Hotels), Thomas Cook (Holidays), and Atlys (Visas).
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Booking ID</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Vertical & Partner</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Customer Details</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Date & Schedule</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Amount</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {b.id}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{b.referenceCode}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-card-subtle)', textTransform: 'uppercase' }}>
                        {b.vertical}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{b.subtitle || b.title}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{b.passenger?.fullName || b.travelerName || 'Customer'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.passenger?.email || '—'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {b.travelDates || b.travelDate || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                      {formatPrice(b.totalAmountUSD)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        padding: '3px 8px', 
                        borderRadius: '4px',
                        background: b.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : b.status === 'pending_approval' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: b.status === 'confirmed' ? '#10b981' : b.status === 'pending_approval' ? '#f59e0b' : '#ef4444'
                      }}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {b.status === 'pending_approval' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn btn-sm btn-primary"
                            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                            onClick={() => approveBooking(b.id, 'Approved by Super Admin')}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '3px 8px', fontSize: '0.75rem', color: '#ef4444' }}
                            onClick={() => cancelBooking(b.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Partner Markups */}
      {activeAdminTab === 'markups' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
              Partner Dynamic Markups & Pricing Engine
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Adjust live consumer pricing by setting fee markups on top of Akbar Travels, Atlys and Thomas Cook wholesale rates.
            </p>
          </div>

          <form onSubmit={handleSaveMarkups} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Akbar Travels Flight Markup (Flat USD / Passenger)</span>
                <strong style={{ color: 'var(--brand-accent)' }}>+${markupValues.flightsFlatUSD}</strong>
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                step="1"
                value={markupValues.flightsFlatUSD}
                onChange={e => setMarkupValues({ ...markupValues, flightsFlatUSD: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Akbar Travels Hotel Markup (Percentage % on Room Rate)</span>
                <strong style={{ color: 'var(--brand-accent)' }}>+{markupValues.hotelsPercent}%</strong>
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                step="0.5"
                value={markupValues.hotelsPercent}
                onChange={e => setMarkupValues({ ...markupValues, hotelsPercent: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Atlys Visa Application Platform Surcharge (Flat USD)</span>
                <strong style={{ color: '#7c3aed' }}>+${markupValues.visasFlatUSD}</strong>
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                step="1"
                value={markupValues.visasFlatUSD}
                onChange={e => setMarkupValues({ ...markupValues, visasFlatUSD: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Thomas Cook Holidays Commission (%)</span>
                <strong style={{ color: '#d97706' }}>+{markupValues.holidaysPercent}%</strong>
              </label>
              <input 
                type="number" 
                className="form-input"
                min="0"
                step="0.5"
                value={markupValues.holidaysPercent}
                onChange={e => setMarkupValues({ ...markupValues, holidaysPercent: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 800 }}
              >
                Save Markup Configuration
              </button>
              {savedMarkupSuccess && (
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                  ✓ Markups successfully applied to live booking engine!
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Atlys Visa Operations & Engine */}
      {activeAdminTab === 'visas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Sub-section A: Global Visa Engine Config */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7c3aed', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe size={20} /> Atlys Visa Engine Global Settings
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Configure platform fee rules, doorstep courier fees, on-time SLA guarantee status, and customer support channels.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveVisaEngine} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Global Platform Fee (USD)</label>
                <input 
                  type="number" 
                  className="form-input"
                  min="0"
                  step="1"
                  value={visaEngineConfig.globalPlatformFeeUSD}
                  onChange={e => setVisaEngineConfig({ ...visaEngineConfig, globalPlatformFeeUSD: parseFloat(e.target.value) || 0 })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Applied across all destinations</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Doorstep Courier Fee (USD)</label>
                <input 
                  type="number" 
                  className="form-input"
                  min="0"
                  step="1"
                  value={visaEngineConfig.doorstepCourierFeeUSD}
                  onChange={e => setVisaEngineConfig({ ...visaEngineConfig, doorstepCourierFeeUSD: parseFloat(e.target.value) || 0 })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>For physical embassy sticker visas</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Express Surcharge (USD)</label>
                <input 
                  type="number" 
                  className="form-input"
                  min="0"
                  step="1"
                  value={visaEngineConfig.expressTurnaroundSurchargeUSD}
                  onChange={e => setVisaEngineConfig({ ...visaEngineConfig, expressTurnaroundSurchargeUSD: parseFloat(e.target.value) || 0 })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Fast-track visa processing fee</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Support Helpline</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={visaEngineConfig.supportHelpline}
                  onChange={e => setVisaEngineConfig({ ...visaEngineConfig, supportHelpline: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">WhatsApp Helpline</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={visaEngineConfig.whatsappSupportNumber}
                  onChange={e => setVisaEngineConfig({ ...visaEngineConfig, whatsappSupportNumber: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="checkbox" 
                    checked={visaEngineConfig.onTimeGuaranteeActive}
                    onChange={e => setVisaEngineConfig({ ...visaEngineConfig, onTimeGuaranteeActive: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#7c3aed' }}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>On-Time SLA Guarantee Active</span>
                </label>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Displays "100% Fee Refund on Delay" on customer portal</div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#7c3aed', borderColor: '#7c3aed', padding: '0.75rem 1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={16} /> Save Visa Engine Configuration
                </button>
                {savedVisaEngineSuccess && (
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                    ✓ Configuration saved! Reflected in real-time on Atlys Visa Desk.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Sub-section B: Visa Applications Pipeline */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  Active Visa Applications Pipeline ({visaApplications.length})
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Monitor applicant biodata, OCR results, and advance applications through the consular pipeline.
                </p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', 'docs_uploaded', 'ocr_verified', 'embassy_processing', 'approved', 'rejected'].map(st => (
                  <button
                    key={st}
                    className={`btn btn-sm ${visaAppStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={visaAppStatusFilter === st ? { background: '#7c3aed', borderColor: '#7c3aed' } : {}}
                    onClick={() => setVisaAppStatusFilter(st)}
                  >
                    {st === 'all' ? 'All' : st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Tracking ID</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Applicant</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Destination & Type</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>SLA Delivery</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Amount</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Consular Status</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisaApplications.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#7c3aed' }}>
                        {app.trackingId}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{app.submissionDate}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{app.applicantName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Passport: {app.passportNumber}</div>
                        {app.applicantPhone && <div style={{ fontSize: '0.72rem', color: 'var(--brand-blue)' }}>{app.applicantPhone}</div>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{app.country}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.visaType}</div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: 10, background: app.flowType === 'sticker' ? 'rgba(217,119,6,0.1)' : 'rgba(124,58,237,0.1)', color: app.flowType === 'sticker' ? '#d97706' : '#7c3aed' }}>
                          {app.flowType === 'sticker' ? '📮 Sticker' : '🌐 e-Visa'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#059669' }}>{app.guaranteedDeliveryDate || 'Standard'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Guaranteed Date</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                        {formatPrice(app.totalAmountUSD || 0)}
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          Gov: ${app.govFeeUSD || 0} + Atlys: ${app.platformFeeUSD || 0}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <select
                          value={app.status}
                          onChange={e => updateVisaApplicationStatus(app.trackingId, e.target.value as VisaApplicationStatus, 'Status updated by Super Admin')}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: app.status === 'approved' ? 'rgba(16,185,129,0.1)' : app.status === 'embassy_processing' ? 'rgba(59,130,246,0.1)' : 'var(--bg-card-subtle)',
                            color: app.status === 'approved' ? '#10b981' : app.status === 'embassy_processing' ? '#3b82f6' : 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          <option value="draft">Draft</option>
                          <option value="docs_uploaded">Docs Uploaded</option>
                          <option value="ocr_verified">OCR Verified</option>
                          <option value="embassy_processing">Embassy Processing</option>
                          <option value="approved">Approved & Issued</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.doorstepAddress ? (
                          <div>
                            <span style={{ fontWeight: 700, color: '#d97706' }}>📦 Doorstep:</span> {app.doorstepAddress.city} ({app.doorstepAddress.pickupSlot})
                          </div>
                        ) : (
                          <span>100% Digital e-Visa</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-section C: Destination Catalog Management */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  Destination Catalog ({visaDestinations.length} Countries)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Manage active countries, SLA guarantee turnarounds, taglines, and sticker visa options.
                </p>
              </div>

              <button 
                className="btn btn-sm btn-primary"
                style={{ background: '#7c3aed', borderColor: '#7c3aed', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => setShowAddDestModal(true)}
              >
                <Plus size={14} /> Add New Destination
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Country</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>SLA Guarantee</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Fastest Turnaround</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Sticker Support</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Tagline / Refund Policy</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visaDestinations.map(d => {
                    const isEditing = editingDestinationId === d.id;
                    return (
                      <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                          <span style={{ fontSize: '1.4rem', marginRight: 8 }}>{d.flag}</span>
                          {d.countryName}
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>Code: {d.countryCode}</div>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <select
                              className="form-select"
                              style={{ padding: '3px 6px', fontSize: '0.78rem' }}
                              value={editDestForm.category || 'popular'}
                              onChange={e => setEditDestForm({ ...editDestForm, category: e.target.value as VisaCategory })}
                            >
                              <option value="popular">Popular</option>
                              <option value="instant_evisa">Instant e-Visa</option>
                              <option value="sticker">Sticker Visa</option>
                              <option value="on_arrival">On Arrival</option>
                            </select>
                          ) : (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'var(--bg-card-subtle)' }}>
                              {d.category || 'popular'}
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: 70, padding: '3px 6px', fontSize: '0.8rem' }}
                              value={editDestForm.guaranteeSlaDays || 3}
                              onChange={e => setEditDestForm({ ...editDestForm, guaranteeSlaDays: parseInt(e.target.value) || 1 })}
                            />
                          ) : (
                            <span style={{ fontWeight: 700, color: '#059669' }}>
                              {d.guaranteeSlaDays || 3} Days
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '3px 6px', fontSize: '0.8rem' }}
                              value={editDestForm.fastestTurnaround || ''}
                              onChange={e => setEditDestForm({ ...editDestForm, fastestTurnaround: e.target.value })}
                            />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-heading)' }}>
                              {d.fastestTurnaround || '—'}
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={editDestForm.supportsStickerVisa ?? false}
                              onChange={e => setEditDestForm({ ...editDestForm, supportsStickerVisa: e.target.checked })}
                              style={{ width: 16, height: 16 }}
                            />
                          ) : (
                            <span>{d.supportsStickerVisa ? '✅ Supported' : '❌ No'}</span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 200 }}>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '3px 6px', fontSize: '0.78rem' }}
                              value={editDestForm.tagline || ''}
                              onChange={e => setEditDestForm({ ...editDestForm, tagline: e.target.value })}
                            />
                          ) : (
                            <div>{d.tagline || '—'}</div>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="btn btn-sm btn-primary"
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                                onClick={() => handleSaveEditDestination(d.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                                onClick={() => setEditingDestinationId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '3px 6px' }}
                                title="Edit Destination"
                                onClick={() => handleStartEditDestination(d)}
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '3px 6px', color: '#ef4444' }}
                                title="Delete Destination"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${d.countryName}?`)) {
                                    deleteVisaDestination(d.id);
                                  }
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Destination Modal */}
          {showAddDestModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
              <div className="card" style={{ width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#7c3aed' }}>
                  Add New Visa Destination
                </h3>

                <form onSubmit={handleCreateNewDestination} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Country Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={newDestForm.countryName}
                        onChange={e => setNewDestForm({ ...newDestForm, countryName: e.target.value })}
                        placeholder="e.g. South Korea"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Country Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newDestForm.countryCode}
                        onChange={e => setNewDestForm({ ...newDestForm, countryCode: e.target.value })}
                        placeholder="e.g. KOR"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Flag</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newDestForm.flag}
                        onChange={e => setNewDestForm({ ...newDestForm, flag: e.target.value })}
                        placeholder="🇰🇷"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={newDestForm.category}
                        onChange={e => setNewDestForm({ ...newDestForm, category: e.target.value as VisaCategory })}
                      >
                        <option value="instant_evisa">Instant e-Visa</option>
                        <option value="popular">Popular</option>
                        <option value="sticker">Sticker Visa</option>
                        <option value="on_arrival">On Arrival</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">SLA Guarantee (Days)</label>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        value={newDestForm.guaranteeSlaDays}
                        onChange={e => setNewDestForm({ ...newDestForm, guaranteeSlaDays: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Fastest Turnaround</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newDestForm.fastestTurnaround}
                        onChange={e => setNewDestForm({ ...newDestForm, fastestTurnaround: e.target.value })}
                        placeholder="e.g. 12 Hours"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tagline</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newDestForm.tagline}
                      onChange={e => setNewDestForm({ ...newDestForm, tagline: e.target.value })}
                      placeholder="e.g. Official K-ETA electronic travel authority"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rejection / Delay Refund Policy</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newDestForm.rejectionRefundPolicy}
                      onChange={e => setNewDestForm({ ...newDestForm, rejectionRefundPolicy: e.target.value })}
                      placeholder="e.g. 100% Platform Fee Refund on Delay"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      id="supportsStickerCheck"
                      checked={newDestForm.supportsStickerVisa ?? false}
                      onChange={e => setNewDestForm({ ...newDestForm, supportsStickerVisa: e.target.checked })}
                      style={{ width: 16, height: 16 }}
                    />
                    <label htmlFor="supportsStickerCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                      Supports Embassy Physical Sticker Visa (Doorstep Concierge)
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddDestModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                    >
                      Create Destination
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 5: Thomas Cook Holiday Operations & Catalog */}
      {activeAdminTab === 'holidays' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Sub-section A: Global Holiday Engine Config */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Palmtree size={20} /> Thomas Cook Holiday Engine Settings & Wholesale Margins
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Configure wholesale-to-retail markups, group discounts, instant booking status, and customer service hotlines.
                </p>
              </div>

              {/* Real DB Status & Sync */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: isDbConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: isDbConnected ? '#059669' : '#d97706',
                  border: `1px solid ${isDbConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isDbConnected ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
                  {isDbConnected ? 'MongoDB + Express API Active' : 'Offline Cache Engine'}
                </span>

                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={handleSyncWithDb}
                  disabled={isSyncingDb}
                >
                  {isSyncingDb ? 'Syncing...' : '🔄 Sync with MongoDB'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveHolidayEngine} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Partner Retail Markup (%)</label>
                <input 
                  type="number" 
                  className="form-input"
                  min="0"
                  step="0.5"
                  value={holidayEngineConfig.partnerMarkupPercent}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, partnerMarkupPercent: parseFloat(e.target.value) || 0 })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Added automatically onto wholesale supplier rates</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Group Discount (4+ Pax) (%)</label>
                <input 
                  type="number" 
                  className="form-input"
                  min="0"
                  step="0.5"
                  value={holidayEngineConfig.groupDiscountPercent}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, groupDiscountPercent: parseFloat(e.target.value) || 0 })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Applied automatically during customer checkout</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thomas Cook Helpline</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={holidayEngineConfig.supportHelpline}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, supportHelpline: e.target.value })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Official Toll-Free helpline shown on brochures</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">WhatsApp Leads Hotline</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={holidayEngineConfig.whatsappInquiryNumber}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, whatsappInquiryNumber: e.target.value })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Direct sales agent WhatsApp link</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="checkbox" 
                    checked={holidayEngineConfig.tourManagerIncludedByDefault}
                    onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, tourManagerIncludedByDefault: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#d97706' }}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Dedicated Tour Manager Included</span>
                </label>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Displays Thomas Cook Tour Manager badge across packages</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="checkbox" 
                    checked={holidayEngineConfig.enableInstantBooking}
                    onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, enableInstantBooking: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#d97706' }}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Enable Instant Online Booking</span>
                </label>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Allows customers to book packages directly without prior inquiry</div>
              </div>

              {/* Marketing & Branding Section Divider */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#d97706', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} /> Consumer Homepage & Dynamic Marketing Settings
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Customize customer-facing hero copy, promotional banners, assurance badges, and loyalty multipliers.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                <label className="form-label">Hero Headline</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={holidayEngineConfig.heroHeadline}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, heroHeadline: e.target.value })}
                  placeholder="e.g. Explore Handcrafted Holidays Across the World"
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Primary title displayed on the holidays consumer portal</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                <label className="form-label">Hero Subheading</label>
                <textarea 
                  className="form-input"
                  rows={2}
                  value={holidayEngineConfig.heroSubheading}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, heroSubheading: e.target.value })}
                  placeholder="Short tagline describing handcrafted itineraries..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Announcement Banner Text</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={holidayEngineConfig.announcementBanner}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, announcementBanner: e.target.value })}
                  placeholder="e.g. 🎉 Summer Special Offer: Flat 10% OFF"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="checkbox" 
                    checked={holidayEngineConfig.announcementBannerEnabled}
                    onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, announcementBannerEnabled: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#d97706' }}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>Show Announcement Banner</span>
                </label>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Displays top promotional banner across customer pages</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assurance Strip Title</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={holidayEngineConfig.assuranceTitle}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, assuranceTitle: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assurance Badges (Comma-separated)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={(holidayEngineConfig.assuranceBadges || []).join(', ')}
                  onChange={e => setHolidayEngineConfig({
                    ...holidayEngineConfig,
                    assuranceBadges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Chips shown inside the blue holiday assurance bar</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Loyalty Points Rate (e.g. 0.05 = 5%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  max="1"
                  className="form-input"
                  value={holidayEngineConfig.loyaltyPointsRate}
                  onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, loyaltyPointsRate: parseFloat(e.target.value) || 0 })}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Points credited per dollar spent on holidays</div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Hotel Tier Multipliers (Comfort / Superior / Luxury)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <input
                    type="number"
                    step="0.05"
                    className="form-input"
                    title="Comfort Multiplier"
                    value={holidayEngineConfig.hotelTierMultiplierComfort}
                    onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, hotelTierMultiplierComfort: parseFloat(e.target.value) || 0.9 })}
                  />
                  <input
                    type="number"
                    step="0.05"
                    className="form-input"
                    title="Superior Multiplier"
                    value={holidayEngineConfig.hotelTierMultiplierSuperior}
                    onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, hotelTierMultiplierSuperior: parseFloat(e.target.value) || 1.0 })}
                  />
                  <input
                    type="number"
                    step="0.05"
                    className="form-input"
                    title="Luxury Multiplier"
                    value={holidayEngineConfig.hotelTierMultiplierLuxury}
                    onChange={e => setHolidayEngineConfig({ ...holidayEngineConfig, hotelTierMultiplierLuxury: parseFloat(e.target.value) || 1.35 })}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Comfort (0.9x) | Superior (1.0x) | Luxury (1.35x)</div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: '#d97706', borderColor: '#d97706', padding: '0.75rem 1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={16} /> Save Holiday Engine Configuration
                </button>
                {savedHolidayEngineSuccess && (
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                    ✓ Configuration saved! Reflected live on Thomas Cook Holiday Desk.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Sub-section B: Customer Holiday Bookings & Lead Pipeline */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  Holiday Bookings & Customized Inquiries ({holidayBookings.length})
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Manage reservations, review passenger details, and advance status through the Thomas Cook booking pipeline.
                </p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', 'inquiry_received', 'customizing', 'quote_sent', 'confirmed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    className={`btn btn-sm ${holidayBookingStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={holidayBookingStatusFilter === st ? { background: '#d97706', borderColor: '#d97706' } : {}}
                    onClick={() => setHolidayBookingStatusFilter(st)}
                  >
                    {st === 'all' ? 'All' : st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Booking Ref</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Package & Destination</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Customer & Contact</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Schedule & Pax</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Revenue Breakdown</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Booking Status</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHolidayBookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#d97706' }}>
                        {b.bookingReference}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>{b.createdAt}</div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{b.packageTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {b.destination}</div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: 10, background: b.destinationType === 'domestic' ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)', color: b.destinationType === 'domestic' ? '#059669' : '#d97706' }}>
                          {b.destinationType === 'domestic' ? '🇮🇳 Domestic' : '🌍 International'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{b.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--brand-blue)' }}>{b.customerPhone}</div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{b.travelDate}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ex-{b.departureCity}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: 2 }}>
                          {b.paxAdults} Adults {b.paxChildren > 0 ? `+ ${b.paxChildren} Kids` : ''} ({b.selectedHotelTier})
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                        <div style={{ fontSize: '1rem', color: '#d97706' }}>{formatPrice(b.totalAmountUSD)}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          Wholesale: ${b.wholesaleCostUSD} • Net: +${b.markupAmountUSD}
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <select
                          value={b.status}
                          onChange={e => updateHolidayBookingStatus(b.bookingReference, e.target.value as HolidayBookingStatus, 'Status updated by Super Admin')}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: b.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : b.status === 'quote_sent' ? 'rgba(59,130,246,0.1)' : 'var(--bg-card-subtle)',
                            color: b.status === 'confirmed' ? '#10b981' : b.status === 'quote_sent' ? '#3b82f6' : 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          <option value="inquiry_received">Inquiry Received</option>
                          <option value="customizing">Customizing Plan</option>
                          <option value="quote_sent">Quote Sent</option>
                          <option value="confirmed">Confirmed & Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <a
                          href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(b.customerName)}%2C%20following%20up%20on%20your%20Thomas%20Cook%20Holiday%20Booking%20%23${b.bookingReference}%20for%20${encodeURIComponent(b.packageTitle)}%21`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: '#25D366', color: '#fff', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-section C: Holiday Packages Catalog Management */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                  Holiday Packages Catalog ({holidayPackages.length} Active Packages)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Manage titles, destinations, wholesale rates, live selling prices, and itineraries.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handlePdfUpload}
                />
                
                <button 
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, borderColor: '#d97706', color: '#d97706', fontWeight: 700 }}
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={isPdfExtracting}
                >
                  {isPdfExtracting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Extracting from PDF...
                    </>
                  ) : (
                    <>
                      <FileUp size={14} /> Import from PDF Brochure
                    </>
                  )}
                </button>

                <button 
                  type="button"
                  className="btn btn-sm btn-primary"
                  style={{ background: '#d97706', borderColor: '#d97706', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={handleOpenNewPackageModal}
                >
                  <Plus size={14} /> Add New Holiday Package
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Package</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Type & Region</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Duration</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Wholesale Cost</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Live Selling Price</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Promotions</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holidayPackages.map(pkg => {
                    const isEditing = editingHolidayId === pkg.id;
                    const sellingPrice = Math.round(pkg.basePrice * (1 + adminHolidayConfig.partnerMarkupPercent / 100));

                    return (
                      <tr key={pkg.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img
                              src={pkg.heroImage}
                              alt={pkg.title}
                              style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                            />
                            <div>
                              {isEditing ? (
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ padding: '3px 6px', fontSize: '0.8rem', width: 220 }}
                                  value={editHolidayForm.title || ''}
                                  onChange={e => setEditHolidayForm({ ...editHolidayForm, title: e.target.value })}
                                />
                              ) : (
                                <div style={{ fontWeight: 800, color: 'var(--text-heading)' }}>{pkg.title}</div>
                              )}
                              <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>{pkg.destination}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <select
                              className="form-select"
                              style={{ padding: '3px 6px', fontSize: '0.78rem' }}
                              value={editHolidayForm.destinationType || 'domestic'}
                              onChange={e => setEditHolidayForm({ ...editHolidayForm, destinationType: e.target.value as HolidayDestinationType })}
                            >
                              <option value="domestic">Domestic India</option>
                              <option value="international">International</option>
                            </select>
                          ) : (
                            <div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: pkg.destinationType === 'domestic' ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)', color: pkg.destinationType === 'domestic' ? '#059669' : '#d97706' }}>
                                {pkg.destinationType === 'domestic' ? '🇮🇳 Domestic' : '🌍 International'}
                              </span>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{pkg.region || '—'}</div>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: 65, padding: '3px 6px', fontSize: '0.8rem' }}
                              value={editHolidayForm.durationDays || 5}
                              onChange={e => setEditHolidayForm({ ...editHolidayForm, durationDays: parseInt(e.target.value) || 1 })}
                            />
                          ) : (
                            <span style={{ fontWeight: 700 }}>{pkg.durationDays}D / {pkg.durationNights || pkg.durationDays - 1}N</span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: 80, padding: '3px 6px', fontSize: '0.8rem' }}
                              value={editHolidayForm.wholesaleCost || 0}
                              onChange={e => setEditHolidayForm({ ...editHolidayForm, wholesaleCost: parseFloat(e.target.value) || 0 })}
                            />
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>{formatPrice(pkg.wholesaleCost)}</span>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: 80, padding: '3px 6px', fontSize: '0.8rem' }}
                              value={editHolidayForm.basePrice || 0}
                              onChange={e => setEditHolidayForm({ ...editHolidayForm, basePrice: parseFloat(e.target.value) || 0 })}
                            />
                          ) : (
                            <div>
                              <div style={{ fontWeight: 800, color: '#d97706' }}>{formatPrice(sellingPrice)}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Base: ${pkg.basePrice}</div>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {pkg.isBestSeller && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#d97706', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                                BEST SELLER
                              </span>
                            )}
                            {pkg.discountPercent && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>
                                -{pkg.discountPercent}%
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="btn btn-sm btn-primary"
                                style={{ padding: '2px 8px', fontSize: '0.75rem', background: '#d97706', borderColor: '#d97706' }}
                                onClick={() => handleSaveEditHoliday(pkg.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                                onClick={() => setEditingHolidayId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '3px 6px', color: '#d97706' }}
                                title="Full Package & Itinerary Builder"
                                onClick={() => handleOpenFullEditModal(pkg)}
                              >
                                <Sliders size={13} />
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '3px 6px' }}
                                title="Quick Edit"
                                onClick={() => handleStartEditHoliday(pkg)}
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ padding: '3px 6px', color: '#ef4444' }}
                                title="Delete Package"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${pkg.title}?`)) {
                                    deleteHolidayPackage(pkg.id);
                                  }
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Holiday Package Builder & PDF Import Modal */}
          {showAddHolidayModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
              <div className="card" style={{ width: '100%', maxWidth: 840, maxHeight: '92vh', overflowY: 'auto', padding: '1.75rem', borderRadius: 20 }}>
                
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#d97706', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Palmtree size={20} />
                      {editingPackageId ? `Edit Package: ${newHolidayForm.title}` : 'Full Holiday Package Builder & PDF Importer'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                      Configure itineraries, daily activities, inclusions, hotel tiers, and pricing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddHolidayModal(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* PDF Extraction Strip / Dropzone */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(15, 76, 164, 0.08) 100%)',
                  border: '1.5px dashed #d97706',
                  borderRadius: 14,
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <FileUp size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                        Instant PDF Brochure Extraction
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Upload a tour itinerary PDF to auto-populate all form fields, day schedules, and hotel tiers.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label
                      className="btn btn-sm btn-primary"
                      style={{
                        background: '#d97706',
                        borderColor: '#d97706',
                        cursor: isPdfExtracting ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        margin: 0
                      }}
                    >
                      {isPdfExtracting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Parsing Brochure...
                        </>
                      ) : (
                        <>
                          <Upload size={14} /> Upload Tour PDF
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        style={{ display: 'none' }}
                        disabled={isPdfExtracting}
                        onChange={handlePdfUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Feedback notifications */}
                {pdfExtractSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#059669', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{pdfExtractSuccess}</span>
                    <button type="button" onClick={() => setPdfExtractSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669' }}>✕</button>
                  </div>
                )}
                {pdfExtractError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#dc2626', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>⚠️ {pdfExtractError}</span>
                    <button type="button" onClick={() => setPdfExtractError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>✕</button>
                  </div>
                )}

                {/* Builder Tabs */}
                <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
                  {[
                    { key: 'basic', label: '1. Overview & Info' },
                    { key: 'pricing', label: '2. Pricing & Hotels' },
                    { key: 'media', label: '3. Media & Gallery' },
                    { key: 'inclusions', label: '4. Highlights & Inclusions' },
                    { key: 'itinerary', label: `5. Day Itinerary (${(newHolidayForm.days || []).length} Days)` }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setBuilderTab(tab.key as any)}
                      style={{
                        padding: '0.4rem 0.95rem',
                        borderRadius: 100,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        border: builderTab === tab.key ? '1px solid #d97706' : '1px solid var(--border-color)',
                        background: builderTab === tab.key ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg-card-subtle)',
                        color: builderTab === tab.key ? '#d97706' : 'var(--text-main)'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSavePackageFromBuilder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* TAB 1: OVERVIEW & INFO */}
                  {builderTab === 'basic' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Package Title *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={newHolidayForm.title || ''}
                          onChange={e => setNewHolidayForm({ ...newHolidayForm, title: e.target.value })}
                          placeholder="e.g. Kashmir Majestic Valleys & Alpine Gondola Odyssey"
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Destination *</label>
                          <input
                            type="text"
                            className="form-input"
                            required
                            value={newHolidayForm.destination || ''}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, destination: e.target.value })}
                            placeholder="e.g. Kashmir, India"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Destination Sector Type</label>
                          <select
                            className="form-select"
                            value={newHolidayForm.destinationType || 'domestic'}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, destinationType: e.target.value as any })}
                          >
                            <option value="domestic">Domestic India</option>
                            <option value="international">International</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Region</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newHolidayForm.region || ''}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, region: e.target.value })}
                            placeholder="e.g. North India / Europe"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={newHolidayForm.category || 'Customized'}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, category: e.target.value as any })}
                          >
                            <option value="Customized">Customized</option>
                            <option value="Fixed Departure">Fixed Departure</option>
                            <option value="Group Tour">Group Tour</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Theme</label>
                          <select
                            className="form-select"
                            value={newHolidayForm.theme || 'family'}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, theme: e.target.value as any })}
                          >
                            <option value="family">Family</option>
                            <option value="honeymoon">Honeymoon</option>
                            <option value="adventure">Adventure</option>
                            <option value="luxury">Luxury</option>
                            <option value="budget">Budget</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Duration Days</label>
                          <input
                            type="number"
                            className="form-input"
                            min="1"
                            value={newHolidayForm.durationDays || 5}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, durationDays: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Duration Nights</label>
                          <input
                            type="number"
                            className="form-input"
                            min="0"
                            value={newHolidayForm.durationNights || 4}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, durationNights: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Rating (0 - 5)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            className="form-input"
                            value={newHolidayForm.rating ?? 4.7}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, rating: parseFloat(e.target.value) || 4.5 })}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Review Count</label>
                          <input
                            type="number"
                            min="0"
                            className="form-input"
                            value={newHolidayForm.reviewCount ?? 150}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, reviewCount: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Departure Hub Cities (Comma-separated)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={(newHolidayForm.departureCities || []).join(', ')}
                          onChange={e => setNewHolidayForm({
                            ...newHolidayForm,
                            departureCities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Mumbai, Delhi, Bengaluru, Ahmedabad"
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: 4 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={newHolidayForm.isBestSeller ?? false}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, isBestSeller: e.target.checked })}
                            style={{ accentColor: '#d97706' }}
                          />
                          Mark as "Best Seller"
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={newHolidayForm.isFeatured ?? true}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, isFeatured: e.target.checked })}
                            style={{ accentColor: '#d97706' }}
                          />
                          Featured on Homepage
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={newHolidayForm.isTrending ?? false}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, isTrending: e.target.checked })}
                            style={{ accentColor: '#d97706' }}
                          />
                          Trending Badge
                        </label>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRICING & HOTEL TIERS */}
                  {builderTab === 'pricing' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Base Retail Price (USD) *</label>
                          <input
                            type="number"
                            className="form-input"
                            min="0"
                            required
                            value={newHolidayForm.basePrice || 0}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, basePrice: parseFloat(e.target.value) || 0 })}
                          />
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Starting consumer rate</div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Wholesale Cost (USD)</label>
                          <input
                            type="number"
                            className="form-input"
                            min="0"
                            value={newHolidayForm.wholesaleCost || 0}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, wholesaleCost: parseFloat(e.target.value) || 0 })}
                          />
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Internal cost basis</div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Strikethrough Discount (%)</label>
                          <input
                            type="number"
                            className="form-input"
                            min="0"
                            max="100"
                            value={newHolidayForm.discountPercent || 0}
                            onChange={e => setNewHolidayForm({ ...newHolidayForm, discountPercent: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Cancellation Policy</label>
                        <input
                          type="text"
                          className="form-input"
                          value={newHolidayForm.cancellationPolicy || ''}
                          onChange={e => setNewHolidayForm({ ...newHolidayForm, cancellationPolicy: e.target.value })}
                          placeholder="e.g. Free cancellation up to 15 days before departure."
                        />
                      </div>

                      {/* Hotel Tiers */}
                      <div style={{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h5 style={{ margin: 0, fontWeight: 800, fontSize: '0.88rem', color: '#d97706' }}>
                          Verified Hotel Accommodations by Tier
                        </h5>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Comfort 3-Star Hotel Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newHolidayForm.hotelTiers?.standard || ''}
                            onChange={e => setNewHolidayForm({
                              ...newHolidayForm,
                              hotelTiers: { ...(newHolidayForm.hotelTiers || { deluxe: '', luxury: '' }), standard: e.target.value }
                            })}
                            placeholder="e.g. Grand Mumtaz / Mascot Houseboat"
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Superior 4-Star Hotel Name (Recommended)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newHolidayForm.hotelTiers?.deluxe || ''}
                            onChange={e => setNewHolidayForm({
                              ...newHolidayForm,
                              hotelTiers: { ...(newHolidayForm.hotelTiers || { standard: '', luxury: '' }), deluxe: e.target.value }
                            })}
                            placeholder="e.g. Radisson Srinagar / Pahalgam Hotel"
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Luxury 5-Star Hotel Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={newHolidayForm.hotelTiers?.luxury || ''}
                            onChange={e => setNewHolidayForm({
                              ...newHolidayForm,
                              hotelTiers: { ...(newHolidayForm.hotelTiers || { standard: '', deluxe: '' }), luxury: e.target.value }
                            })}
                            placeholder="e.g. The Khyber Himalayan Resort & Spa"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MEDIA & GALLERY */}
                  {builderTab === 'media' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Hero Banner Image URL *</label>
                        <input
                          type="url"
                          className="form-input"
                          required
                          value={newHolidayForm.heroImage || ''}
                          onChange={e => setNewHolidayForm({ ...newHolidayForm, heroImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      {newHolidayForm.heroImage && (
                        <div style={{ height: 160, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img
                            src={newHolidayForm.heroImage}
                            alt="Hero Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.target as any).style.display = 'none'; }}
                          />
                        </div>
                      )}

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Gallery Images (One URL per line)</label>
                        <textarea
                          className="form-input"
                          rows={4}
                          value={(newHolidayForm.galleryImages || []).join('\n')}
                          onChange={e => setNewHolidayForm({
                            ...newHolidayForm,
                            galleryImages: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                        />
                      </div>

                      {newHolidayForm.galleryImages && newHolidayForm.galleryImages.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
                          {newHolidayForm.galleryImages.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Thumbnail"
                              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }}
                              onError={e => { (e.target as any).style.display = 'none'; }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: HIGHLIGHTS, INCLUSIONS & EXCLUSIONS */}
                  {builderTab === 'inclusions' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Package Highlights (One per line)</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          value={(newHolidayForm.highlights || []).join('\n')}
                          onChange={e => setNewHolidayForm({
                            ...newHolidayForm,
                            highlights: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Luxury Dal Lake Houseboat Stay&#10;Gulmarg Gondola Phase 1 Ticket Included"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Inclusions (One per line)</label>
                        <textarea
                          className="form-input"
                          rows={4}
                          value={(newHolidayForm.inclusions || []).join('\n')}
                          onChange={e => setNewHolidayForm({
                            ...newHolidayForm,
                            inclusions: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Return Airport Transfers in AC Cab&#10;Daily Breakfast & Dinners&#10;Dedicated Tour Driver"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Exclusions (One per line)</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          value={(newHolidayForm.exclusions || []).join('\n')}
                          onChange={e => setNewHolidayForm({
                            ...newHolidayForm,
                            exclusions: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                          })}
                          placeholder="Domestic Airfare&#10;Personal Pony Treks&#10;Travel Insurance"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 5: DAY-BY-DAY ITINERARY BUILDER */}
                  {builderTab === 'itinerary' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>
                            Day Schedules ({(newHolidayForm.days || []).length} Days Total)
                          </h4>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Customize destinations, activities, hotels, and included meals for each day.
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
                          onClick={handleAddDay}
                        >
                          <Plus size={14} /> Add Day
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: 4 }}>
                        {(newHolidayForm.days || []).map((day, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'var(--bg-card-subtle)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 12,
                              padding: '1rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ background: '#d97706', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                                Day {day.dayNumber}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDay(idx)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}
                                title="Delete this day"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                                value={day.dayTitle}
                                onChange={e => handleUpdateDay(idx, { dayTitle: e.target.value })}
                                placeholder="Day Title (e.g. Arrival in Srinagar & Sunset Shikara)"
                              />
                              <input
                                type="text"
                                className="form-input"
                                style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                                value={day.destination || ''}
                                onChange={e => handleUpdateDay(idx, { destination: e.target.value })}
                                placeholder="Destination City"
                              />
                            </div>

                            {/* Scheduled Activity */}
                            <div style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ fontSize: '0.8rem', padding: '3px 6px' }}
                                  value={day.currentActivity?.title || ''}
                                  onChange={e => handleUpdateDay(idx, {
                                    currentActivity: { ...day.currentActivity, title: e.target.value }
                                  })}
                                  placeholder="Primary Activity Title"
                                />
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ fontSize: '0.8rem', padding: '3px 6px' }}
                                  value={day.currentActivity?.duration || ''}
                                  onChange={e => handleUpdateDay(idx, {
                                    currentActivity: { ...day.currentActivity, duration: e.target.value }
                                  })}
                                  placeholder="Duration (e.g. 3 Hours)"
                                />
                              </div>
                              <input
                                type="text"
                                className="form-input"
                                style={{ fontSize: '0.78rem', padding: '3px 6px' }}
                                value={day.currentActivity?.description || ''}
                                onChange={e => handleUpdateDay(idx, {
                                  currentActivity: { ...day.currentActivity, description: e.target.value }
                                })}
                                placeholder="Brief activity description..."
                              />
                            </div>

                            {/* Hotel & Meals Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ fontSize: '0.8rem', padding: '3px 6px' }}
                                value={day.hotelName || ''}
                                onChange={e => handleUpdateDay(idx, { hotelName: e.target.value })}
                                placeholder="Hotel / Stay Name"
                              />
                              <div style={{ display: 'flex', gap: 8, fontSize: '0.75rem' }}>
                                {['Breakfast', 'Lunch', 'Dinner'].map(meal => {
                                  const meals = day.mealsIncluded || [];
                                  const checked = meals.includes(meal);
                                  return (
                                    <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={e => {
                                          const nextMeals = e.target.checked
                                            ? [...meals, meal]
                                            : meals.filter(m => m !== meal);
                                          handleUpdateDay(idx, { mealsIncluded: nextMeals });
                                        }}
                                        style={{ accentColor: '#d97706' }}
                                      />
                                      {meal.slice(0, 1)}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modal Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddHolidayModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 800, padding: '0.6rem 1.5rem' }}
                    >
                      {editingPackageId ? 'Save Package Changes' : 'Publish & Save Package'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 6: Customer Inquiries & CRM */}
      {activeAdminTab === 'leads' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', margin: 0 }}>
                Customer Inquiry Pipeline & CRM
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Inquiries captured from the Chatbot, Customize Trip AI, and Direct Inquiries.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Customer</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Contact</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Service & Vertical</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Estimated Value</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Pipeline Status</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-heading)' }}>
                      {lead.clientName}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Source: {lead.source}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--brand-blue)' }}>{lead.clientPhone}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.clientEmail}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-card-subtle)' }}>
                        {lead.vertical}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800 }}>
                      {formatPrice(lead.estimatedValue)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={lead.pipelineStatus}
                        onChange={e => updateLeadPipeline(lead.id, e.target.value as any)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Booking Confirmed">Booking Confirmed</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <a
                        href={`https://wa.me/${lead.clientPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.clientName)}%2C%20following%20up%20on%20your%20TravelPulse%20inquiry%21`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: '#25D366', color: '#fff', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
