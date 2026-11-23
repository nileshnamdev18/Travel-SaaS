import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HolidayPackage, ActivityOption, HolidayDestinationType, HolidayTheme } from '../../types';
import {
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Star,
  MapPin,
  Calendar,
  Users,
  Building2,
  Clock,
  Sparkles,
  Plane,
  Camera,
  Utensils,
  UserCheck,
  PhoneCall,
  Check,
  X,
  Repeat,
  Compass,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Award,
  Layers,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { packagesApi, bookingsApi, paymentsApi } from '../../services/apiClient';
import { holidayBackend } from '../../services/holidayService';
import { useToast } from '../Toast';

export const HolidaysModule: React.FC = () => {
  const toast = useToast();
  const {
    formatPrice,
    holidayPackages,
    adminHolidayConfig,
    createHolidayBooking,
    holidayBookings
  } = useApp();

  // Navigation State
  const [selectedPackage, setSelectedPackage] = useState<HolidayPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'tracker'>('packages');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search popup on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Live Matching Search Packages for dropdown
  const matchingSearchPackages = searchQuery.trim()
    ? holidayPackages.filter(pkg =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.region && pkg.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pkg.highlights && pkg.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];
  const [destTypeFilter, setDestTypeFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [tourCategoryFilter, setTourCategoryFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<HolidayTheme>('all');
  const [selectedDepartureCity, setSelectedDepartureCity] = useState('Mumbai');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'duration'>('recommended');

  // PDP Active Section & Active Day in Timeline
  const [pdpActiveTab, setPdpActiveTab] = useState<'itinerary' | 'inclusions' | 'summary' | 'highlights'>('itinerary');
  const [pdpActiveDay, setPdpActiveDay] = useState<number>(1);
  const [swappingDay, setSwappingDay] = useState<number | null>(null);
  const [activitySwaps, setActivitySwaps] = useState<Array<{ dayNumber: number; chosenActivityId: string; chosenActivityTitle: string; priceDelta: number }>>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [serverSearchResults, setServerSearchResults] = useState<HolidayPackage[] | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [catalogPage, setCatalogPage] = useState(1);
  const PAGE_SIZE = 9;
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [departures, setDepartures] = useState<any[]>([]);
  const [selectedDepartureIdx, setSelectedDepartureIdx] = useState<number>(-1);

  // PDP Slide-Over Booking Calculator Drawer
  const [isCalculatorDrawerOpen, setIsCalculatorDrawerOpen] = useState(false);
  const [drawerDepartureCity, setDrawerDepartureCity] = useState('Mumbai');
  const [drawerTravelDate, setDrawerTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [drawerAdults, setDrawerAdults] = useState(2);
  const [drawerChildren, setDrawerChildren] = useState(0);
  const [drawerCustomerName, setDrawerCustomerName] = useState('');
  const [drawerCustomerEmail, setDrawerCustomerEmail] = useState('');
  const [drawerCustomerPhone, setDrawerCustomerPhone] = useState('');
  const [drawerHotelTier, setDrawerHotelTier] = useState<'Comfort' | 'Superior' | 'Luxury 5-Star'>('Superior');

  // PDP "Want us to call you?" Quick Lead State
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackEmail, setCallbackEmail] = useState('');
  const [callbackConsent, setCallbackConsent] = useState(true);
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // Booking Confirmation State
  const [bookingSuccessRef, setBookingSuccessRef] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) { setServerSearchResults(null); return; }
    const t = setTimeout(() => {
      const params: any = { search: searchQuery.trim(), limit: 50 };
      if (destTypeFilter !== 'all') params.destinationType = destTypeFilter;
      if (themeFilter !== 'all') params.theme = themeFilter;
      packagesApi.list(params).then(res => {
        if (res.success) {
          const mapped = (res.data || []).map((p: any) => ({ ...p, id: p._id || p.id, sellingPrice: p.sellingPrice }));
          setServerSearchResults(mapped as any);
        }
      }).catch(() => setServerSearchResults(null));
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery, destTypeFilter, themeFilter]);

  useEffect(() => {
    if (holidayPackages.length > 0) { setCatalogLoading(false); setCatalogError(false); }
  }, [holidayPackages.length]);

  useEffect(() => { setCatalogPage(1); }, [searchQuery, destTypeFilter, themeFilter, tourCategoryFilter, sortBy]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (holidayPackages.length === 0) { setCatalogLoading(false); setCatalogError(true); }
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setActivitySwaps([]);
    setReviews([]);
    setDepartures([]);
    setSelectedDepartureIdx(-1);
    if (selectedPackage?.id) {
      packagesApi.getById(selectedPackage.id).then(res => {
        if (res.success && res.data) {
          const p: any = res.data;
          setSelectedPackage(prev => prev ? { ...prev, ...p, id: p._id || p.id, sellingPrice: p.sellingPrice } as any : prev);
        }
      }).catch(() => {});
      // fetch reviews
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/packages/${selectedPackage.id}/reviews`)
        .then(r => r.json()).then(d => { if (d.success) setReviews(d.data || []); }).catch(() => {});
      // fetch departures
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/packages/${selectedPackage.id}/departures`)
        .then(r => r.json()).then(d => { if (d.success) setDepartures(d.data || []); }).catch(() => {});
    }
  }, [selectedPackage?.id]);

  // Tracking lookup state
  const [trackRefInput, setTrackRefInput] = useState('');
  const [trackLookupResult, setTrackLookupResult] = useState<any | null | 'not_found'>(null);

  // Quick Popular Search Tiles — built from admin config (dynamic)
  const featuredDests = adminHolidayConfig.featuredDestinations || [];
  const popularInternational = featuredDests
    .filter(d => {
      const name = typeof d === 'string' ? d : d.name;
      return ['europe', 'dubai', 'vietnam', 'thailand', 'bali', 'singapore', 'japan', 'maldives'].includes(name.toLowerCase());
    })
    .slice(0, 4)
    .map(d => typeof d === 'string' ? { name: d, img: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80` } : { name: d.name, img: d.imageUrl });

  const popularDomestic = featuredDests
    .filter(d => {
      const name = typeof d === 'string' ? d : d.name;
      return ['kashmir', 'kerala', 'ladakh', 'himachal', 'goa', 'rajasthan', 'uttarakhand'].includes(name.toLowerCase());
    })
    .slice(0, 4)
    .map(d => typeof d === 'string' ? { name: d, img: `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80` } : { name: d.name, img: d.imageUrl });

  // If not enough filtered, fill with any remaining
  const allAsInternat = featuredDests.slice(0, 4).map(d => typeof d === 'string' ? { name: d, img: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80` } : { name: d.name, img: d.imageUrl });
  const allAsDomestic = featuredDests.slice(4, 8).map(d => typeof d === 'string' ? { name: d, img: `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80` } : { name: d.name, img: d.imageUrl });
  const finalInternational = popularInternational.length >= 2 ? popularInternational : allAsInternat;
  const finalDomestic = popularDomestic.length >= 2 ? popularDomestic : allAsDomestic;

  const getPackageSellingPrice = (pkg: HolidayPackage) => {
    if ((pkg as any).sellingPrice) return (pkg as any).sellingPrice as number;
    const markup = adminHolidayConfig.partnerMarkupPercent || 15;
    const discount = (pkg as any).discountPercent || 0;
    return Math.round(pkg.basePrice * (1 + markup / 100) * (1 - discount / 100));
  };

  const getStrikethroughPrice = (sellingPrice: number, discountPct: number = 8) => {
    return Math.round(sellingPrice * (1 + discountPct / 100));
  };

  const calculateDrawerTotalPrice = (pkg: HolidayPackage) => {
    let baseSelling = getPackageSellingPrice(pkg);
    if (selectedDepartureIdx >= 0 && departures[selectedDepartureIdx]?.priceOverride) {
      baseSelling = departures[selectedDepartureIdx].priceOverride;
    }
    const comfortMult = adminHolidayConfig.hotelTierMultiplierComfort ?? 0.9;
    const superiorMult = adminHolidayConfig.hotelTierMultiplierSuperior ?? 1.0;
    const luxuryMult = adminHolidayConfig.hotelTierMultiplierLuxury ?? 1.35;
    const tierMultiplier = drawerHotelTier === 'Comfort' ? comfortMult : drawerHotelTier === 'Luxury 5-Star' ? luxuryMult : superiorMult;
    const adultCost = Math.round(baseSelling * tierMultiplier) * drawerAdults;
    const childCost = Math.round(baseSelling * tierMultiplier * 0.6) * drawerChildren;
    let total = adultCost + childCost;
    if (drawerAdults >= 4 && adminHolidayConfig.groupDiscountPercent > 0) {
      total = Math.round(total * (1 - adminHolidayConfig.groupDiscountPercent / 100));
    }
    return total;
  };

  // Filter & Sort Logic
  const basePackages = serverSearchResults ? serverSearchResults : holidayPackages;
  const filteredPackages = basePackages
    .filter(pkg => {
      const matchSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.region && pkg.region.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDestType = destTypeFilter === 'all' || pkg.destinationType === destTypeFilter;
      const matchCategory =
        tourCategoryFilter === 'all' ||
        (tourCategoryFilter === 'group' && pkg.category === 'Group Tour') ||
        (tourCategoryFilter === 'customised' && pkg.category === 'Customized') ||
        (tourCategoryFilter === 'recommended' && pkg.isBestSeller) ||
        (tourCategoryFilter === 'trending' && pkg.isTrending);

      const matchTheme = themeFilter === 'all' || pkg.theme === themeFilter;

      return matchSearch && matchDestType && matchCategory && matchTheme;
    })
    .sort((a, b) => {
      const priceA = getPackageSellingPrice(a);
      const priceB = getPackageSellingPrice(b);
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'duration') return a.durationDays - b.durationDays;
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });

  // Handle Activity Swap
  const handleSwapActivity = (dayNumber: number, newActivity: ActivityOption) => {
    if (!selectedPackage) return;
    const updatedDays = selectedPackage.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return { ...day, currentActivity: newActivity };
      }
      return day;
    });

    const newBasePrice = selectedPackage.basePrice + newActivity.priceDelta;
    setSelectedPackage({
      ...selectedPackage,
      days: updatedDays,
      basePrice: newBasePrice
    });
    setActivitySwaps(prev => {
      const filtered = prev.filter(s => s.dayNumber !== dayNumber);
      return [...filtered, { dayNumber, chosenActivityId: newActivity.id || '', chosenActivityTitle: newActivity.title, priceDelta: newActivity.priceDelta }];
    });
    setSwappingDay(null);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  // Handle Instant Booking from Drawer
  const handleCompleteDrawerBooking = async () => {
    if (!selectedPackage) return;
    if (!drawerTravelDate) { toast.show('Please select a travel date.', 'error'); return; }
    if (!drawerCustomerName.trim()) { toast.show('Please enter your name.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(drawerCustomerEmail)) { toast.show('Please enter a valid email.', 'error'); return; }
    const phoneClean = (drawerCustomerPhone || '').replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) { toast.show('Please enter a valid mobile number.', 'error'); return; }
    const totalAmount = calculateDrawerTotalPrice(selectedPackage);
    const wholesale = Math.round(selectedPackage.wholesaleCost * drawerAdults);
    const markupAmount = Math.max(0, totalAmount - wholesale);

    const tierMap: Record<string, 'standard' | 'deluxe' | 'luxury'> = { 'Comfort': 'standard', 'Superior': 'deluxe', 'Luxury 5-Star': 'luxury' };
    const customerName = drawerCustomerName.trim() || 'Guest Traveler';
    const customerEmail = drawerCustomerEmail.trim() || callbackEmail || 'customer@gmail.com';
    const customerPhone = drawerCustomerPhone || callbackPhone || '+91 98201 44521';

    let ref = '';
    let backendId = '';
    try {
      const res = await bookingsApi.create({
        packageId: selectedPackage.id,
        customerPhone,
        customerName,
        customerEmail,
        travelDateFrom: drawerTravelDate,
        adults: drawerAdults,
        children: drawerChildren,
        departureCitySelected: drawerDepartureCity,
        hotelTierSelected: tierMap[drawerHotelTier] || 'deluxe',
        activitySwaps: activitySwaps.map(s => ({ dayNumber: s.dayNumber, chosenActivityId: s.chosenActivityId, chosenActivityTitle: s.chosenActivityTitle, priceDelta: s.priceDelta })),
        specialRequests: `Inquiry via TravelPulse Online Desk. Tier: ${drawerHotelTier}, Departure Hub: Ex-${drawerDepartureCity}`
      });
      if (res.success && res.data) { ref = res.data.bookingRef; backendId = res.data._id; }
    } catch { /* offline fallback */ }

    const newBooking = createHolidayBooking({
      packageId: selectedPackage.id,
      packageTitle: selectedPackage.title,
      destination: selectedPackage.destination,
      destinationType: selectedPackage.destinationType || 'domestic',
      customerName,
      customerEmail,
      customerPhone,
      departureCity: drawerDepartureCity,
      travelDate: drawerTravelDate,
      paxAdults: drawerAdults,
      paxChildren: drawerChildren,
      selectedHotelTier: drawerHotelTier,
      totalAmountUSD: totalAmount,
      wholesaleCostUSD: wholesale,
      markupAmountUSD: markupAmount,
      status: 'inquiry_received',
      activitySwaps: activitySwaps,
      customNotes: `Inquiry via TravelPulse Online Desk. Tier: ${drawerHotelTier}, Departure Hub: Ex-${drawerDepartureCity}`
    });

    if (ref) {
      const bookings = holidayBackend.getBookings();
      const updated = bookings.map(b => b.id === newBooking.id ? { ...b, bookingReference: ref, id: backendId || b.id } : b);
      holidayBackend.saveBookings(updated);
    }

    setBookingSuccessRef(ref || newBooking.bookingReference);
    setIsCalculatorDrawerOpen(false);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  };

  // Handle Quick Callback Request
  const handleRequestCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneClean = callbackPhone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) { toast.show('Please enter a valid mobile number.', 'error'); return; }
    if (callbackEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(callbackEmail)) { toast.show('Please enter a valid email.', 'error'); return; }
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Callback Request', phone: callbackPhone, email: callbackEmail, source: 'callback', vertical: 'Holidays', packageId: selectedPackage?.id, packageTitle: selectedPackage?.title })
      });
    } catch { /* offline */ }
    setCallbackSuccess(true);
    setTimeout(() => setCallbackSuccess(false), 4000);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
  };

  // WhatsApp Inquiry Generator
  const handleWhatsAppInquiry = () => {
    if (!selectedPackage) return;
    const sellingPrice = getPackageSellingPrice(selectedPackage);
    const text = encodeURIComponent(
      `Hello TravelPulse Holidays! I am inquiring about:\n` +
      `Package: ${selectedPackage.title}\n` +
      `Destination: ${selectedPackage.destination}\n` +
      `Duration: ${selectedPackage.durationDays}D / ${selectedPackage.durationNights || selectedPackage.durationDays - 1}N\n` +
      `Starting Price: USD ${sellingPrice} per adult\n` +
      `Please connect me with a holiday specialist.`
    );
    const phone = adminHolidayConfig.whatsappInquiryNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Official Itinerary PDF Brochure Generator (jsPDF)
  const handleDownloadItineraryPDF = () => {
    if (!selectedPackage) return;
    const doc = new jsPDF();
    const sellingPrice = getPackageSellingPrice(selectedPackage);

    // Header banner with TravelPulse signature navy (#0F4CA4) & yellow strip
    doc.setFillColor(15, 76, 164);
    doc.rect(0, 0, 210, 38, 'F');
    doc.setFillColor(254, 233, 0);
    doc.rect(0, 38, 210, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TravelPulse INDIA — OFFICIAL TOUR BROCHURE', 14, 18);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `India's Most Trusted Travel Brand Since 1881 | Toll-Free: ${adminHolidayConfig.supportHelpline} | Departure Hub: Ex-${selectedDepartureCity}`,
      14,
      28
    );

    // Title & Specs
    doc.setTextColor(36, 38, 45);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedPackage.title, 14, 52);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(86, 94, 115);
    doc.text(
      `Destination: ${selectedPackage.destination} | Duration: ${selectedPackage.durationDays} Days / ${selectedPackage.durationNights || selectedPackage.durationDays - 1} Nights | Starting from USD ${sellingPrice} per adult`,
      14,
      60
    );

    doc.setDrawColor(215, 218, 224);
    doc.line(14, 66, 196, 66);

    // Highlights
    doc.setTextColor(15, 76, 164);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PACKAGE HIGHLIGHTS', 14, 75);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(36, 38, 45);
    let yPos = 82;
    selectedPackage.highlights.forEach(h => {
      doc.text(`• ${h}`, 16, yPos);
      yPos += 5.5;
    });

    // Day-by-day Itinerary
    yPos += 4;
    doc.setTextColor(15, 76, 164);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('DAY-BY-DAY CURATED ITINERARY', 14, yPos);
    yPos += 7;

    selectedPackage.days.forEach(day => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 76, 164);
      doc.text(`Day ${day.dayNumber}: ${day.dayTitle} (${day.destination})`, 14, yPos);
      yPos += 5;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(86, 94, 115);
      doc.text(`Activity: ${day.currentActivity.title} (${day.currentActivity.duration})`, 18, yPos);
      yPos += 4.5;
      doc.text(`Stay: ${day.hotelName} [${day.hotelTier}]`, 18, yPos);
      yPos += 6.5;
    });

    // Inclusions
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    doc.setTextColor(15, 76, 164);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TravelPulse INCLUSIONS & AMENITIES', 14, yPos);
    yPos += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(36, 38, 45);
    const incs = selectedPackage.inclusions || [
      'Accommodation in verified quality hotels',
      'Daily breakfast & select dinners as per itinerary',
      'All transfers & sightseeing in comfortable AC vehicles',
      'Dedicated TravelPulse Tour Manager & local guides'
    ];
    incs.forEach(inc => {
      doc.text(`✓ ${inc}`, 16, yPos);
      yPos += 5;
    });

    // Footer
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Official TravelPulse India Tour Package. Itinerary subject to local weather and flight schedules.', 14, 285);

    doc.save(`TravelPulse_Itinerary_${selectedPackage.id}.pdf`);
  };

  // Lookup existing booking (backend first, local fallback)
  const handleTrackLookup = async () => {
    const ref = trackRefInput.trim();
    if (!ref) return;
    try {
      const res = await (await import('../../services/apiClient')).bookingsApi.track(ref);
      const b: any = res.data;
      const mapped = {
        id: b._id || b.id,
        bookingReference: b.bookingRef || b.bookingReference,
        packageTitle: b.packageTitle,
        destination: b.packageDestination || b.destination,
        customerName: b.customerName,
        travelDate: b.travelDateFrom ? new Date(b.travelDateFrom).toISOString().split('T')[0] : b.travelDate,
        departureCity: b.departureCitySelected || b.departureCity,
        totalAmountUSD: b.totalAmountUSD,
        status: b.status,
        paxAdults: b.adults ?? b.paxAdults,
        paxChildren: b.children ?? b.paxChildren,
        selectedHotelTier: b.hotelTierSelected || b.selectedHotelTier
      };
      setTrackLookupResult(mapped);
      return;
    } catch {
      // fall through to local
    }
    const found = holidayBookings.find(
      b => b.bookingReference.toLowerCase() === ref.toLowerCase() || b.id.toLowerCase() === ref.toLowerCase()
    );
    setTrackLookupResult(found || 'not_found');
  };

  // ===========================================================================
  // RENDER VIEW: DETAILED PACKAGE PAGE (PDP)
  // ===========================================================================
  if (selectedPackage) {
    const sellingPrice = getPackageSellingPrice(selectedPackage);
    const strikethroughPrice = getStrikethroughPrice(sellingPrice, selectedPackage.discountPercent || 8);
    const drawerTotal = calculateDrawerTotalPrice(selectedPackage);
    const drawerTierMult = drawerHotelTier === 'Comfort' ? (adminHolidayConfig.hotelTierMultiplierComfort ?? 0.9) : drawerHotelTier === 'Luxury 5-Star' ? (adminHolidayConfig.hotelTierMultiplierLuxury ?? 1.35) : (adminHolidayConfig.hotelTierMultiplierSuperior ?? 1.0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-tc-primary)' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: '0.82rem', color: '#565E73' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => {
                setSelectedPackage(null);
                setBookingSuccessRef(null);
              }}
              style={{ background: 'none', border: 'none', color: '#0F4CA4', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
            >
              <ChevronLeft size={16} /> Holidays
            </button>
            <span>/</span>
            <span>{selectedPackage.destinationType === 'domestic' ? 'India Tour Packages' : 'International Packages'}</span>
            <span>/</span>
            <span style={{ color: '#24262D', fontWeight: 600 }}>{selectedPackage.title}</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-sm btn-secondary"
              style={{ borderRadius: 100, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={handleDownloadItineraryPDF}
            >
              <Download size={13} /> Download Brochure PDF
            </button>
            <button
              className="btn btn-sm btn-secondary"
              style={{ borderRadius: 100, fontSize: '0.78rem', color: '#198754', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={handleWhatsAppInquiry}
            >
              <MessageSquare size={13} /> WhatsApp Share
            </button>
          </div>
        </div>

        {/* Success Confirmation Banner */}
        {bookingSuccessRef && (
          <div
            style={{
              background: 'linear-gradient(135deg, #0F4CA4 0%, #0A3778 100%)',
              border: '2px solid #FEE900',
              borderRadius: 16,
              padding: '1.75rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(15, 76, 164, 0.25)'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEE900', color: '#0F4CA4', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, marginBottom: 6 }}>
                <CheckCircle2 size={14} /> TravelPulse HOLIDAY CONFIRMED
              </div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                Booking Reference: <span style={{ color: '#FEE900' }}>{bookingSuccessRef}</span>
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#E2E8F0' }}>
                Your package reservation has been confirmed. Our tour specialist will contact you with your flight schedule & custom vouchers.
              </p>
            </div>
            <button
              className="btn btn-sm"
              style={{ background: '#FEE900', color: '#0F4CA4', fontWeight: 800, borderRadius: 100, border: 'none', padding: '0.5rem 1.25rem' }}
              onClick={handleDownloadItineraryPDF}
            >
              <Download size={14} /> Download Voucher PDF
            </button>
            <button
              className="btn btn-sm"
              style={{ background: '#198754', color: '#fff', fontWeight: 800, borderRadius: 100, border: 'none', padding: '0.5rem 1.25rem' }}
              onClick={async () => {
                try {
                  const tr = await bookingsApi.track(bookingSuccessRef!);
                  const bid = (tr.data as any)._id || (tr.data as any).id;
                  const order = await paymentsApi.createOrder(bid);
                  const data = order.data;
                  if (data.key === 'mock' || !data.key) {
                    await paymentsApi.verify(bid);
                    toast.show('Payment successful (dev mode)! Booking confirmed.', 'success');
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
                    return;
                  }
                  // Load Razorpay checkout script
                  await new Promise<void>((resolve, reject) => {
                    if ((window as any).Razorpay) return resolve();
                    const s = document.createElement('script');
                    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    s.onload = () => resolve();
                    s.onerror = () => reject(new Error('Failed to load Razorpay'));
                    document.body.appendChild(s);
                  });
                  const rzp = new (window as any).Razorpay({
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    order_id: data.orderId,
                    handler: async () => {
                      await paymentsApi.verify(bid);
                      toast.show('Payment successful! Booking confirmed.', 'success');
                      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
                    }
                  });
                  rzp.open();
                } catch (e: any) {
                  toast.show(e?.message || 'Payment failed', 'error');
                }
              }}
            >
              Pay Now
            </button>
          </div>
        )}

        {/* Top Gallery & Quick Overview Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          
          {/* Multi-Photo Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, height: 380, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', position: 'relative' }}>
              <img
                src={selectedPackage.heroImage}
                alt={selectedPackage.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                <span style={{ background: '#0F4CA4', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  RECOMMENDED
                </span>
                <span style={{ background: '#FF7700', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  {selectedPackage.destinationType === 'domestic' ? '🇮🇳 India & Around' : '🌍 International'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
              {(selectedPackage.galleryImages || [
                'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1582650625119-3a31f841839d?auto=format&fit=crop&w=400&q=80'
              ]).slice(0, 2).map((img, i) => (
                <div key={i} style={{ flex: 1, overflow: 'hidden' }}>
                  <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Header Information Card */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 16, border: '0.8px solid #EDEEF1' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#EFF8FF', color: '#0F4CA4', fontWeight: 800, fontSize: '0.8rem', padding: '3px 10px', borderRadius: 20 }}>
                  {selectedPackage.durationNights || selectedPackage.durationDays - 1}N / {selectedPackage.durationDays}D
                </span>
                <span style={{ background: '#F6F7F9', color: '#565E73', fontWeight: 600, fontSize: '0.75rem', padding: '3px 10px', borderRadius: 20 }}>
                  {selectedPackage.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.8rem', color: '#FF7700', fontWeight: 700 }}>
                  <Star size={14} fill="#FF7700" color="#FF7700" /> {selectedPackage.rating || 4.5} ({selectedPackage.reviewCount || 0} Reviews)
                </span>
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#24262D', margin: '0 0 0.75rem', lineHeight: 1.3 }}>
                {selectedPackage.title}
              </h1>

              {/* Route chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {selectedPackage.days.map((d, i) => (
                  <span key={i} style={{ background: '#F6F7F9', color: '#24262D', fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>
                    1N {d.destination}
                  </span>
                ))}
              </div>

              {/* 5 Inclusions Icons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, textAlign: 'center', borderTop: '1px solid #EDEEF1', borderBottom: '1px solid #EDEEF1', padding: '1rem 0', marginBottom: '1.25rem' }}>
                {[
                  { icon: <Plane size={18} color="#0F4CA4" />, label: 'Flights' },
                  { icon: <Building2 size={18} color="#0F4CA4" />, label: 'Hotels' },
                  { icon: <Camera size={18} color="#0F4CA4" />, label: 'Sightseeing' },
                  { icon: <Utensils size={18} color="#0F4CA4" />, label: 'Meals' },
                  { icon: <UserCheck size={18} color="#0F4CA4" />, label: 'Tour Guide' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    {item.icon}
                    <span style={{ fontSize: '0.72rem', color: '#565E73', fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '0.85rem', color: '#667085', textDecoration: 'line-through' }}>
                    {formatPrice(strikethroughPrice)}
                  </span>
                  <span style={{ background: 'rgba(25, 135, 84, 0.1)', color: '#198754', fontWeight: 800, fontSize: '0.75rem', padding: '2px 6px', borderRadius: 4 }}>
                    {selectedPackage.discountPercent || 8}% OFF
                  </span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F4CA4', lineHeight: 1.1 }}>
                  {formatPrice(sellingPrice)}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#667085' }}>Starting price per adult</div>
              </div>

              <button
                className="btn btn-primary"
                style={{ background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, padding: '0.75rem 1.75rem', fontWeight: 800, fontSize: '0.9rem' }}
                onClick={() => setIsCalculatorDrawerOpen(true)}
              >
                Calculate Price & Book
              </button>
            </div>
          </div>

        </div>

        {/* Sticky Anchor Navigation Bar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EDEEF1', borderRadius: 100, padding: '0.4rem 0.75rem', display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' }}>
          {[
            { key: 'itinerary', label: 'Itinerary' },
            { key: 'inclusions', label: 'Inclusions & Exclusions' },
            { key: 'highlights', label: 'Highlights' },
            { key: 'summary', label: 'Overview & Assurance' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setPdpActiveTab(tab.key as any)}
              style={{
                background: pdpActiveTab === tab.key ? '#0F4CA4' : 'transparent',
                color: pdpActiveTab === tab.key ? '#FFFFFF' : '#565E73',
                border: 'none',
                borderRadius: 100,
                padding: '0.45rem 1.25rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PDP Main Content & Sticky Booking Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: Itinerary / Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* ITINERARY TAB (Dual-Rail Timeline) */}
            {pdpActiveTab === 'itinerary' && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#24262D', margin: '0 0 4px' }}>
                    Day-by-Day Curated Itinerary
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#565E73', margin: 0 }}>
                    Modular daily breakdown. You can swap activities to upgrade your holiday experience.
                  </p>
                </div>

                {/* Day Buttons Horizontal Selector */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: '1rem' }}>
                  {selectedPackage.days.map(d => (
                    <button
                      key={d.dayNumber}
                      onClick={() => setPdpActiveDay(d.dayNumber)}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: 100,
                        border: pdpActiveDay === d.dayNumber ? '2px solid #0F4CA4' : '1px solid #D7DAE0',
                        background: pdpActiveDay === d.dayNumber ? '#EFF8FF' : '#FFFFFF',
                        color: pdpActiveDay === d.dayNumber ? '#0F4CA4' : '#24262D',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Day {d.dayNumber}
                    </button>
                  ))}
                </div>

                {/* Accordion Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedPackage.days.map(day => (
                    <div
                      key={day.dayNumber}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        borderRadius: 16,
                        border: pdpActiveDay === day.dayNumber ? '1.5px solid #0F4CA4' : '1px solid #EDEEF1',
                        boxShadow: pdpActiveDay === day.dayNumber ? '0 8px 20px rgba(15, 76, 164, 0.08)' : 'none'
                      }}
                    >
                      {/* Day Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ background: '#0F4CA4', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                            Day {day.dayNumber}
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#24262D' }}>
                            {day.dayTitle}
                          </h4>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#565E73', fontWeight: 600 }}>
                          📍 {day.destination}
                        </span>
                      </div>

                      {/* Scheduled Activity Box */}
                      <div style={{ display: 'flex', gap: '1rem', background: '#F6F7F9', padding: '1rem', borderRadius: 12, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <img
                          src={day.currentActivity.image}
                          alt={day.currentActivity.title}
                          style={{ width: 85, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#24262D' }}>
                              {day.currentActivity.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F4CA4', background: '#EFF8FF', padding: '2px 6px', borderRadius: 4 }}>
                              {day.currentActivity.duration}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#565E73', margin: '0 0 6px', lineHeight: 1.4 }}>
                            {day.currentActivity.description}
                          </p>
                          <div style={{ fontSize: '0.72rem', color: '#198754', fontWeight: 700 }}>
                            ✓ Included in package
                          </div>
                        </div>
                      </div>

                      {/* Hotel & Meals Info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#565E73', borderTop: '1px solid #EDEEF1', paddingTop: 8, flexWrap: 'wrap', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Building2 size={13} color="#0F4CA4" />
                          <span>Stay: <strong style={{ color: '#24262D' }}>{day.hotelName}</strong> ({day.hotelTier})</span>
                        </div>
                        {day.mealsIncluded && (
                          <div>
                            Meals: <strong style={{ color: '#198754' }}>{day.mealsIncluded.join(' • ')}</strong>
                          </div>
                        )}
                      </div>

                      {/* Modular Activity Swap Feature */}
                      {day.alternativeActivities && day.alternativeActivities.length > 0 && (
                        <div style={{ marginTop: '0.75rem', borderTop: '1px dashed #D7DAE0', paddingTop: '0.75rem' }}>
                          {swappingDay === day.dayNumber ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F4CA4' }}>
                                Swap with an Alternative Excursion for Day {day.dayNumber}:
                              </div>
                              {day.alternativeActivities.map(alt => (
                                <div
                                  key={alt.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: 8,
                                    background: '#FFFFFF',
                                    border: '1px solid #D7DAE0',
                                    fontSize: '0.82rem',
                                    gap: 8,
                                    flexWrap: 'wrap'
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 700, color: '#24262D' }}>{alt.title}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#565E73' }}>{alt.duration} • {alt.description}</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontWeight: 800, color: '#0F4CA4' }}>
                                      +${alt.priceDelta}
                                    </span>
                                    <button
                                      className="btn btn-sm btn-primary"
                                      style={{ background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, padding: '3px 10px', fontSize: '0.75rem' }}
                                      onClick={() => handleSwapActivity(day.dayNumber, alt)}
                                    >
                                      Swap Now
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                className="btn btn-sm btn-secondary"
                                style={{ alignSelf: 'flex-start', fontSize: '0.75rem', borderRadius: 100, marginTop: 4 }}
                                onClick={() => setSwappingDay(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#0F4CA4', borderRadius: 100 }}
                              onClick={() => setSwappingDay(day.dayNumber)}
                            >
                              <Repeat size={13} /> Customize / Upgrade Activity ({day.alternativeActivities.length} available)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCLUSIONS & EXCLUSIONS TAB */}
            {pdpActiveTab === 'inclusions' && (
              <div className="card" style={{ padding: '1.75rem', borderRadius: 16 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#24262D', margin: '0 0 1.25rem' }}>
                  Inclusions & Exclusions
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#198754', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={16} /> What is Included
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#24262D', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(selectedPackage.inclusions || [
                        'Economy return flight tickets (if booked with flights)',
                        'Handpicked 4-star and luxury resort accommodations',
                        'Daily buffet breakfasts and authentic regional dinners',
                        'All transfers and sightseeing in comfortable private AC vehicles',
                        'Entry permits and tickets for all scheduled attractions',
                        'Dedicated TravelPulse Tour Manager & local guides'
                      ]).map((inc, idx) => (
                        <li key={idx}>{inc}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FF7700', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <X size={16} /> What is Excluded
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#565E73', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(selectedPackage.exclusions || [
                        'Personal expenses like telephone bills, laundry, alcoholic drinks',
                        'Mandatory city taxes where applicable',
                        'Optional extreme sports and activities outside itinerary',
                        'Gratuities, tips, and camera/video permits at monuments'
                      ]).map((exc, idx) => (
                        <li key={idx}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* HIGHLIGHTS TAB */}
            {pdpActiveTab === 'highlights' && (
              <div className="card" style={{ padding: '1.75rem', borderRadius: 16 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#24262D', margin: '0 0 1.25rem' }}>
                  Tour Highlights
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {selectedPackage.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, background: '#F6F7F9', padding: '1rem', borderRadius: 12 }}>
                      <CheckCircle2 size={18} color="#0F4CA4" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#24262D' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUMMARY & ASSURANCE TAB */}
            {pdpActiveTab === 'summary' && (
              <div className="card" style={{ padding: '1.75rem', borderRadius: 16 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#24262D', margin: '0 0 1rem' }}>
                  TravelPulse Assurance & Policies
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#565E73', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  Over 140 years of trusted travel operations. Every TravelPulse tour includes round-the-clock ground support, sanitized transport, and guaranteed hotel reservations.
                </p>
                <div style={{ background: '#F5FAFF', border: '1px solid #D7DAE0', borderRadius: 12, padding: '1rem', fontSize: '0.82rem', color: '#0F4CA4' }}>
                  🛡️ <strong>Cancellation Policy:</strong> {selectedPackage.cancellationPolicy || 'Free cancellation up to 14 days before departure date.'}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 16 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#24262D', margin: '0 0 1rem' }}>
                Traveler Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 && (
                <p style={{ fontSize: '0.82rem', color: '#565E73' }}>No reviews yet. Be the first to review!</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {reviews.slice(0, 5).map((r: any, i: number) => (
                  <div key={i} style={{ borderBottom: '1px solid #EDEEF1', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#24262D' }}>{r.customerName}</span>
                      <span style={{ color: '#FF7700', fontWeight: 700, fontSize: '0.8rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    {r.comment && <p style={{ fontSize: '0.8rem', color: '#565E73', margin: '4px 0 0' }}>{r.comment}</p>}
                  </div>
                ))}
              </div>
              {/* Submit review (requires login token) */}
              <div style={{ borderTop: '1px solid #EDEEF1', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#24262D' }}>Your rating:</span>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReviewRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: n <= reviewRating ? '#FF7700' : '#D7DAE0', fontSize: '1.1rem' }}>★</button>
                  ))}
                </div>
                <textarea
                  className="form-input"
                  placeholder="Share your experience (optional)"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  style={{ fontSize: '0.82rem', minHeight: 60, marginBottom: 8 }}
                />
                <button
                  className="btn btn-sm btn-primary"
                  style={{ background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, fontSize: '0.78rem' }}
                  onClick={async () => {
                    const token = localStorage.getItem('tp_jwt_token');
                    if (!token) { toast.show('Please log in to submit a review.', 'error'); return; }
                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/packages/${selectedPackage.id}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setReviews(prev => [data.data, ...prev]);
                        setReviewComment('');
                        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
                      } else {
                        toast.show(data.message || 'Failed to submit review', 'error');
                      }
                    } catch { toast.show('Failed to submit review', 'error'); }
                  }}
                >
                  Submit Review
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Booking & Callback Sidebar */}
          <div style={{ position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Primary Price Card */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 16, border: '2px solid #0F4CA4', boxShadow: '0 10px 25px rgba(15, 76, 164, 0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#667085', fontWeight: 700 }}>
                      Starting Price
                    </span>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F4CA4', margin: '2px 0', lineHeight: 1 }}>
                      {formatPrice(sellingPrice)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#565E73' }}>Per adult on twin sharing</div>
                  </div>
                  <span style={{ background: 'rgba(25, 135, 84, 0.1)', color: '#198754', fontWeight: 800, fontSize: '0.78rem', padding: '3px 8px', borderRadius: 4 }}>
                    {selectedPackage.discountPercent || 8}% OFF
                  </span>
                </div>

                <div style={{ background: '#EFF8FF', padding: '0.75rem', borderRadius: 8, fontSize: '0.78rem', color: '#0F4CA4', fontWeight: 600, marginBottom: '1.25rem' }}>
                  🎁 Earn <strong>{Math.round(sellingPrice * (adminHolidayConfig.loyaltyPointsRate ?? 0.05))} TravelPulse Loyalty Points</strong> with this booking
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, padding: '0.85rem', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.75rem' }}
                  onClick={() => setIsCalculatorDrawerOpen(true)}
                >
                  Calculate Price & Configure
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', borderRadius: 100, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#198754' }}
                  onClick={handleWhatsAppInquiry}
                >
                  <MessageSquare size={14} /> Inquire via WhatsApp
                </button>
              </div>

              {/* "Want us to call you?" Lead Capture Card */}
              <div className="card" style={{ padding: '1.5rem', borderRadius: 16, border: '1px solid #EDEEF1' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#24262D', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PhoneCall size={16} color="#0F4CA4" /> Want us to call you?
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#565E73', margin: '0 0 1rem' }}>
                  Leave your details and a TravelPulse travel expert will call you back within 15 minutes.
                </p>

                {callbackSuccess ? (
                  <div style={{ background: 'rgba(25, 135, 84, 0.1)', color: '#198754', padding: '0.75rem', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700 }}>
                    ✓ Callback requested! An expert will call you shortly.
                  </div>
                ) : (
                  <form onSubmit={handleRequestCallback} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="tel"
                        className="form-input"
                        required
                        placeholder="Mobile Number (+91 XXXXX XXXXX)"
                        value={callbackPhone}
                        onChange={e => setCallbackPhone(e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Email ID (Optional)"
                        value={callbackEmail}
                        onChange={e => setCallbackEmail(e.target.value)}
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.7rem', color: '#667085', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={callbackConsent}
                        onChange={e => setCallbackConsent(e.target.checked)}
                        style={{ marginTop: 2 }}
                      />
                      <span>I accept the Privacy Policy and authorize TravelPulse to contact me.</span>
                    </label>
                    <button
                      type="submit"
                      className="btn btn-secondary"
                      style={{ borderRadius: 100, fontWeight: 700, fontSize: '0.82rem', background: '#F6F7F9' }}
                    >
                      Get a Callback
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* SLIDE-OVER "CALCULATE PRICE & BOOK" DRAWER */}
        {isCalculatorDrawerOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: 480,
                height: '100%',
                borderRadius: '16px 0 0 16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflowY: 'auto'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0F4CA4' }}>
                    Configure & Book Package
                  </h3>
                  <button
                    onClick={() => setIsCalculatorDrawerOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <X size={20} color="#565E73" />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Departure Hub */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Departure City</label>
                    <select
                      className="form-select"
                      value={drawerDepartureCity}
                      onChange={e => setDrawerDepartureCity(e.target.value)}
                    >
                      {(selectedPackage.departureCities || ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Kolkata', 'Chennai']).map(city => (
                        <option key={city} value={city}>Ex-{city}</option>
                      ))}
                      <option value="Direct">Joining Direct (Land Only)</option>
                    </select>
                  </div>

                  {/* Travel Date */}
                  {departures.length > 0 && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Departure Date</label>
                      <select
                        className="form-select"
                        value={selectedDepartureIdx}
                        onChange={e => {
                          const idx = Number(e.target.value);
                          setSelectedDepartureIdx(idx);
                          if (idx >= 0 && departures[idx]) {
                            setDrawerTravelDate(new Date(departures[idx].date).toISOString().split('T')[0]);
                          }
                        }}
                      >
                        <option value={-1}>Select a departure</option>
                        {departures.map((d, i) => (
                          <option key={i} value={i} disabled={(d.seatsTotal - d.seatsBooked) <= 0}>
                            {new Date(d.date).toLocaleDateString()} — {Math.max(0, d.seatsTotal - d.seatsBooked)} seats left{d.priceOverride ? ` — USD ${d.priceOverride}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Travel Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={drawerTravelDate}
                      onChange={e => setDrawerTravelDate(e.target.value)}
                    />
                  </div>

                  {/* Customer details */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Full Name *</label>
                    <input className="form-input" required value={drawerCustomerName} onChange={e => setDrawerCustomerName(e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Email *</label>
                    <input type="email" className="form-input" required value={drawerCustomerEmail} onChange={e => setDrawerCustomerEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Mobile Number *</label>
                    <input type="tel" className="form-input" required value={drawerCustomerPhone} onChange={e => setDrawerCustomerPhone(e.target.value)} placeholder="+91 98765 43210" />
                  </div>

                  {/* Hotel Tier */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Hotel Tier Category</label>
                    <select
                      className="form-select"
                      value={drawerHotelTier}
                      onChange={e => setDrawerHotelTier(e.target.value as any)}
                    >
                      <option value="Comfort">Comfort 3-Star (-10% Economical)</option>
                      <option value="Superior">Superior 4-Star (Recommended)</option>
                      <option value="Luxury 5-Star">Luxury 5-Star Heritage (+35%)</option>
                    </select>
                  </div>

                  {/* Traveler Quantity Counter */}
                  <div style={{ background: '#F6F7F9', padding: '1rem', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#24262D' }}>Adults (12+ yrs)</div>
                        <div style={{ fontSize: '0.72rem', color: '#667085' }}>Base rate applied</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ width: 28, height: 28, padding: 0, borderRadius: '50%' }}
                          onClick={() => setDrawerAdults(Math.max(1, drawerAdults - 1))}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: 18, textAlign: 'center' }}>{drawerAdults}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ width: 28, height: 28, padding: 0, borderRadius: '50%' }}
                          onClick={() => setDrawerAdults(drawerAdults + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#24262D' }}>Children (2-11 yrs)</div>
                        <div style={{ fontSize: '0.72rem', color: '#667085' }}>40% child discount</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ width: 28, height: 28, padding: 0, borderRadius: '50%' }}
                          onClick={() => setDrawerChildren(Math.max(0, drawerChildren - 1))}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', minWidth: 18, textAlign: 'center' }}>{drawerChildren}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          style={{ width: 28, height: 28, padding: 0, borderRadius: '50%' }}
                          onClick={() => setDrawerChildren(drawerChildren + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div style={{ borderTop: '1px solid #EDEEF1', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#565E73' }}>
                      <span>Base Price per Adult:</span>
                      <span>{formatPrice(getPackageSellingPrice(selectedPackage))}</span>
                    </div>
                    {drawerAdults >= 4 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#198754', fontWeight: 700 }}>
                        <span>Group Discount (4+ Pax):</span>
                        <span>-{adminHolidayConfig.groupDiscountPercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Section */}
              <div style={{ borderTop: '1px solid #EDEEF1', paddingTop: '1.25rem' }}>
                {/* Price breakdown */}
                <div style={{ fontSize: '0.78rem', color: '#565E73', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Base per adult</span><span>{formatPrice(getPackageSellingPrice(selectedPackage))}</span></div>
                  {selectedDepartureIdx >= 0 && departures[selectedDepartureIdx]?.priceOverride && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Departure override</span><span>{formatPrice(departures[selectedDepartureIdx].priceOverride)}</span></div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Adults x {drawerAdults}</span><span>{formatPrice(Math.round(getPackageSellingPrice(selectedPackage) * drawerTierMult * drawerAdults))}</span></div>
                  {drawerChildren > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Children x {drawerChildren} (60%)</span><span>{formatPrice(Math.round(getPackageSellingPrice(selectedPackage) * drawerTierMult * 0.6 * drawerChildren))}</span></div>}
                  {drawerAdults >= 4 && adminHolidayConfig.groupDiscountPercent > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#198754' }}><span>Group discount</span><span>-{adminHolidayConfig.groupDiscountPercent}%</span></div>}
                  {activitySwaps.length > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Activity upgrades</span><span>+${activitySwaps.reduce((s, a) => s + (a.priceDelta || 0), 0)}</span></div>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.85rem', color: '#667085', fontWeight: 600 }}>Total Package Price:</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F4CA4' }}>
                    {formatPrice(drawerTotal)}
                  </span>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, padding: '0.85rem', fontWeight: 800, fontSize: '1rem' }}
                  onClick={handleCompleteDrawerBooking}
                >
                  Book Online & Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ===========================================================================
  // RENDER VIEW: DISCOVERY & CATALOG LISTING
  // ===========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', fontFamily: 'var(--font-tc-primary)' }}>
      
      {/* Editorial Hero Header with Signature TravelPulse Navy & Yellow */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0F4CA4 0%, #0A3778 60%, #1e293b 100%)',
          borderRadius: 24,
          padding: '3rem 2.5rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'visible', // Must be visible so the search popup floats cleanly above page without clipping!
          zIndex: 40,
          boxShadow: '0 12px 35px rgba(15, 76, 164, 0.25)'
        }}
      >
        <div style={{ maxWidth: 880, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEE900', color: '#0F4CA4', padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            <Award size={14} /> OFFICIAL TravelPulse PARTNER • TRUSTED SINCE 1881
          </div>

          <h1 style={{ fontFamily: 'var(--font-tc-editorial)', fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 1rem', lineHeight: 1.15 }}>
            {adminHolidayConfig.heroHeadline || 'Explore Handcrafted Holidays Across the World'}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#E2E8F0', lineHeight: 1.6, margin: '0 0 2rem', maxWidth: 680 }}>
            {adminHolidayConfig.heroSubheading || 'Discover breathtaking holidays from majestic Kashmir & tropical Kerala to glamorous Dubai & the Swiss Alps. Guaranteed 4★ stays, authentic meals, and customizable day itineraries.'}
          </p>

          {/* 60px Rounded Hero Search Bar */}
          <div ref={searchContainerRef} style={{ position: 'relative', maxWidth: 640 }}>
            <div
              style={{
                height: 60,
                background: '#FFFFFF',
                borderRadius: 60,
                padding: '0.4rem 0.6rem 0.4rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                boxShadow: isSearchPopupOpen ? '0 12px 30px rgba(0, 0, 0, 0.25)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
                border: isSearchPopupOpen ? '2px solid #FEE900' : '2px solid transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1001
              }}
            >
              <Search size={20} color="#0F4CA4" style={{ marginRight: 12, flexShrink: 0 }} />
              <input
                type="text"
                placeholder='Search "Kashmir", "Dubai", "Switzerland", "Bali"...'
                value={searchQuery}
                onFocus={() => setIsSearchPopupOpen(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchPopupOpen(true);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setIsSearchPopupOpen(false);
                    document.getElementById('holiday-packages-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: '0.95rem',
                  color: '#24262D',
                  fontWeight: 500,
                  background: 'transparent'
                }}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }}
                  style={{
                    background: '#EDEEF1',
                    border: 'none',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    cursor: 'pointer',
                    color: '#565E73'
                  }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSearchPopupOpen(false);
                  document.getElementById('holiday-packages-catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: '#0F4CA4',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Search packages"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Popular & Live Search Overlay Popup */}
            {isSearchPopupOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: 0,
                  right: 0,
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)',
                  zIndex: 1000,
                  border: '1px solid #EDEEF1',
                  maxHeight: '460px',
                  overflowY: 'auto'
                }}
              >
                {/* 1. If user typed a search query: show instant matching tours */}
                {searchQuery.trim().length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.8rem', color: '#0F4CA4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Matching Packages for "{searchQuery}" ({matchingSearchPackages.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSearchPopupOpen(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#565E73' }}
                        title="Close popup"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {matchingSearchPackages.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {matchingSearchPackages.map(pkg => (
                          <div
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setIsSearchPopupOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: 12,
                              border: '1px solid #EDEEF1',
                              cursor: 'pointer',
                              background: '#FAFBFD',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#EFF8FF')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#FAFBFD')}
                          >
                            <img
                              src={pkg.heroImage}
                              alt={pkg.title}
                              style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#24262D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {pkg.title}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#565E73', display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                <span>📍 {pkg.destination}</span>
                                <span>•</span>
                                <span>⏱️ {pkg.durationDays}D / {pkg.durationNights || pkg.durationDays - 1}N</span>
                                <span style={{
                                  background: pkg.destinationType === 'domestic' ? 'rgba(5,150,105,0.1)' : 'rgba(15,76,164,0.1)',
                                  color: pkg.destinationType === 'domestic' ? '#059669' : '#0F4CA4',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  fontWeight: 700,
                                  fontSize: '0.68rem'
                                }}>
                                  {pkg.destinationType === 'domestic' ? 'Domestic' : 'International'}
                                </span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F4CA4' }}>
                                {formatPrice(getPackageSellingPrice(pkg))}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#FF7700', fontWeight: 700 }}>
                                View Details →
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchPopupOpen(false);
                            document.getElementById('holiday-packages-catalog')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          style={{
                            width: '100%',
                            padding: '9px',
                            background: '#0F4CA4',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            marginTop: 4
                          }}
                        >
                          Show All {matchingSearchPackages.length} Results in Catalog Below ↓
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', background: '#F8FAFC', borderRadius: 12 }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#24262D', marginBottom: 4 }}>
                          No packages found matching "{searchQuery}"
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                          Try searching for a destination or click one of the popular locations below:
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Most Searched Destinations */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.78rem', color: '#667085', fontWeight: 800, textTransform: 'uppercase' }}>
                      Most Searched International Destinations
                    </span>
                    {!searchQuery && (
                      <button onClick={() => setIsSearchPopupOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#565E73' }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                    {finalInternational.map((dest, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSearchQuery(dest.name);
                          setIsSearchPopupOpen(false);
                          document.getElementById('holiday-packages-catalog')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          borderRadius: 10,
                          padding: 4,
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <img src={dest.img} alt={dest.name} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 4 }} />
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#24262D' }}>{dest.name}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#667085', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
                    Most Searched Domestic Destinations
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {finalDomestic.map((dest, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSearchQuery(dest.name);
                          setIsSearchPopupOpen(false);
                          document.getElementById('holiday-packages-catalog')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          borderRadius: 10,
                          padding: 4,
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <img src={dest.img} alt={dest.name} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 4 }} />
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#24262D' }}>{dest.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TravelPulse Holiday Assurance Strip */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          background: '#F5FAFF',
          borderRadius: 16,
          border: '1px solid #D7DAE0',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 10, background: '#0F4CA4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FEE900', fontWeight: 900, fontSize: '0.85rem', flexShrink: 0 }}>
          TC
        </div>
        <div>
          <div style={{ fontWeight: 800, color: '#0F4CA4', fontSize: '0.95rem' }}>{adminHolidayConfig.assuranceTitle || 'TravelPulse Holiday Assurance'}</div>
          <div style={{ fontSize: '0.78rem', color: '#565E73' }}>140+ Years of Heritage • Verified 4★ Stays • Dedicated English/Hindi Tour Manager</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(adminHolidayConfig.assuranceBadges || ['All Meals Included', 'Flexi-Cancellation', '24x7 On-Tour Support']).map(b => (
            <span key={b} style={{ fontSize: '0.75rem', background: '#0F4CA4', color: '#fff', padding: '3px 12px', borderRadius: 20, fontWeight: 700 }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Segmented Destination Toggle & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #EDEEF1' }}>
        
        {/* Top Row: Segmented Domestic vs International + Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          {/* Segmented Button */}
          <div style={{ background: '#F6F7F9', padding: 4, borderRadius: 100, display: 'inline-flex', gap: 4 }}>
            {[
              { key: 'all', label: 'All Holidays' },
              { key: 'international', label: '🌍 International Holidays' },
              { key: 'domestic', label: '🇮🇳 India & Around' }
            ].map(type => (
              <button
                key={type.key}
                onClick={() => setDestTypeFilter(type.key as any)}
                style={{
                  background: destTypeFilter === type.key ? '#0F4CA4' : 'transparent',
                  color: destTypeFilter === type.key ? '#FFFFFF' : '#565E73',
                  border: 'none',
                  borderRadius: 100,
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.78rem', color: '#565E73', fontWeight: 600 }}>Sort by:</span>
            <select
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: 100 }}
            >
              <option value="recommended">Recommended & Best Sellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration">Duration (Days)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Bar: Group, Customised, Recommended, Trending */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
          <span style={{ fontSize: '0.78rem', color: '#565E73', fontWeight: 700, flexShrink: 0 }}>Category:</span>
          {[
            { key: 'all', label: 'All Packages' },
            { key: 'group', label: '👥 Group Tours' },
            { key: 'customised', label: '🎨 Customised Tours' },
            { key: 'recommended', label: '★ Recommended' },
            { key: 'trending', label: '🔥 Trending Now' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setTourCategoryFilter(cat.key)}
              style={{
                padding: '0.35rem 0.95rem',
                borderRadius: 100,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: tourCategoryFilter === cat.key ? '1px solid #0F4CA4' : '1px solid #D7DAE0',
                background: tourCategoryFilter === cat.key ? '#EFF8FF' : '#FFFFFF',
                color: tourCategoryFilter === cat.key ? '#0F4CA4' : '#24262D'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bottom Utility Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, borderTop: '1px solid #EDEEF1', paddingTop: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: '#565E73' }}>Departure Hub:</span>
            {Array.from(new Set(holidayPackages.flatMap(p => p.departureCities || []))).slice(0, 6).map(city => (
              <button
                key={city}
                onClick={() => setSelectedDepartureCity(city)}
                style={{
                  background: selectedDepartureCity === city ? '#0F4CA4' : 'transparent',
                  color: selectedDepartureCity === city ? '#fff' : '#565E73',
                  border: 'none',
                  borderRadius: 12,
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Ex-{city}
              </button>
            ))}
          </div>

          <button
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.75rem', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setActiveTab(activeTab === 'tracker' ? 'packages' : 'tracker')}
          >
            <Compass size={13} /> {activeTab === 'tracker' ? 'Explore Holiday Catalog' : 'Track Existing Holiday Booking'}
          </button>
        </div>

      </div>

      {/* TRACKING LOOKUP SECTION */}
      {activeTab === 'tracker' && (
        <div className="card" style={{ padding: '1.75rem', borderRadius: 16, borderLeft: '4px solid #0F4CA4' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#24262D', margin: '0 0 0.5rem' }}>
            Track Your TravelPulse Holiday Booking
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#565E73', margin: '0 0 1rem' }}>
            Enter your booking reference code (e.g. <span style={{ color: '#0F4CA4', fontWeight: 700 }}>TC-IN-984210</span>) to view itinerary confirmation and vouchers.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 500, marginBottom: '1rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. TC-IN-984210"
              value={trackRefInput}
              onChange={e => setTrackRefInput(e.target.value)}
            />
            <button
              className="btn btn-primary"
              style={{ background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, fontWeight: 700 }}
              onClick={handleTrackLookup}
            >
              Track
            </button>
          </div>

          {trackLookupResult === 'not_found' && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>
              No booking found with that reference. Please check and try again.
            </div>
          )}

          {trackLookupResult && trackLookupResult !== 'not_found' && (
            <div style={{ background: '#F6F7F9', borderRadius: 12, padding: '1.25rem', border: '1px solid #D7DAE0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontWeight: 800, color: '#0F4CA4', fontSize: '1.1rem' }}>
                  {trackLookupResult.bookingReference}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: trackLookupResult.status === 'confirmed' ? 'rgba(25,135,84,0.1)' : 'rgba(255,119,0,0.1)',
                  color: trackLookupResult.status === 'confirmed' ? '#198754' : '#FF7700'
                }}>
                  {trackLookupResult.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#24262D' }}>
                {trackLookupResult.packageTitle}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#565E73', marginTop: 4 }}>
                Traveler: {trackLookupResult.customerName} • Travel Date: <strong>{trackLookupResult.travelDate}</strong> • Ex-{trackLookupResult.departureCity}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F4CA4', marginTop: 8 }}>
                Total Paid: {formatPrice(trackLookupResult.totalAmountUSD)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* REAL TravelPulse PACKAGE CARDS LISTING (SRP) */}
      <div id="holiday-packages-catalog">
        {catalogLoading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#565E73' }}>
            Loading holiday packages…
          </div>
        )}
        {catalogError && !catalogLoading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            Failed to load packages. <button className="btn btn-sm btn-secondary" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        {!catalogLoading && !catalogError && filteredPackages.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#565E73' }}>
            No packages found. Try adjusting filters or search.
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#24262D', margin: 0 }}>
              Available Holiday Packages ({filteredPackages.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#565E73', margin: '2px 0 0' }}>
              Handpicked itineraries with guaranteed hotel stays and dedicated tour guides.
            </p>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#565E73' }}>
            Prices are per adult on twin sharing basis
          </div>
        </div>

        {/* Active Search Term Filter Pill */}
        {searchQuery.trim() && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#EFF8FF',
            border: '1px solid #B2DDFF',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.82rem',
            color: '#0F4CA4',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <span>Showing results matching <strong>"{searchQuery}"</strong> ({filteredPackages.length} found)</span>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: '#0F4CA4',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.7rem'
              }}
              title="Clear search query"
            >
              ✕
            </button>
          </div>
        )}

        {filteredPackages.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#565E73', borderRadius: 16 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#24262D', marginBottom: 6 }}>
              No packages match "{searchQuery}"
            </div>
            <p style={{ maxWidth: 460, margin: '0 auto 1.5rem', fontSize: '0.85rem', color: '#64748B' }}>
              We couldn't find any tours matching your exact search filters. Try clearing your search term or exploring all destinations.
            </p>
            <button
              className="btn btn-primary"
              style={{ background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 20, padding: '8px 24px', fontWeight: 700 }}
              onClick={() => {
                setSearchQuery('');
                setDestTypeFilter('all');
                setTourCategoryFilter('all');
                setThemeFilter('all');
              }}
            >
              Show All {holidayPackages.length} Packages
            </button>
          </div>
        ) : (
          <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {filteredPackages.slice((catalogPage - 1) * PAGE_SIZE, catalogPage * PAGE_SIZE).map(pkg => {
              const sellingPrice = getPackageSellingPrice(pkg);
              const strikethroughPrice = getStrikethroughPrice(sellingPrice, pkg.discountPercent || 8);

              return (
                <div
                  key={pkg.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: 16,
                    border: '0.8px solid #EDEEF1',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {/* Card Media Section */}
                  <div style={{ position: 'relative', height: 210, width: '100%', overflow: 'hidden' }}>
                    <img
                      src={pkg.heroImage}
                      alt={pkg.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Top Ribbons */}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {pkg.isBestSeller && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#0F4CA4', color: '#fff', padding: '3px 8px', borderRadius: 4 }}>
                          RECOMMENDED
                        </span>
                      )}
                      {pkg.isTrending && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#FF7700', color: '#fff', padding: '3px 8px', borderRadius: 4 }}>
                          TRENDING NOW
                        </span>
                      )}
                    </div>

                    {/* Bottom Duration & Hub Tag */}
                    <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: 'rgba(36, 38, 45, 0.85)', color: '#fff', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                        {pkg.durationNights || pkg.durationDays - 1}N / {pkg.durationDays}D
                      </span>
                      <span style={{ background: 'rgba(36, 38, 45, 0.85)', color: '#FEE900', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                        Ex-{selectedDepartureCity}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#0F4CA4', fontWeight: 800, textTransform: 'uppercase' }}>
                        {pkg.destination}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#FF7700', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Star size={12} fill="#FF7700" color="#FF7700" /> {(pkg.rating ?? 4.5).toFixed(1)} ({pkg.reviewCount ?? 120})
                      </span>
                    </div>

                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#24262D', lineHeight: 1.35 }}>
                      {pkg.title}
                    </h4>

                    {/* Route Night Breakdown Chips */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {pkg.days.slice(0, 3).map((d, i) => (
                        <span key={i} style={{ background: '#F6F7F9', color: '#565E73', fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>
                          1N {d.destination}
                        </span>
                      ))}
                      {pkg.days.length > 3 && (
                        <span style={{ background: '#F6F7F9', color: '#565E73', fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>
                          +{pkg.days.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Inclusions Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #EDEEF1', paddingTop: 8, fontSize: '0.7rem', color: '#565E73' }}>
                      {(pkg.inclusions || []).slice(0, 4).map((inc, i) => (
                        <span key={i} title={inc}>
                          {i === 0 ? '✈️' : i === 1 ? '🏨' : i === 2 ? '📸' : '🍽️'} {inc.split(' ').slice(0, 2).join(' ')}
                        </span>
                      ))}
                      {(!pkg.inclusions || pkg.inclusions.length === 0) && (
                        <>
                          <span>✈️ Flight</span>
                          <span>🏨 Hotel</span>
                          <span>📸 Sightseeing</span>
                          <span>🍽️ Meals</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Pricing & Action Button */}
                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #EDEEF1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: '0.78rem', color: '#667085', textDecoration: 'line-through' }}>
                          {formatPrice(strikethroughPrice)}
                        </span>
                        <span style={{ background: 'rgba(25, 135, 84, 0.1)', color: '#198754', fontWeight: 800, fontSize: '0.72rem', padding: '1px 5px', borderRadius: 4 }}>
                          {pkg.discountPercent || 8}% OFF
                        </span>
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F4CA4', lineHeight: 1 }}>
                        {formatPrice(sellingPrice)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#667085' }}>Per adult</div>
                    </div>

                    <button
                      className="btn btn-sm btn-primary"
                      style={{ background: '#0F4CA4', borderColor: '#0F4CA4', borderRadius: 100, fontWeight: 800, padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPackage(pkg);
                      }}
                    >
                      View Details <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredPackages.length > PAGE_SIZE && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1rem' }}>
              <button className="btn btn-sm btn-secondary" disabled={catalogPage <= 1} onClick={() => setCatalogPage(p => Math.max(1, p - 1))}>Prev</button>
              <span style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 700 }}>Page {catalogPage} of {Math.ceil(filteredPackages.length / PAGE_SIZE)}</span>
              <button className="btn btn-sm btn-secondary" disabled={catalogPage >= Math.ceil(filteredPackages.length / PAGE_SIZE)} onClick={() => setCatalogPage(p => p + 1)}>Next</button>
            </div>
          )}
          </>
        )}
      </div>

      {/* "Why TravelPulse?" 5 Heritage & Trust Pillars Grid */}
      <div className="card" style={{ padding: '2.5rem 2rem', borderRadius: 24, background: '#F5FAFF', border: '1px solid #D7DAE0' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 2rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F4CA4', textTransform: 'uppercase' }}>
            Unmatched Heritage & Safety
          </span>
          <h2 style={{ fontFamily: 'var(--font-tc-editorial)', fontSize: '2.2rem', fontWeight: 600, color: '#24262D', margin: '4px 0 8px' }}>
            Why Travel with TravelPulse?
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#565E73', margin: 0 }}>
            Leading Indian travelers to extraordinary global experiences since 1881.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {(adminHolidayConfig.trustPillars && adminHolidayConfig.trustPillars.length > 0
            ? adminHolidayConfig.trustPillars
            : [
                { icon: '🏛️', title: 'Trusted Advisor', description: 'Over 140 years of pioneering heritage designed for modern journeys.' },
                { icon: '🎨', title: 'Customized Holidays', description: 'Personalize daily itineraries according to your own pacing and preferences.' },
                { icon: '🌍', title: 'Wide Varieties', description: 'From romantic honeymoons to thrilling high treks and escorted tours.' },
                { icon: '💳', title: 'Seamless Booking', description: 'Hassle-free reservations with 100% secure payments and zero hidden fees.' },
                { icon: '✈️', title: 'All-In-One Ease', description: 'Complete holiday coverage: flights, hotels, meals, and curated tours.' }
              ]
          ).map((item, idx) => {
            const iconMap: Record<string, string> = { shield: '🛡️', star: '⭐', users: '👥', map: '🗺️', phone: '📞', award: '🏆' };
            const icon = iconMap[item.icon] || item.icon || '✨';
            const desc = (item as any).description || (item as any).desc || '';
            return (
              <div key={idx} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 16, border: '0.8px solid #EDEEF1', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '2rem' }}>{icon}</div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#24262D' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#565E73', lineHeight: 1.45 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
