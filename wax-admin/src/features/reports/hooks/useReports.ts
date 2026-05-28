import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/features/reports/api/reportsApi';
import { queryKeys } from '@/lib/queryKeys';
import type { DateRangeParams } from '@/features/reports/types/reports';

// Rango por defecto: últimos 30 días (UTC). 'to' es exclusivo en el backend, por eso +1 día.
export const defaultRange = (): DateRangeParams => {
  const to = new Date();
  to.setUTCHours(0, 0, 0, 0);
  to.setUTCDate(to.getUTCDate() + 1); // exclusivo → incluye hoy
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 31);
  return { from: from.toISOString(), to: to.toISOString() };
};

const STALE = 1000 * 60 * 2; // 2 min — los reportes son cacheables a corto plazo

export const useOrdersSummary = () =>
  useQuery({ queryKey: queryKeys.reports.ordersSummary(), queryFn: reportsApi.ordersSummary, staleTime: STALE });

export const useOrdersByDate = (range: DateRangeParams) =>
  useQuery({ queryKey: queryKeys.reports.ordersByDate(range), queryFn: () => reportsApi.ordersByDate(range), staleTime: STALE });

export const useOrdersByStatus = () =>
  useQuery({ queryKey: queryKeys.reports.ordersByStatus(), queryFn: reportsApi.ordersByStatus, staleTime: STALE });

export const useTopBuyers = (limit = 10) =>
  useQuery({ queryKey: queryKeys.reports.topBuyers(limit), queryFn: () => reportsApi.topBuyers(limit), staleTime: STALE });

export const usePaymentsSummary = () =>
  useQuery({ queryKey: queryKeys.reports.paymentsSummary(), queryFn: reportsApi.paymentsSummary, staleTime: STALE });

export const useProductsStock = (threshold = 10) =>
  useQuery({ queryKey: queryKeys.reports.productsStock(threshold), queryFn: () => reportsApi.productsStock(threshold), staleTime: STALE });

export const useProductsByTypeBrand = () =>
  useQuery({ queryKey: queryKeys.reports.productsByTypeBrand(), queryFn: reportsApi.productsByTypeBrand, staleTime: STALE });

export const useCustomProductsFunnel = () =>
  useQuery({ queryKey: queryKeys.reports.customProductsFunnel(), queryFn: reportsApi.customProductsFunnel, staleTime: STALE });

export const useCustomProductsPriceStats = () =>
  useQuery({ queryKey: queryKeys.reports.customProductsPriceStats(), queryFn: reportsApi.customProductsPriceStats, staleTime: STALE });

export const useSupportSummary = () =>
  useQuery({ queryKey: queryKeys.reports.supportSummary(), queryFn: reportsApi.supportSummary, staleTime: STALE });

export const useSupportByDate = (range: DateRangeParams) =>
  useQuery({ queryKey: queryKeys.reports.supportByDate(range), queryFn: () => reportsApi.supportByDate(range), staleTime: STALE });

export const useUsersSummary = () =>
  useQuery({ queryKey: queryKeys.reports.usersSummary(), queryFn: reportsApi.usersSummary, staleTime: STALE });
