import { useQuery } from '@tanstack/react-query';
import { customProductApi } from '@/features/customProducts/api/customProductApi';
import { queryKeys } from '@/lib/queryKeys';
import type { CustomProductParams } from '@/features/customProducts/types/customProduct';

export const useCustomProducts = (params: CustomProductParams) => {
  return useQuery({
    queryKey: queryKeys.customProducts.list(params),
    queryFn: () => customProductApi.getAll(params),
  });
};

export const useCustomProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.customProducts.detail(id),
    queryFn: () => customProductApi.getById(id),
    enabled: !!id,
  });
};
