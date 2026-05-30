export const ORDER_STATUS = [
  'Pending',
  'PaymentRecieved',
  'PaymentFailed',
  'PaymentMismatch',
  'Approved',
  'Rejected',
  'CustomOrder',
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export type BillingAddressDto = {
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderItemDto = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type PaymentSummaryDto = {
  last4: number;
  brand: string;
  expMonth: number;
  expYear: number;
};

export type OrderDto = {
  id: string;
  buyerEmail: string;
  billingAddress: BillingAddressDto;
  orderItems: OrderItemDto[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderStatus: OrderStatus;
  paymentSummary: PaymentSummaryDto;
  createdAt: string;
  updatedAt: string | null;
};

export type OrderListResponse = {
  items: OrderDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
};

export type OrderParams = {
  pageNumber?: number;
  pageSize?: number;
  filter?: string;
};
