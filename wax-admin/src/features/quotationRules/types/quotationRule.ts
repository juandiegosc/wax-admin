export type QuotationRule = {
  id: string;
  key: string;
  value: number;
  description: string | null;
  isActive: boolean;
  isDefault: boolean;
};

export type QuotationRuleParams = {
  activeOnly?: boolean;
};

// El backend no acepta isActive al crear (la regla nace activa)
export type CreateQuotationRulePayload = {
  key: string;
  value: number;
  description: string;
};

export type UpdateQuotationRulePayload = {
  id: string;
  value: number;
  description: string;
  isActive: boolean;
};
