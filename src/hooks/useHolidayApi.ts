import { useState, useEffect, useCallback, useRef } from 'react';
import {
  packagesApi, bookingsApi, configApi,
  ApiHolidayPackage, ApiBooking, ApiHolidayConfig,
  PackageFilters, CreateBookingPayload,
  checkApiHealth
} from '../services/apiClient';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'offline';

export interface UseHolidayApiReturn {
  // State
  packages: ApiHolidayPackage[];
  featuredPackages: ApiHolidayPackage[];
  selectedPackage: ApiHolidayPackage | null;
  config: ApiHolidayConfig | null;
  myBookings: ApiBooking[];
  totalPackages: number;
  currentPage: number;
  totalPages: number;
  apiStatus: ApiStatus;
  errorMessage: string;
  isApiOnline: boolean;

  // Actions
  fetchPackages: (filters?: PackageFilters) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchPackageById: (id: string) => Promise<void>;
  fetchConfig: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  createBooking: (data: CreateBookingPayload) => Promise<{ success: boolean; booking?: ApiBooking; message?: string }>;
  setPage: (p: number) => void;
  filters: PackageFilters;
  setFilters: React.Dispatch<React.SetStateAction<PackageFilters>>;
  applyFilters: (f: PackageFilters) => void;
  clearSelectedPackage: () => void;
}

export const useHolidayApi = (): UseHolidayApiReturn => {
  const [packages, setPackages] = useState<ApiHolidayPackage[]>([]);
  const [featuredPackages, setFeaturedPackages] = useState<ApiHolidayPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ApiHolidayPackage | null>(null);
  const [config, setConfig] = useState<ApiHolidayConfig | null>(null);
  const [myBookings, setMyBookings] = useState<ApiBooking[]>([]);
  const [totalPackages, setTotalPackages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [filters, setFilters] = useState<PackageFilters>({ page: 1, limit: 12, sort: 'recommended' });
  const checkedOnline = useRef(false);

  // Check API availability once
  useEffect(() => {
    if (checkedOnline.current) return;
    checkedOnline.current = true;
    checkApiHealth().then(online => setIsApiOnline(online));
  }, []);

  const fetchPackages = useCallback(async (f?: PackageFilters) => {
    setApiStatus('loading');
    setErrorMessage('');
    try {
      const activeFilters = f || filters;
      const res = await packagesApi.list(activeFilters);
      setPackages(res.data);
      setTotalPackages(res.pagination.total);
      setCurrentPage(res.pagination.page);
      setTotalPages(res.pagination.pages);
      setApiStatus('success');
      setIsApiOnline(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load packages';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('NetworkError')) {
        setApiStatus('offline');
        setIsApiOnline(false);
      } else {
        setApiStatus('error');
        setErrorMessage(msg);
      }
    }
  }, [filters]);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await packagesApi.featured();
      setFeaturedPackages(res.data);
    } catch { /* silently ignore */ }
  }, []);

  const fetchPackageById = useCallback(async (id: string) => {
    setApiStatus('loading');
    try {
      const res = await packagesApi.getById(id);
      setSelectedPackage(res.data);
      setApiStatus('success');
    } catch (err) {
      setApiStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load package');
    }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await configApi.getPublic();
      setConfig(res.data);
    } catch { /* silently ignore */ }
  }, []);

  const fetchMyBookings = useCallback(async () => {
    try {
      const res = await bookingsApi.myBookings();
      setMyBookings(res.data);
    } catch { /* silently ignore */ }
  }, []);

  const createBooking = useCallback(async (data: CreateBookingPayload) => {
    try {
      const res = await bookingsApi.create(data);
      if (res.success) {
        return { success: true, booking: res.data };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Booking failed' };
    }
  }, []);

  const applyFilters = useCallback((f: PackageFilters) => {
    const merged = { ...f, page: 1 };
    setFilters(merged);
    fetchPackages(merged);
  }, [fetchPackages]);

  const setPage = useCallback((p: number) => {
    const updated = { ...filters, page: p };
    setFilters(updated);
    setCurrentPage(p);
    fetchPackages(updated);
  }, [filters, fetchPackages]);

  const clearSelectedPackage = useCallback(() => setSelectedPackage(null), []);

  return {
    packages, featuredPackages, selectedPackage, config, myBookings,
    totalPackages, currentPage, totalPages, apiStatus, errorMessage, isApiOnline,
    fetchPackages, fetchFeatured, fetchPackageById, fetchConfig, fetchMyBookings,
    createBooking, setPage, filters, setFilters, applyFilters, clearSelectedPackage
  };
};
