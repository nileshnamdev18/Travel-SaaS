/**
 * TravelPulse API Client
 * Wraps all fetch calls to the Express + MongoDB backend.
 * Falls back gracefully if the server is offline (dev convenience).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('tp_jwt_token');
export const setToken = (t: string): void => { localStorage.setItem('tp_jwt_token', t); };
export const clearToken = (): void => { localStorage.removeItem('tp_jwt_token'); localStorage.removeItem('tp_auth_user'); };

function authHeaders(): Record<string, string> {
  const token = getToken();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  requiresAuth = false
): Promise<T> {
  const headers = requiresAuth ? authHeaders() : { 'Content-Type': 'application/json' };
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data as T;
}

// ─── Shared response types ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'super_admin';
  phone?: string;
}

export interface AuthPayload {
  success: boolean;
  token: string;
  user: AuthUser;
}

export const authApi = {
  register: (name: string, email: string, password: string, phone?: string) =>
    request<AuthPayload>('POST', '/auth/register', { name, email, password, phone }),

  login: (email: string, password: string) =>
    request<AuthPayload>('POST', '/auth/login', { email, password }),

  me: () => request<ApiResponse<AuthUser>>('GET', '/auth/me', undefined, true),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<ApiResponse<null>>('POST', '/auth/change-password', { currentPassword, newPassword }, true)
};

// ─── Holiday Packages ──────────────────────────────────────────────────────────
export interface ApiHolidayPackage {
  _id: string;
  title: string;
  destination: string;
  destinationType: 'domestic' | 'international';
  region: string;
  theme: string;
  category: string;
  durationDays: number;
  durationNights: number;
  departureCities: string[];
  basePrice: number;
  sellingPrice?: number;
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  hotelTiers: { standard?: string; deluxe?: string; luxury?: string };
  days: Array<{
    dayNumber: number;
    dayTitle: string;
    destination?: string;
    currentActivity?: { title: string; duration?: string; priceDelta: number; image?: string; description?: string };
    alternativeActivities?: Array<{ title: string; duration?: string; priceDelta: number; image?: string; description?: string }>;
    hotelName?: string;
    hotelTier?: string;
    mealsIncluded?: string[];
  }>;
  isBestSeller: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent: number;
  cancellationPolicy: string;
  tags: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFilters {
  search?: string;
  destinationType?: 'domestic' | 'international' | 'all';
  theme?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  sort?: 'recommended' | 'price_asc' | 'price_desc' | 'duration_asc' | 'duration_desc' | 'newest';
  page?: number;
  limit?: number;
}

export const packagesApi = {
  list: (filters: PackageFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.set(k, String(v)); });
    return request<PaginatedResponse<ApiHolidayPackage>>('GET', `/packages?${params.toString()}`);
  },

  featured: () => request<ApiResponse<ApiHolidayPackage[]>>('GET', '/packages/featured'),

  getById: (id: string) => request<ApiResponse<ApiHolidayPackage>>('GET', `/packages/${id}`),

  create: (data: Partial<ApiHolidayPackage>) =>
    request<ApiResponse<ApiHolidayPackage>>('POST', '/packages', data, true),

  update: (id: string, data: Partial<ApiHolidayPackage>) =>
    request<ApiResponse<ApiHolidayPackage>>('PUT', `/packages/${id}`, data, true),

  patch: (id: string, data: Partial<ApiHolidayPackage>) =>
    request<ApiResponse<ApiHolidayPackage>>('PATCH', `/packages/${id}`, data, true),

  remove: (id: string) =>
    request<ApiResponse<null>>('DELETE', `/packages/${id}`, undefined, true),

  uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/packages/upload-image`, { method: 'POST', headers, body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  },

  extractFromPdf: async (file: File): Promise<ApiResponse<Partial<ApiHolidayPackage>>> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/packages/extract-from-pdf`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;
  }
};

// ─── Bookings ──────────────────────────────────────────────────────────────────
export interface ApiBooking {
  _id: string;
  bookingRef: string;
  packageId: string | ApiHolidayPackage;
  packageTitle: string;
  packageDestination: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDateFrom: string;
  travelDateTo?: string;
  rooms: number;
  adults: number;
  children: number;
  hotelTierSelected: 'standard' | 'deluxe' | 'luxury';
  departureCitySelected: string;
  basePricePerPerson: number;
  markup: number;
  discountPercent: number;
  totalAmountUSD: number;
  status: 'inquiry_received' | 'customizing' | 'quote_sent' | 'confirmed' | 'cancelled' | 'completed';
  activitySwaps: Array<{ dayNumber: number; chosenActivityId: string; chosenActivityTitle: string; priceDelta: number }>;
  specialRequests?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  packageId: string;
  customerPhone: string;
  customerName?: string;
  customerEmail?: string;
  travelDateFrom: string;
  travelDateTo?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  hotelTierSelected?: 'standard' | 'deluxe' | 'luxury';
  departureCitySelected?: string;
  activitySwaps?: Array<{ dayNumber: number; chosenActivityId: string; chosenActivityTitle: string; priceDelta: number }>;
  specialRequests?: string;
}

export const bookingsApi = {
  create: (data: CreateBookingPayload) =>
    request<ApiResponse<ApiBooking>>('POST', '/bookings', data, true),

  myBookings: () => request<ApiResponse<ApiBooking[]>>('GET', '/bookings/my', undefined, true),

  track: (ref: string) => request<ApiResponse<ApiBooking>>('GET', `/bookings/track/${encodeURIComponent(ref)}`),

  getById: (id: string) => request<ApiResponse<ApiBooking>>('GET', `/bookings/${id}`, undefined, true),

  updateStatus: (id: string, status: string, adminNotes?: string) =>
    request<ApiResponse<ApiBooking>>('PATCH', `/bookings/${id}/status`, { status, adminNotes }, true),

  delete: (id: string) =>
    request<ApiResponse<null>>('DELETE', `/bookings/${id}`, undefined, true)
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalPackages: number;
  activePackages: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  totalRevenue: number;
}

export const adminApi = {
  dashboard: () => request<ApiResponse<{ stats: DashboardStats; recentBookings: ApiBooking[] }>>('GET', '/admin/dashboard', undefined, true),

  allBookings: (params: { status?: string; page?: number; limit?: number; search?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined) q.set(k, String(v)); });
    return request<PaginatedResponse<ApiBooking>>('GET', `/admin/bookings?${q.toString()}`, undefined, true);
  },

  allUsers: () => request<ApiResponse<AuthUser[]>>('GET', '/admin/users', undefined, true),

  allPackages: () => request<ApiResponse<ApiHolidayPackage[]>>('GET', '/admin/packages', undefined, true),

  toggleUser: (id: string) =>
    request<ApiResponse<AuthUser>>('PATCH', `/admin/users/${id}/toggle`, undefined, true)
};

// ─── Config ────────────────────────────────────────────────────────────────────
export interface ApiHolidayConfig {
  groupDiscountPercent: number;
  tourManagerIncludedByDefault: boolean;
  supportHelpline: string;
  whatsappInquiryNumber: string;
  enableInstantBooking: boolean;
  heroHeadline: string;
  heroSubheading: string;
  featuredDestinations: Array<{ name: string; imageUrl: string }> | string[];
  announcementBanner?: string;
  announcementBannerEnabled: boolean;
  assuranceTitle?: string;
  assuranceBadges?: string[];
  trustPillars?: Array<{ icon: string; title: string; description: string }>;
  loyaltyPointsRate?: number;
  hotelTierMultiplierComfort?: number;
  hotelTierMultiplierSuperior?: number;
  hotelTierMultiplierLuxury?: number;
}

export interface ApiHolidayConfigAdmin extends ApiHolidayConfig {
  partnerMarkupPercent: number;
}

export const configApi = {
  getPublic: () => request<ApiResponse<ApiHolidayConfig>>('GET', '/config/holiday'),

  getAdmin: () => request<ApiResponse<ApiHolidayConfigAdmin>>('GET', '/config/holiday/admin', undefined, true),

  update: (data: Partial<ApiHolidayConfigAdmin>) =>
    request<ApiResponse<ApiHolidayConfigAdmin>>('PUT', '/config/holiday', data, true)
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsApi = {
  createOrder: (bookingId: string) =>
    request<ApiResponse<{ orderId: string; amount: number; currency: string; key: string }>>('POST', '/payments/create-order', { bookingId }, true),
  verify: (bookingId: string) =>
    request<ApiResponse<ApiBooking>>('POST', '/payments/verify', { bookingId }, true)
};

// ─── Health ────────────────────────────────────────────────────────────────────
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
};
