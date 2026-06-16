import { useQuery } from '@tanstack/react-query';
import { invoiceApi } from '@/features/invoices/api/invoiceApi';
import { queryKeys } from '@/lib/queryKeys';

export const useInvoices = () => {
  return useQuery({
    queryKey: queryKeys.invoices.list(),
    queryFn: invoiceApi.getInvoices,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => invoiceApi.getInvoice(id),
    enabled: !!id,
  });
};
