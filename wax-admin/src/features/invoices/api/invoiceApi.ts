import agent from '@/lib/api/agent';
import type { InvoiceListResult } from '@/features/invoices/types/invoice';

export const invoiceApi = {
  getInvoices: async (): Promise<InvoiceListResult> => {
    const response = await agent.get<InvoiceListResult>('/Reports/invoices');
    return response.data;
  },
};
