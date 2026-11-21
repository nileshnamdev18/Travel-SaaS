import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortalType,
  UserRole,
  CurrencyCode,
  ThemeMode,
  AgencyBranding,
  AgencyWallet,
  QuotationRecord,
  LeadRecord,
  StaffMember,
  VendorLedgerRecord,
  OfflineRateSheet,
  AuditLogEntry,
  InvoiceDocument,
  UmrahPackage,
  LeadPipelineStatus,
  FlightOption,
  HotelOption,
  BookingRecord,
  BookingVertical,
  CorporateTravelPolicy,
  AdminMarkupConfig,
  CountryVisaInfo,
  VisaApplicationRecord,
  AdminVisaConfig,
  VisaApplicationStatus,
  HolidayPackage,
  HolidayBookingRecord,
  AdminHolidayConfig,
  HolidayBookingStatus
} from '../types';
import { visaBackend } from '../services/visaService';
import { holidayBackend } from '../services/holidayService';
import {
  CURRENCIES,
  INITIAL_UMRAH_PACKAGES,
  INITIAL_AGENCY_BRANDING,
  INITIAL_AGENCY_WALLET,
  INITIAL_QUOTATIONS,
  INITIAL_LEADS,
  INITIAL_STAFF,
  INITIAL_VENDOR_LEDGER,
  INITIAL_OFFLINE_RATES,
  INITIAL_AUDIT_LOG,
  INITIAL_INVOICES,
  INITIAL_FLIGHTS,
  INITIAL_HOTELS,
  INITIAL_CORPORATE_POLICY,
  INITIAL_ADMIN_MARKUP,
  INITIAL_BOOKINGS
} from '../data/mockData';

interface AppContextType {
  // Theme & Navigation
  theme: ThemeMode;
  toggleTheme: () => void;
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  
  // Currency
  activeCurrency: CurrencyCode;
  setActiveCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;
  convertPrice: (amountUSD: number) => number;

  // Domain Inventory
  flights: FlightOption[];
  hotels: HotelOption[];
  umrahPackages: UmrahPackage[];
  addUmrahPackage: (pkg: UmrahPackage) => void;

  // Dynamic Admin Markup Engine (SuperAdmin)
  adminMarkup: AdminMarkupConfig;
  updateAdminMarkup: (vertical: keyof AdminMarkupConfig, value: number) => void;
  getMarkupAdjustedPrice: (basePrice: number, vertical: 'flights' | 'hotels' | 'umrah' | 'visas' | 'holidays') => number;

  // Corporate Travel Policy (Fallback / Admin)
  corporatePolicy: CorporateTravelPolicy;
  updateCorporatePolicy: (policy: Partial<CorporateTravelPolicy>) => void;

  // Real Bookings & Customer Trips
  bookings: BookingRecord[];
  addBooking: (booking: BookingRecord) => void;
  approveBooking: (bookingId: string, note?: string) => void;
  rejectBooking: (bookingId: string, reason: string) => void;
  cancelBooking: (bookingId: string) => void;

  // Atlys Visa Full-Stack Database & Admin Config
  visaDestinations: CountryVisaInfo[];
  updateVisaDestination: (id: string, updates: Partial<CountryVisaInfo>) => void;
  addVisaDestination: (newDest: CountryVisaInfo) => void;
  deleteVisaDestination: (id: string) => void;
  visaApplications: VisaApplicationRecord[];
  createVisaApplication: (appData: Partial<VisaApplicationRecord>) => VisaApplicationRecord;
  updateVisaApplicationStatus: (trackingId: string, status: VisaApplicationStatus, note?: string) => void;
  adminVisaConfig: AdminVisaConfig;
  updateAdminVisaConfig: (cfg: Partial<AdminVisaConfig>) => void;
  calculateGuaranteedDate: (days: number) => string;

  // Thomas Cook Holidays Full-Stack Database & Admin Config
  holidayPackages: HolidayPackage[];
  updateHolidayPackage: (id: string, updates: Partial<HolidayPackage>) => void;
  addHolidayPackage: (newPkg: HolidayPackage) => void;
  deleteHolidayPackage: (id: string) => void;
  holidayBookings: HolidayBookingRecord[];
  createHolidayBooking: (bookingData: Partial<HolidayBookingRecord>) => HolidayBookingRecord;
  updateHolidayBookingStatus: (bookingReference: string, status: HolidayBookingStatus, note?: string) => void;
  adminHolidayConfig: AdminHolidayConfig;
  updateAdminHolidayConfig: (cfg: Partial<AdminHolidayConfig>) => void;

  // Checkout Modal
  activeCheckout: { isOpen: boolean; item?: any; vertical?: BookingVertical };
  openCheckout: (item: any, vertical: BookingVertical) => void;
  closeCheckout: () => void;

  // Drawers & Modals
  isMyTripsOpen: boolean;
  setIsMyTripsOpen: (open: boolean) => void;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;

  // Audit Trail (SuperAdmin)
  auditLog: AuditLogEntry[];
  logAuditAction: (action: string, entityType: AuditLogEntry['entityType'], entityId: string, prevVal: string, newVal: string) => void;

  // Generic Dialogs & Notifications
  activeModal: { type: string | null; data?: any };
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;

  // Stubs for legacy/B2B references so components don't crash
  leads: LeadRecord[];
  updateLeadPipeline: (leadId: string, status: LeadPipelineStatus) => void;
  assignLeadToStaff: (leadId: string, staffId: string) => void;
  staff: StaffMember[];
  vendorLedger: VendorLedgerRecord[];
  recordVendorPayment: (vendorId: string, amount: number, mode: string) => void;
  offlineRates: OfflineRateSheet[];
  addOfflineRate: (rate: Omit<OfflineRateSheet, 'id'>) => void;
  invoices: InvoiceDocument[];
  createInvoice: (invoice: InvoiceDocument) => void;
  quotations: QuotationRecord[];
  addQuotation: (quote: QuotationRecord) => void;
  updateQuotationDelivery: (quoteId: string, channel: 'download' | 'whatsapp' | 'email') => void;
  agencyBranding: AgencyBranding;
  updateAgencyBranding: (branding: Partial<AgencyBranding>) => void;
  agencyWallet: AgencyWallet;
  topUpWallet: (amount: number) => void;
  agencyMarkup: { type: 'percentage' | 'flat'; value: number };
  updateAgencyMarkup: (type: 'percentage' | 'flat', value: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Management (Light by default, persistent)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('tp_theme') as ThemeMode;
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Only 2 roles in active use: 'customer' and 'super_admin'
  const [activePortal, setActivePortal] = useState<PortalType>('customer');
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('tp_active_role') as UserRole;
    return savedRole === 'super_admin' ? 'super_admin' : 'customer';
  });

  useEffect(() => {
    localStorage.setItem('tp_active_role', activeRole);
  }, [activeRole]);

  // Currency
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('INR');

  // Domain data
  const [flights] = useState<FlightOption[]>(INITIAL_FLIGHTS);
  const [hotels] = useState<HotelOption[]>(INITIAL_HOTELS);
  const [umrahPackages, setUmrahPackages] = useState<UmrahPackage[]>(INITIAL_UMRAH_PACKAGES);

  // Dynamic Admin Markup Engine (persisted)
  const [adminMarkup, setAdminMarkup] = useState<AdminMarkupConfig>(() => {
    const saved = localStorage.getItem('tp_admin_markup');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ADMIN_MARKUP;
  });

  const updateAdminMarkup = (vertical: keyof AdminMarkupConfig, value: number) => {
    setAdminMarkup(prev => {
      const next = { ...prev, [vertical]: value };
      localStorage.setItem('tp_admin_markup', JSON.stringify(next));
      return next;
    });
    logAuditAction(`Platform Markup Updated for ${vertical}`, 'Markup', vertical, `${adminMarkup[vertical]}`, `${value}`);
  };

  const getMarkupAdjustedPrice = (basePrice: number, vertical: 'flights' | 'hotels' | 'umrah' | 'visas' | 'holidays'): number => {
    switch (vertical) {
      case 'flights':
        return Math.round(basePrice + adminMarkup.flightsFlatUSD);
      case 'hotels':
        return Math.round(basePrice * (1 + adminMarkup.hotelsPercent / 100));
      case 'umrah':
        return Math.round(basePrice * (1 + adminMarkup.umrahPercent / 100));
      case 'visas':
        return Math.round(basePrice + adminMarkup.visasFlatUSD);
      case 'holidays':
        return Math.round(basePrice * (1 + adminMarkup.holidaysPercent / 100));
      default:
        return Math.round(basePrice);
    }
  };

  // Corporate Travel Policy (Internal/SuperAdmin)
  const [corporatePolicy, setCorporatePolicy] = useState<CorporateTravelPolicy>(() => {
    const saved = localStorage.getItem('tp_corporate_policy');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CORPORATE_POLICY;
  });

  const updateCorporatePolicy = (updated: Partial<CorporateTravelPolicy>) => {
    setCorporatePolicy(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('tp_corporate_policy', JSON.stringify(next));
      return next;
    });
    logAuditAction('Corporate Travel Policy Rules Updated', 'Travel Policy', 'corporate-policy-engine', 'Previous Caps', JSON.stringify(updated));
  };

  // Bookings & Approvals (persisted)
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('tp_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('tp_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: BookingRecord) => {
    setBookings(prev => [booking, ...prev]);
    logAuditAction(
      `New Booking Created #${booking.referenceCode} (${booking.vertical})`,
      'Booking Approval',
      booking.id,
      'None',
      `Status: ${booking.status}, Total: $${booking.totalAmountUSD}`
    );
  };

  const approveBooking = (bookingId: string, note?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'confirmed',
          policyCompliance: {
            ...b.policyCompliance,
            inPolicy: true,
            approvedBy: 'SUPER ADMIN',
            approvalDate: new Date().toISOString().slice(0, 10),
            reason: note ? `${b.policyCompliance.reason || ''} [Approved: ${note}]` : b.policyCompliance.reason
          }
        };
      }
      return b;
    }));
    logAuditAction(`Booking Approved #${bookingId}`, 'Booking Approval', bookingId, 'pending_approval', 'confirmed');
  };

  const rejectBooking = (bookingId: string, reason: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled',
          policyCompliance: {
            ...b.policyCompliance,
            rejectionReason: reason
          }
        };
      }
      return b;
    }));
    logAuditAction(`Booking Rejected #${bookingId}`, 'Booking Approval', bookingId, 'pending_approval', `Cancelled: ${reason}`);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    logAuditAction(`Booking Cancelled #${bookingId}`, 'Booking Approval', bookingId, 'Active', 'Cancelled by User');
  };

  // Atlys Visa Full-Stack Database & Admin Config (Reactive State)
  const [visaDestinations, setVisaDestinations] = useState<CountryVisaInfo[]>(() => visaBackend.getDestinations());
  const [visaApplications, setVisaApplications] = useState<VisaApplicationRecord[]>(() => visaBackend.getApplications());
  const [adminVisaConfig, setAdminVisaConfig] = useState<AdminVisaConfig>(() => visaBackend.getAdminConfig());

  const updateVisaDestination = (id: string, updates: Partial<CountryVisaInfo>) => {
    const updated = visaBackend.updateDestination(id, updates);
    setVisaDestinations(updated);
    logAuditAction(`Visa Destination Config Updated: ${id}`, 'Offline Rate', id, 'Prev Config', JSON.stringify(updates));
  };

  const addVisaDestination = (newDest: CountryVisaInfo) => {
    const updated = visaBackend.addDestination(newDest);
    setVisaDestinations(updated);
    logAuditAction(`New Visa Destination Added: ${newDest.countryName}`, 'Offline Rate', newDest.id, 'None', newDest.countryCode);
  };

  const deleteVisaDestination = (id: string) => {
    const updated = visaBackend.deleteDestination(id);
    setVisaDestinations(updated);
    logAuditAction(`Visa Destination Removed: ${id}`, 'Offline Rate', id, 'Active', 'Deleted');
  };

  const createVisaApplication = (appData: Partial<VisaApplicationRecord>): VisaApplicationRecord => {
    const created = visaBackend.createApplication(appData);
    setVisaApplications(visaBackend.getApplications());
    logAuditAction(`New Visa Application Registered #${created.trackingId}`, 'Booking Approval', created.id, 'None', created.status);
    return created;
  };

  const updateVisaApplicationStatus = (trackingId: string, status: VisaApplicationStatus, note?: string) => {
    const updated = visaBackend.updateApplicationStatus(trackingId, status, note);
    setVisaApplications(updated);
    logAuditAction(`Visa Application #${trackingId} Status Set to ${status}`, 'Booking Approval', trackingId, 'Status', note || '');
  };

  const updateAdminVisaConfig = (cfg: Partial<AdminVisaConfig>) => {
    const current = visaBackend.getAdminConfig();
    const updated = { ...current, ...cfg };
    visaBackend.saveAdminConfig(updated);
    setAdminVisaConfig(updated);
    logAuditAction('Visa Engine Global Settings Changed', 'Markup', 'visa-engine', JSON.stringify(current), JSON.stringify(updated));
  };

  const calculateGuaranteedDate = (days: number): string => {
    return visaBackend.calculateGuaranteedDate(days);
  };

  // Thomas Cook Holidays State & Handlers
  const [holidayPackages, setHolidayPackages] = useState<HolidayPackage[]>(() => holidayBackend.getPackages());
  const [holidayBookings, setHolidayBookings] = useState<HolidayBookingRecord[]>(() => holidayBackend.getBookings());
  const [adminHolidayConfig, setAdminHolidayConfig] = useState<AdminHolidayConfig>(() => holidayBackend.getAdminConfig());

  // Sync Thomas Cook Holidays from Express MongoDB Backend on mount
  useEffect(() => {
    let isMounted = true;
    holidayBackend.syncFromBackend().then(({ packages, config }) => {
      if (isMounted) {
        setHolidayPackages(packages);
        setAdminHolidayConfig(config);
      }
    }).catch(() => {
      // Offline fallback: already loaded from localStorage
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateHolidayPackage = (id: string, updates: Partial<HolidayPackage>) => {
    const updated = holidayBackend.updatePackage(id, updates);
    setHolidayPackages(updated);
    logAuditAction(`Holiday Package Updated: ${id}`, 'Offline Rate', id, 'Prev Config', JSON.stringify(updates));
  };

  const addHolidayPackage = (newPkg: HolidayPackage) => {
    const updated = holidayBackend.addPackage(newPkg);
    setHolidayPackages(updated);
    logAuditAction(`New Holiday Package Added: ${newPkg.title}`, 'Offline Rate', newPkg.id, 'None', newPkg.destination);
  };

  const deleteHolidayPackage = (id: string) => {
    const updated = holidayBackend.deletePackage(id);
    setHolidayPackages(updated);
    logAuditAction(`Holiday Package Removed: ${id}`, 'Offline Rate', id, 'Active', 'Deleted');
  };

  const createHolidayBooking = (bookingData: Partial<HolidayBookingRecord>): HolidayBookingRecord => {
    const created = holidayBackend.createBooking(bookingData);
    setHolidayBookings(holidayBackend.getBookings());
    logAuditAction(`New Holiday Booking/Inquiry #${created.bookingReference}`, 'Booking Approval', created.id, 'None', created.status);
    return created;
  };

  const updateHolidayBookingStatus = (bookingReference: string, status: HolidayBookingStatus, note?: string) => {
    const updated = holidayBackend.updateBookingStatus(bookingReference, status, note);
    setHolidayBookings(updated);
    logAuditAction(`Holiday Booking #${bookingReference} Status Set to ${status}`, 'Booking Approval', bookingReference, 'Status', note || '');
  };

  const updateAdminHolidayConfig = (cfg: Partial<AdminHolidayConfig>) => {
    const current = holidayBackend.getAdminConfig();
    const updated = { ...current, ...cfg };
    holidayBackend.saveAdminConfig(updated);
    setAdminHolidayConfig(updated);
    if (cfg.partnerMarkupPercent !== undefined) {
      updateAdminMarkup('holidaysPercent', cfg.partnerMarkupPercent);
    }
    logAuditAction('Thomas Cook Holiday Engine Settings Changed', 'Markup', 'holiday-engine', JSON.stringify(current), JSON.stringify(updated));
  };

  // Checkout modal
  const [activeCheckout, setActiveCheckout] = useState<{ isOpen: boolean; item?: any; vertical?: BookingVertical }>({
    isOpen: false
  });

  const openCheckout = (item: any, vertical: BookingVertical) => {
    setActiveCheckout({ isOpen: true, item, vertical });
  };

  const closeCheckout = () => {
    setActiveCheckout({ isOpen: false });
  };

  // Drawers
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Stubs for SuperAdmin/legacy models
  const [agencyBranding, setAgencyBranding] = useState<AgencyBranding>(INITIAL_AGENCY_BRANDING);
  const [agencyWallet, setAgencyWallet] = useState<AgencyWallet>(INITIAL_AGENCY_WALLET);
  const [agencyMarkup, setAgencyMarkup] = useState<{ type: 'percentage' | 'flat'; value: number }>({
    type: 'percentage',
    value: 12
  });
  const [quotations, setQuotations] = useState<QuotationRecord[]>(INITIAL_QUOTATIONS);
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [vendorLedger, setVendorLedger] = useState<VendorLedgerRecord[]>(INITIAL_VENDOR_LEDGER);
  const [offlineRates, setOfflineRates] = useState<OfflineRateSheet[]>(INITIAL_OFFLINE_RATES);
  const [invoices, setInvoices] = useState<InvoiceDocument[]>(INITIAL_INVOICES);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Generic modal state
  const [activeModal, setActiveModal] = useState<{ type: string | null; data?: any }>({ type: null });

  // Currency Converter helper
  const convertPrice = (amountUSD: number): number => {
    const config = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    return Math.round(amountUSD * config.rateToUSD);
  };

  const formatPrice = (amountUSD: number): string => {
    const config = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    const converted = amountUSD * config.rateToUSD;
    return `${config.symbol} ${Math.round(converted).toLocaleString()}`;
  };

  // 2-Role RBAC Check: customer vs super_admin
  const hasPermission = (permission: string): boolean => {
    if (activeRole === 'super_admin') return true;
    switch (permission) {
      case 'can_book':
        return true;
      case 'can_view_admin':
      case 'can_edit_markup':
      case 'can_approve_travel':
      case 'can_edit_policy':
        return false;
      default:
        return false;
    }
  };

  const addUmrahPackage = (pkg: UmrahPackage) => {
    setUmrahPackages(prev => [pkg, ...prev]);
  };

  const updateAgencyBranding = (updated: Partial<AgencyBranding>) => {
    setAgencyBranding(prev => ({ ...prev, ...updated }));
  };

  const topUpWallet = (amount: number) => {
    setAgencyWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      availablePower: prev.availablePower + amount
    }));
  };

  const updateAgencyMarkup = (type: 'percentage' | 'flat', value: number) => {
    setAgencyMarkup({ type, value });
  };

  const addQuotation = (quote: QuotationRecord) => {
    setQuotations(prev => [quote, ...prev]);
  };

  const updateQuotationDelivery = (quoteId: string, channel: 'download' | 'whatsapp' | 'email') => {
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'Sent',
          deliveryStatus: {
            ...q.deliveryStatus,
            downloaded: channel === 'download' ? true : q.deliveryStatus.downloaded,
            whatsappSent: channel === 'whatsapp' ? true : q.deliveryStatus.whatsappSent,
            emailSent: channel === 'email' ? true : q.deliveryStatus.emailSent,
            lastDeliveredAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }
        };
      }
      return q;
    }));
  };

  const updateLeadPipeline = (leadId: string, status: LeadPipelineStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipelineStatus: status } : l));
  };

  const assignLeadToStaff = (leadId: string, staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedStaffId: staffId, assignedStaffName: staffMember.name } : l));
  };

  const recordVendorPayment = (vendorId: string, amount: number) => {
    setVendorLedger(prev => prev.map(v => {
      if (v.id === vendorId) {
        const newPaid = v.amountPaid + amount;
        const newPending = Math.max(0, v.pendingBalance - amount);
        return {
          ...v,
          amountPaid: newPaid,
          pendingBalance: newPending,
          isOverdue: newPending === 0 ? false : v.isOverdue,
          reconciliationStatus: 'Reconciled'
        };
      }
      return v;
    }));
  };

  const addOfflineRate = (rate: Omit<OfflineRateSheet, 'id'>) => {
    const newRate: OfflineRateSheet = {
      ...rate,
      id: `off-${Date.now()}`
    };
    setOfflineRates(prev => [newRate, ...prev]);
  };

  const createInvoice = (invoice: InvoiceDocument) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const logAuditAction = (action: string, entityType: AuditLogEntry['entityType'], entityId: string, previousValue: string, newValue: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      actorName: activeRole === 'super_admin' ? 'SUPER ADMIN' : 'CUSTOMER',
      actorRole: activeRole,
      action,
      entityType,
      entityId,
      previousValue,
      newValue,
      ipAddress: '192.168.1.108'
    };
    setAuditLog(prev => [entry, ...prev]);
  };

  const openModal = (type: string, data?: any) => setActiveModal({ type, data });
  const closeModal = () => setActiveModal({ type: null });

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activePortal,
        setActivePortal,
        activeRole,
        setActiveRole,
        hasPermission,
        activeCurrency,
        setActiveCurrency,
        formatPrice,
        convertPrice,
        flights,
        hotels,
        umrahPackages,
        addUmrahPackage,
        adminMarkup,
        updateAdminMarkup,
        getMarkupAdjustedPrice,
        corporatePolicy,
        updateCorporatePolicy,
        bookings,
        addBooking,
        approveBooking,
        rejectBooking,
        cancelBooking,
        visaDestinations,
        updateVisaDestination,
        addVisaDestination,
        deleteVisaDestination,
        visaApplications,
        createVisaApplication,
        updateVisaApplicationStatus,
        adminVisaConfig,
        updateAdminVisaConfig,
        calculateGuaranteedDate,
        holidayPackages,
        updateHolidayPackage,
        addHolidayPackage,
        deleteHolidayPackage,
        holidayBookings,
        createHolidayBooking,
        updateHolidayBookingStatus,
        adminHolidayConfig,
        updateAdminHolidayConfig,
        activeCheckout,
        openCheckout,
        closeCheckout,
        isMyTripsOpen,
        setIsMyTripsOpen,
        isRoleModalOpen,
        setIsRoleModalOpen,
        agencyBranding,
        updateAgencyBranding,
        agencyWallet,
        topUpWallet,
        agencyMarkup,
        updateAgencyMarkup,
        quotations,
        addQuotation,
        updateQuotationDelivery,
        leads,
        updateLeadPipeline,
        assignLeadToStaff,
        staff,
        vendorLedger,
        recordVendorPayment,
        offlineRates,
        addOfflineRate,
        invoices,
        createInvoice,
        auditLog,
        logAuditAction,
        activeModal,
        openModal,
        closeModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
