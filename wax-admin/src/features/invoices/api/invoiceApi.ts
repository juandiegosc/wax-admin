import agent from '@/lib/api/agent';
import type { InvoiceDetail, InvoiceListResult } from '@/features/invoices/types/invoice';

export const invoiceApi = {
  getInvoices: async (): Promise<InvoiceListResult> => {
    const response = await agent.get<InvoiceListResult>('/Reports/invoices');
    return response.data;
  },

  getInvoice: async (id: string): Promise<InvoiceDetail> => {
    const response = await agent.get<InvoiceDetail>(`/Reports/invoices/${id}`);
    return response.data;
  },
};
