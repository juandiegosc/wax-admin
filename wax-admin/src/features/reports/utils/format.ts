// Montos del backend en centavos → dólares USD
export const formatCents = (cents: number | null | undefined): string => {
  if (cents == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
};

export const formatNumber = (n: number | null | undefined): string =>
  n == null ? '—' : new Intl.NumberFormat('es-ES').format(n);

export const formatPercent = (n: number | null | undefined): string =>
  n == null ? '—' : `${n.toFixed(1)}%`;

// Fecha corta para ejes (ej. "02 may")
export const formatDateShort = (iso: string): string =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

// Etiquetas legibles de estados de orden
export const ORDER_STATUS_LABELS: Record<string, string> = {
  Pending: 'Pendiente',
  CustomOrder: 'Encargo',
  Approved: 'Aprobada',
  Rejected: 'Rechazada',
  PaymentRecieved: 'Pago recibido',
  PaymentFailed: 'Pago fallido',
  PaymentMismatch: 'Discrepancia',
};

// Etiquetas de estados de productos personalizados (funnel)
export const CUSTOM_STATUS_LABELS: Record<string, string> = {
  PendingQuotation: 'En proceso',
  AwaitingAdminReview: 'Revisión WAX',
  AwaitingCustomerReview: 'Espera cliente',
  Approved: 'Aprobada',
  Rejected: 'Rechazada',
  AddedToBasket: 'En carrito',
};

export const SUPPORT_CATEGORY_LABELS: Record<string, string> = {
  OrderIssue: 'Pedidos',
  PaymentIssue: 'Pagos',
  ProductIssue: 'Productos',
  Other: 'Otros',
};

// ── Paleta de data viz ────────────────────────────────────────────────────────
// Colores vívidos y distinguibles para charts y cifras grandes. Sale a propósito
// de la paleta brand (que es demasiado tonal) para que las leyendas sean legibles
// a primer vistazo. Inspirada en Tableau 10 — testeada para distinguibilidad,
// incluyendo deuteranopia/protanopia razonable.
export const CHART_COLORS = {
  blue:   '#2563EB',
  orange: '#EA580C',
  green:  '#16A34A',
  red:    '#DC2626',
  purple: '#7C3AED',
  teal:   '#0891B2',
  pink:   '#DB2777',
  amber:  '#D97706',
  // Neutros para ejes/grilla
  ink:    '#0f0f10',
  smoke:  '#71717a',
  stone:  '#d4d4d8',
};

// Secuencia para series categóricas (donuts, pies, barras múltiples)
export const CHART_SEQUENCE = [
  CHART_COLORS.blue,
  CHART_COLORS.orange,
  CHART_COLORS.green,
  CHART_COLORS.red,
  CHART_COLORS.purple,
  CHART_COLORS.teal,
  CHART_COLORS.pink,
  CHART_COLORS.amber,
];

// Recharts v3 tiene una intersección de tipos estricta en Tooltip formatter
// que rechaza signaturas simples. Este helper lo envuelve con un cast seguro
// porque sabemos qué tipos pasan los charts a nivel runtime.
export const tooltipNumberFormatter = (label: string) =>
  ((value: number) => [formatNumber(value), label]) as never;
