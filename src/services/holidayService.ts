import {
  HolidayPackage,
  HolidayBookingRecord,
  AdminHolidayConfig,
  HolidayBookingStatus,
  DayItinerary,
  ActivityOption
} from '../types';
import { packagesApi, bookingsApi, configApi } from './apiClient';


// ======================== SERVICE CLASS ========================

class HolidayBackendService {
  private STORAGE_KEY_PACKAGES = 'TravelPulse_holiday_packages_db_v2';
  private STORAGE_KEY_BOOKINGS = 'TravelPulse_holiday_bookings_db_v2';
  private STORAGE_KEY_CONFIG = 'TravelPulse_holiday_admin_config_db_v2';

  constructor() {
    // Sync is triggered by AppContext on mount; avoid duplicate network calls here
  }

  /**
   * Syncs packages and config from Express + MongoDB backend
   */
  public async syncFromBackend(): Promise<{ packages: HolidayPackage[]; config: AdminHolidayConfig }> {
    let syncedPackages = this.getPackages();
    try {
      const res = await packagesApi.list({ limit: 50 });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: HolidayPackage[] = res.data.map(p => ({
          id: p._id || (p as any).id,
          title: p.title,
          destination: p.destination,
          destinationType: p.destinationType,
          region: p.region || '',
          theme: (p.theme as any) || 'family',
          category: (p.category as any) || 'Customized',
          durationDays: p.durationDays,
          durationNights: p.durationNights,
          departureCities: p.departureCities || ['Mumbai', 'Delhi'],
          basePrice: p.basePrice,
          wholesaleCost: (p as any).wholesaleCost || Math.round(p.basePrice * 0.78),
          heroImage: p.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
          galleryImages: p.galleryImages || [],
          highlights: p.highlights || [],
          inclusions: p.inclusions || [],
          exclusions: p.exclusions || [],
          hotelTiers: {
            standard: p.hotelTiers?.standard || 'Standard Quality Accommodations',
            deluxe: p.hotelTiers?.deluxe || 'Deluxe 4-Star Accommodations',
            luxury: p.hotelTiers?.luxury || 'Luxury 5-Star Accommodations'
          },
          isBestSeller: p.isBestSeller || false,
          isFeatured: p.isFeatured || false,
          isTrending: p.isTrending || false,
          rating: p.rating ?? 4.5,
          reviewCount: p.reviewCount ?? 120,
          discountPercent: p.discountPercent || 0,
          cancellationPolicy: p.cancellationPolicy || 'Standard cancellation policy applies.',
          days: (p.days as any) || []
        }));
        this.savePackages(mapped);
        syncedPackages = mapped;
      }
    } catch {
      // offline dev mode: local storage used
    }

    let syncedConfig = this.getAdminConfig();
    try {
      const cfgRes = await configApi.getPublic();
      if (cfgRes && cfgRes.success && cfgRes.data) {
        const current = this.getAdminConfig();
        // Normalize featuredDestinations: may be string[] or {name, imageUrl}[]
        const rawFeatured = (cfgRes.data as any).featuredDestinations;
       const normalizedFeatured: Array<{ name: string; imageUrl: string }> = Array.isArray(rawFeatured)
         ? rawFeatured.map((d: any) =>
             typeof d === 'string' ? { name: d, imageUrl: '' } : { name: d?.name || d, imageUrl: d?.imageUrl || '' }
           )
         : [];
        const merged: AdminHolidayConfig = {
          ...current,
          ...(cfgRes.data as any),
          featuredDestinations: normalizedFeatured
        };
        this.saveAdminConfig(merged);
        syncedConfig = merged;
      }
    } catch {
      // offline
    }

    return { packages: syncedPackages, config: syncedConfig };
  }

  // 1. Packages CRUD
  public getPackages(): HolidayPackage[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_PACKAGES);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    return [];
  }

  public getPackageById(id: string): HolidayPackage | undefined {
    return this.getPackages().find(p => p.id === id);
  }

  public savePackages(packages: HolidayPackage[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_PACKAGES, JSON.stringify(packages));
    } catch (e) {
      // ignore
    }
  }

  public updatePackage(id: string, updates: Partial<HolidayPackage>): HolidayPackage[] {
    const list = this.getPackages();
    const updated = list.map(p => p.id === id ? { ...p, ...updates } : p);
    this.savePackages(updated);

    // Sync to Express MongoDB
    packagesApi.patch(id, updates as any).then((res) => {
      if (res && res.success && res.data) {
        // Backend updated successfully
      }
    }).catch((err) => {
      console.warn(`Backend package patch (${id}) failed:`, err);
    });

    return updated;
  }

  public addPackage(newPkg: HolidayPackage): HolidayPackage[] {
    const list = this.getPackages();
    const updated = [newPkg, ...list];
    this.savePackages(updated);

    // Sync to Express MongoDB
    packagesApi.create({
      ...newPkg,
      slug: newPkg.id
    } as any).then((res) => {
      if (res && res.success && res.data && res.data._id) {
        const currentList = this.getPackages();
        const updatedWithBackendId = currentList.map(p =>
          p.id === newPkg.id ? { ...p, id: res.data._id } : p
        );
        this.savePackages(updatedWithBackendId);
      }
    }).catch((err) => {
      console.warn('Backend package creation sync failed, saved locally:', err);
    });

    return updated;
  }

  public deletePackage(id: string): HolidayPackage[] {
    const list = this.getPackages();
    const updated = list.filter(p => p.id !== id);
    this.savePackages(updated);

    // Sync to Express MongoDB
    packagesApi.remove(id).catch((err) => {
      console.warn(`Backend package delete (${id}) failed:`, err);
    });

    return updated;
  }

  // 2. Bookings / Inquiries CRUD
  public getBookings(): HolidayBookingRecord[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_BOOKINGS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    return [];
  }

  public saveBookings(bookings: HolidayBookingRecord[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      // ignore
    }
  }

  public createBooking(booking: Partial<HolidayBookingRecord>): HolidayBookingRecord {
    const bookings = this.getBookings();
    const bookingReference = `TC-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: HolidayBookingRecord = {
      id: `tc-bk-${Date.now()}`,
      bookingReference,
      packageId: booking.packageId || '',
      packageTitle: booking.packageTitle || 'Holiday Package',
      destination: booking.destination || '',
      destinationType: booking.destinationType || 'domestic',
      customerName: booking.customerName || 'Guest Traveler',
      customerEmail: booking.customerEmail || '',
      customerPhone: booking.customerPhone || '+91 98765 43210',
      departureCity: booking.departureCity || 'Mumbai',
      travelDate: booking.travelDate || new Date().toISOString().split('T')[0],
      paxAdults: booking.paxAdults || 2,
      paxChildren: booking.paxChildren || 0,
      selectedHotelTier: booking.selectedHotelTier || 'Superior',
      totalAmountUSD: booking.totalAmountUSD || 800,
      wholesaleCostUSD: booking.wholesaleCostUSD || 650,
      markupAmountUSD: booking.markupAmountUSD || 150,
      status: booking.status || 'inquiry_received',
      customNotes: booking.customNotes || 'Inquiry created via TravelPulse online portal.',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    const updated = [newRecord, ...bookings];
    this.saveBookings(updated);

    return newRecord;
  }

  public updateBookingStatus(
    bookingReference: string,
    status: HolidayBookingStatus,
    note?: string
  ): HolidayBookingRecord[] {
    const list = this.getBookings();
    const updated = list.map(b => {
      if (b.bookingReference === bookingReference || b.id === bookingReference) {
        return {
          ...b,
          status,
          customNotes: note ? `${b.customNotes || ''} | ${note}` : b.customNotes
        };
      }
      return b;
    });
    this.saveBookings(updated);

    // Sync to Express MongoDB
    const target = list.find(b => b.bookingReference === bookingReference || b.id === bookingReference);
    const syncId = target?.id;
    const isMongoId = !!syncId && /^[a-f0-9]{24}$/i.test(syncId);
    const doUpdate = async (id: string) => {
      try { await bookingsApi.updateStatus(id, status, note); } catch (e) { console.warn('Backend booking status update failed:', e); }
    };
    if (isMongoId) {
      doUpdate(syncId!);
    } else if (target?.bookingReference) {
      // Resolve Mongo _id via public track endpoint
      bookingsApi.track(target.bookingReference).then((res: any) => {
        const mid = res?.data?._id || res?.data?.id;
        if (mid) doUpdate(mid);
      }).catch(() => {});
    }

    return updated;
  }

  // 3. Admin Configuration
  public getAdminConfig(): AdminHolidayConfig {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
    return {
      partnerMarkupPercent: 15,
      groupDiscountPercent: 8,
      tourManagerIncludedByDefault: true,
      supportHelpline: '1800-209-9100',
      whatsappInquiryNumber: '+919222211100',
      enableInstantBooking: true
    } as AdminHolidayConfig;
  }

  public saveAdminConfig(cfg: AdminHolidayConfig): void {
    try {
      localStorage.setItem(this.STORAGE_KEY_CONFIG, JSON.stringify(cfg));
    } catch (e) {
      // ignore
    }

    // Sync to Express MongoDB
    configApi.update(cfg as any).catch(() => {});
  }

  public calculatePackageSellingPrice(basePrice: number, partnerMarkupPercent: number): number {
    return Math.round(basePrice * (1 + partnerMarkupPercent / 100));
  }
}

export const holidayBackend = new HolidayBackendService();
