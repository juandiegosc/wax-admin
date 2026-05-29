// DTOs del módulo de reportería (Dashboard de Trazabilidad).
// Todos los montos vienen en centavos (dividir entre 100 para mostrar).
// Fechas en ISO 8601 UTC.

export type OrdersByStatusReportDto = {
  status: string;
  count: number;
  revenue: number;
  percentage: number;
};

export type OrdersSummaryReportDto = {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  byStatus: OrdersByStatusReportDto[];
};

export type OrdersByDateReportDto = {
  date: string;
  orderCount: number;
  revenue: number;
};

export type TopBuyerReportDto = {
  buyerEmail: string;
  userId: string | null;
  orderCount: number;
  totalRevenue: number;
};

export type PaymentsSummaryReportDto = {
  confirmedCount: number;
  confirmedAmount: number;
  failedCount: number;
  failedAmount: number;
  mismatchCount: number;
  mismatchAmount: number;
};

export type ProductsStockReportDto = {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  inStock: number;
};

export type ProductsByTypeBrandReportDto = {
  type: string;
  brand: string;
  count: number;
};

export type CustomProductsFunnelReportDto = {
  status: string;
  count: number;
};

export type CustomProductsPriceStatsReportDto = {
  approvedCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  averagePrice: number | null;
};

export type SupportSummaryReportDto = {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  byCategory: Record<string, number>;
};

export type SupportByDateReportDto = {
  date: string;
  ticketCount: number;
};

export type UsersSummaryReportDto = {
  totalUsers: number;
  confirmedEmails: number;
  byRole: Record<string, number>;
};

export type DateRangeParams = {
  from: string;
  to: string;
};
