import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { quotationRuleApi } from '@/features/quotationRules/api/quotationRuleApi';
import { mutationKeys, queryKeys } from '@/lib/queryKeys';

export const useCreateQuotationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.quotationRules.create,
    mutationFn: quotationRuleApi.createRule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.quotationRules.all });
      toast.success('Regla creada exitosamente');
    },
    onError: () => {
      toast.error('Error al crear la regla');
    },
  });
};

export const useUpdateQuotationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.quotationRules.update,
    mutationFn: quotationRuleApi.updateRule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.quotationRules.all });
      toast.success('Regla actualizada exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar la regla');
    },
  });
};

export const useDeleteQuotationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.quotationRules.delete,
    mutationFn: quotationRuleApi.deleteRule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.quotationRules.all });
      toast.success('Regla eliminada exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar la regla');
    },
  });
};
