// Contrato del backend: GET /Reports/invoices → InvoiceListResult.
// Total es decimal en la moneda (no centavos). FacturaPlan pagina por
// defecto (limit=20) aunque no lo documente.
export type InvoiceCustomer = {
  identification?: string | null;
  identificationType?: string | null;
  legalName?: string | null;
};

export type InvoiceSummary = {
  id: string;
  accessKey?: string | null;
  sequential?: string | null;
  status?: string | null;
  total?: number | null;
  issueDate?: string | null;
  createdAt?: string | null;
  customer?: InvoiceCustomer | null;
};

export type InvoiceListMeta = {
  total?: number | null;
  page?: number | null;
  limit?: number | null;
  totalPages?: number | null;
};

export type InvoiceListResult = {
  items: InvoiceSummary[];
  meta?: InvoiceListMeta | null;
};
