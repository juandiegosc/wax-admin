import agent from '@/lib/api/agent';
import type {
  OrdersSummaryReportDto,
  OrdersByDateReportDto,
  OrdersByStatusReportDto,
  TopBuyerReportDto,
  PaymentsSummaryReportDto,
  ProductsStockReportDto,
  ProductsByTypeBrandReportDto,
  CustomProductsFunnelReportDto,
  CustomProductsPriceStatsReportDto,
  SupportSummaryReportDto,
  SupportByDateReportDto,
  UsersSummaryReportDto,
  DateRangeParams,
} from '@/features/reports/types/reports';

export const reportsApi = {
  // ── Orders ──────────────────────────────────────────────────────────────
  ordersSummary: async (): Promise<OrdersSummaryReportDto> => {
    const res = await agent.get<OrdersSummaryReportDto>('/Reports/orders/summary');
    return res.data;
  },

  ordersByDate: async (params: DateRangeParams): Promise<OrdersByDateReportDto[]> => {
    const res = await agent.get<OrdersByDateReportDto[]>('/Reports/orders/by-date', {
      params: { ...params, granularity: 'Day' },
    });
    return res.data;
  },

  ordersByStatus: async (): Promise<OrdersByStatusReportDto[]> => {
    const res = await agent.get<OrdersByStatusReportDto[]>('/Reports/orders/by-status');
    return res.data;
  },

  topBuyers: async (limit = 10): Promise<TopBuyerReportDto[]> => {
    const res = await agent.get<TopBuyerReportDto[]>('/Reports/orders/top-buyers', {
      params: { limit },
    });
    return res.data;
  },

  // ── Payments ────────────────────────────────────────────────────────────
  paymentsSummary: async (): Promise<PaymentsSummaryReportDto> => {
    const res = await agent.get<PaymentsSummaryReportDto>('/Reports/payments/summary');
    return res.data;
  },

  // ── Products ────────────────────────────────────────────────────────────
  productsStock: async (threshold = 10): Promise<ProductsStockReportDto> => {
    const res = await agent.get<ProductsStockReportDto>('/Reports/products/stock', {
      params: { threshold },
    });
    return res.data;
  },

  productsByTypeBrand: async (): Promise<ProductsByTypeBrandReportDto[]> => {
    const res = await agent.get<ProductsByTypeBrandReportDto[]>('/Reports/products/by-type-brand');
    return res.data;
  },

  // ── Custom Products ───────────────────────────────────────────────────────
  customProductsFunnel: async (): Promise<CustomProductsFunnelReportDto[]> => {
    const res = await agent.get<CustomProductsFunnelReportDto[]>('/Reports/custom-products/funnel');
    return res.data;
  },

  customProductsPriceStats: async (): Promise<CustomProductsPriceStatsReportDto> => {
    const res = await agent.get<CustomProductsPriceStatsReportDto>('/Reports/custom-products/price-stats');
    return res.data;
  },

  // ── Support ───────────────────────────────────────────────────────────────
  supportSummary: async (): Promise<SupportSummaryReportDto> => {
    const res = await agent.get<SupportSummaryReportDto>('/Reports/support/summary');
    return res.data;
  },

  supportByDate: async (params: DateRangeParams): Promise<SupportByDateReportDto[]> => {
    const res = await agent.get<SupportByDateReportDto[]>('/Reports/support/by-date', { params });
    return res.data;
  },

  // ── Users ─────────────────────────────────────────────────────────────────
  usersSummary: async (): Promise<UsersSummaryReportDto> => {
    const res = await agent.get<UsersSummaryReportDto>('/Reports/users/summary');
    return res.data;
  },
};
