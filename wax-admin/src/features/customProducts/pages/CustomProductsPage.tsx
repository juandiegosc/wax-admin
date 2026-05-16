import { useState } from 'react';
import { CustomProductTable } from '@/features/customProducts/components/CustomProductTable';
import { useCustomProducts } from '@/features/customProducts/hooks/useCustomProducts';
import { CUSTOM_PRODUCT_STATUS } from '@/features/customProducts/types/customProduct';

const STATUS_LABELS: Record<string, string> = {
  PendingQuotation: 'Pendiente',
  AwaitingAdminReview: 'Requiere revision',
  AwaitingCustomerReview: 'Esperando cliente',
  Approved: 'Aprobado',
  Rejected: 'Rechazado',
  AddedToBasket: 'En carrito',
};

export const CustomProductsPage = () => {
  const [status, setStatus] = useState('AwaitingAdminReview');

  const { data, isLoading } = useCustomProducts({
    status: status || undefined,
  });

  return (
    <div className="admin-catalog">
      <div className="admin-catalog-header">
        <div className="admin-filters">
          <select
            className="admin-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos</option>
            {CUSTOM_PRODUCT_STATUS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="admin-canvas" aria-label="Cargando cotizaciones" />
      ) : (
        <CustomProductTable items={data ?? []} />
      )}
    </div>
  );
};
