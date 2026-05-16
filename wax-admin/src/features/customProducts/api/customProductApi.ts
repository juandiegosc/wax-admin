import agent from '@/lib/api/agent';
import type {
  CustomProductDto,
  CustomProductParams,
  ProposeAmountDto,
} from '@/features/customProducts/types/customProduct';

export const customProductApi = {
  getAll: async (params: CustomProductParams): Promise<CustomProductDto[]> => {
    const response = await agent.get<CustomProductDto[]>('/CustomProduct/admin', { params });
    return response.data;
  },

  getById: async (id: string): Promise<CustomProductDto> => {
    const response = await agent.get<CustomProductDto>(`/CustomProduct/${id}`);
    return response.data;
  },

  proposePrice: async ({
    id,
    ...dto
  }: ProposeAmountDto & { id: string }): Promise<CustomProductDto> => {
    const response = await agent.post<CustomProductDto>(
      `/CustomProduct/${id}/admin/proposals`,
      dto,
    );
    return response.data;
  },

  reject: async ({ id, reason }: { id: string; reason: string }): Promise<void> => {
    await agent.post(`/CustomProduct/${id}/admin/reject`, { reason });
  },

  approve: async (id: string): Promise<CustomProductDto> => {
    const response = await agent.post<CustomProductDto>(`/CustomProduct/${id}/approve`);
    return response.data;
  },
};
