import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customProductApi } from '@/features/customProducts/api/customProductApi';

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('@/lib/api/agent', () => ({
  default: { get: mockGet, post: mockPost },
}));

const makeProduct = (overrides = {}) => ({
  id: 'prod-001',
  name: 'Bolso personalizado',
  description: 'Diseño generado por IA',
  glbUrl: 'https://cdn.meshy.ai/model.glb',
  taskId: 'task-001',
  ownerUserId: 'user-001',
  status: 'AwaitingAdminReview',
  agreedPrice: null,
  design: { type: 'bolsa', material: 'cuero', color: 'negro', shape: 'rectangular', dimensions: '30x20cm', details: '' },
  proposals: [],
  createdAt: '2026-05-14T00:00:00Z',
  updatedAt: null,
  ...overrides,
});

describe('customProductApi (admin)', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('llama a GET /CustomProduct/admin con los params dados', async () => {
      mockGet.mockResolvedValue({ data: [makeProduct()] });

      const result = await customProductApi.getAll({ status: 'AwaitingAdminReview' });

      expect(mockGet).toHaveBeenCalledWith('/CustomProduct/admin', { params: { status: 'AwaitingAdminReview' } });
      expect(result).toHaveLength(1);
    });

    it('devuelve lista vacía si no hay resultados', async () => {
      mockGet.mockResolvedValue({ data: [] });

      const result = await customProductApi.getAll({});

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('llama a GET /CustomProduct/:id y devuelve el producto', async () => {
      mockGet.mockResolvedValue({ data: makeProduct({ id: 'prod-042' }) });

      const result = await customProductApi.getById('prod-042');

      expect(mockGet).toHaveBeenCalledWith('/CustomProduct/prod-042');
      expect(result.id).toBe('prod-042');
    });
  });

  describe('proposePrice', () => {
    it('llama a POST /CustomProduct/:id/admin/proposals con amount y comment', async () => {
      const updated = makeProduct({ status: 'AwaitingCustomerReview' });
      mockPost.mockResolvedValue({ data: updated });

      const result = await customProductApi.proposePrice({ id: 'prod-001', amount: 55000, comment: 'Precio justo' });

      expect(mockPost).toHaveBeenCalledWith(
        '/CustomProduct/prod-001/admin/proposals',
        { amount: 55000, comment: 'Precio justo' },
      );
      expect(result.status).toBe('AwaitingCustomerReview');
    });

    it('funciona sin comentario', async () => {
      mockPost.mockResolvedValue({ data: makeProduct() });

      await customProductApi.proposePrice({ id: 'prod-001', amount: 40000 });

      expect(mockPost).toHaveBeenCalledWith('/CustomProduct/prod-001/admin/proposals', { amount: 40000 });
    });
  });

  describe('reject', () => {
    it('llama a POST /CustomProduct/:id/admin/reject con el motivo', async () => {
      mockPost.mockResolvedValue({ data: null });

      await customProductApi.reject({ id: 'prod-001', reason: 'No cumple requisitos' });

      expect(mockPost).toHaveBeenCalledWith(
        '/CustomProduct/prod-001/admin/reject',
        { reason: 'No cumple requisitos' },
      );
    });
  });

  describe('approve', () => {
    it('llama a POST /CustomProduct/:id/approve y devuelve el producto aprobado', async () => {
      const approved = makeProduct({ status: 'Approved', agreedPrice: 55000 });
      mockPost.mockResolvedValue({ data: approved });

      const result = await customProductApi.approve('prod-001');

      expect(mockPost).toHaveBeenCalledWith('/CustomProduct/prod-001/approve');
      expect(result.status).toBe('Approved');
      expect(result.agreedPrice).toBe(55000);
    });
  });
});
