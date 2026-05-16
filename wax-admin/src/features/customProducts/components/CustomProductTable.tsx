import { useNavigate } from 'react-router';
import type { CustomProductDto } from '@/features/customProducts/types/customProduct';
import { routePaths } from '@/routes/routePaths';

type Props = {
  items: CustomProductDto[];
};

const STATUS_LABELS: Record<string, string> = {
  PendingQuotation: 'Pendiente',
  AwaitingAdminReview: 'Requiere revision',
  AwaitingCustomerReview: 'Esperando cliente',
  Approved: 'Aprobado',
  Rejected: 'Rechazado',
  AddedToBasket: 'En carrito',
};

const STATUS_CLASS: Record<string, string> = {
  PendingQuotation: 'is-draft',
  AwaitingAdminReview: 'is-alert',
  AwaitingCustomerReview: 'is-draft',
  Approved: 'is-live',
  Rejected: 'is-alert',
  AddedToBasket: 'is-live',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

export const CustomProductTable = ({ items }: Props) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="admin-empty-state">
        <p>No hay cotizaciones con ese filtro</p>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo de diseno</th>
            <th>Estado</th>
            <th>Precio acordado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--wax-admin-muted)' }}>
                  {item.ownerUserId.slice(0, 8)}…
                </div>
              </td>
              <td>{item.design.type || '—'}</td>
              <td>
                <span className={`admin-status ${STATUS_CLASS[item.status] ?? ''}`}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </span>
              </td>
              <td>{item.agreedPrice != null ? formatPrice(item.agreedPrice) : '—'}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>
                <button
                  type="button"
                  className="admin-button admin-button-sm"
                  onClick={() =>
                    navigate(routePaths.quotationDetail.replace(':id', item.id))
                  }
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
