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