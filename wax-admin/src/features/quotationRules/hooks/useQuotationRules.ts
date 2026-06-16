import { useQuery } from '@tanstack/react-query';
import { quotationRuleApi } from '@/features/quotationRules/api/quotationRuleApi';
import { queryKeys } from '@/lib/queryKeys';
import type { QuotationRuleParams } from '@/features/quotationRules/types/quotationRule';

export const useQuotationRules = (params: QuotationRuleParams = {}) => {
  return useQuery({
    queryKey: queryKeys.quotationRules.list(params),
    queryFn: () => quotationRuleApi.getRules(params),
  });
};
