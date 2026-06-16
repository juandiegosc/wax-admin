import agent from '@/lib/api/agent';
import type {
  CreateQuotationRulePayload,
  QuotationRule,
  QuotationRuleParams,
  UpdateQuotationRulePayload,
} from '@/features/quotationRules/types/quotationRule';

export const quotationRuleApi = {
  getRules: async (params: QuotationRuleParams = {}): Promise<QuotationRule[]> => {
    const response = await agent.get<QuotationRule[]>('/QuotationRules', { params });
    return response.data;
  },

  getRule: async (id: string): Promise<QuotationRule> => {
    const response = await agent.get<QuotationRule>(`/QuotationRules/${id}`);
    return response.data;
  },

  createRule: async (data: CreateQuotationRulePayload): Promise<QuotationRule> => {
    const response = await agent.post<QuotationRule>('/QuotationRules', data);
    return response.data;
  },

  updateRule: async ({ id, ...data }: UpdateQuotationRulePayload): Promise<void> => {
    await agent.put(`/QuotationRules/${id}`, data);
  },

  deleteRule: async (id: string): Promise<void> => {
    await agent.delete(`/QuotationRules/${id}`);
  },
};
