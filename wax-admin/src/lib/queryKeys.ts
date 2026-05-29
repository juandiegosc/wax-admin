import type { ProductParams } from '@/features/catalog/types/product';
import type { TicketParams } from '@/features/support/types/support';
import type { CustomProductParams } from '@/features/customProducts/types/customProduct';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'current-user'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: ProductParams) => [...queryKeys.products.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => [...queryKeys.users.all, 'list'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params: { pageSize?: number; filter?: string }) =>
      [...queryKeys.orders.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
  support: {
    all: ['support'] as const,
    list: (params: TicketParams) => [...queryKeys.support.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.support.all, 'detail', id] as const,
    comments: (ticketId: string) => [...queryKeys.support.all, 'comments', ticketId] as const,
  },
  customProducts: {
    all: ['custom-products'] as const,
    list: (params: CustomProductParams) => [...queryKeys.customProducts.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.customProducts.all, 'detail', id] as const,
  },
  reports: {
    all: ['reports'] as const,
    ordersSummary: () => [...queryKeys.reports.all, 'orders-summary'] as const,
    ordersByDate: (range: { from: string; to: string }) => [...queryKeys.reports.all, 'orders-by-date', range] as const,
    ordersByStatus: () => [...queryKeys.reports.all, 'orders-by-status'] as const,
    topBuyers: (limit: number) => [...queryKeys.reports.all, 'top-buyers', limit] as const,
    paymentsSummary: () => [...queryKeys.reports.all, 'payments-summary'] as const,
    productsStock: (threshold: number) => [...queryKeys.reports.all, 'products-stock', threshold] as const,
    productsByTypeBrand: () => [...queryKeys.reports.all, 'products-by-type-brand'] as const,
    customProductsFunnel: () => [...queryKeys.reports.all, 'custom-products-funnel'] as const,
    customProductsPriceStats: () => [...queryKeys.reports.all, 'custom-products-price-stats'] as const,
    supportSummary: () => [...queryKeys.reports.all, 'support-summary'] as const,
    supportByDate: (range: { from: string; to: string }) => [...queryKeys.reports.all, 'support-by-date', range] as const,
    usersSummary: () => [...queryKeys.reports.all, 'users-summary'] as const,
  },
} as const;

export const mutationKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
  },
  products: {
    create: ['products', 'create'] as const,
    update: ['products', 'update'] as const,
    delete: ['products', 'delete'] as const,
  },
  users: {
    addRole: ['users', 'add-role'] as const,
    removeRole: ['users', 'remove-role'] as const,
    disable: ['users', 'disable'] as const,
    enable: ['users', 'enable'] as const,
  },
  support: {
    create: ['support', 'create'] as const,
    update: ['support', 'update'] as const,
    delete: ['support', 'delete'] as const,
    sendComment: ['support', 'send-comment'] as const,
  },
  customProducts: {
    propose: ['custom-products', 'propose'] as const,
    reject: ['custom-products', 'reject'] as const,
    approve: ['custom-products', 'approve'] as const,
  },
} as const;