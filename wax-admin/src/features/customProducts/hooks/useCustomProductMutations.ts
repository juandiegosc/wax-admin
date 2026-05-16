import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { customProductApi } from '@/features/customProducts/api/customProductApi';
import { mutationKeys, queryKeys } from '@/lib/queryKeys';

export const useProposePrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.customProducts.propose,
    mutationFn: customProductApi.proposePrice,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customProducts.all });
      queryClient.setQueryData(queryKeys.customProducts.detail(data.id), data);
      toast.success('Precio propuesto correctamente');
    },
    onError: () => {
      toast.error('Error al proponer el precio');
    },
  });
};

export const useRejectCustomProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.customProducts.reject,
    mutationFn: customProductApi.reject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customProducts.all });
      toast.success('Cotizacion rechazada');
    },
    onError: () => {
      toast.error('Error al rechazar la cotizacion');
    },
  });
};

export const useApproveCustomProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.customProducts.approve,
    mutationFn: customProductApi.approve,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.customProducts.all });
      queryClient.setQueryData(queryKeys.customProducts.detail(data.id), data);
      toast.success('Propuesta aprobada');
    },
    onError: () => {
      toast.error('Error al aprobar la propuesta');
    },
  });
};
