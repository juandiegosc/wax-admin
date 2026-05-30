import { useNavigate } from 'react-router';
import type { OrderDto } from '@/features/orders/types/order';

type OrderTableProps = {
  orders: OrderDto[];
};

const STATUS_LABELS: Record<string, string> = {
  Pending: 'Pendiente',
  PaymentRecieved: 'Pago recibido',
  PaymentFailed: 'Pago fallido',
  PaymentMismatch: 'Pago inconsistente',
  Approved: 'Aprobado',
  Rejected: 'Rechazado',
  CustomOrder: 'Orden personalizada',
};

const STATUS_CLASS: Record<string, string> = {
  Pending: 'is-draft',
  PaymentRecieved: 'is-live',
  Approved: 'is-live',
  PaymentFailed: 'is-alert',
  PaymentMismatch: 'is-alert',
  Rejected: 'is-alert',
  CustomOrder: 'is-draft',
};

const formatPrice = (cents: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
};

const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const OrderTable = ({ orders }: OrderTableProps) => {
  const navigate = useNavigate();

  if (!orders || orders.length === 0) {
    return (
      <div className="admin-empty-state">
        <p>No se encontraron pedidos</p>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Comprador</th>
            <th>Items</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <span style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  {order.id.slice(0, 8)}...
                </span>
              </td>
              <td>{order.buyerEmail}</td>
              <td>{order.orderItems.length}</td>
              <td>{formatPrice(order.total)}</td>
              <td>
                <span className={`admin-status ${STATUS_CLASS[order.orderStatus] ?? ''}`}>
                  {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                </span>
              </td>
              <td>{formatDate(order.createdAt)}</td>
              <td>
                <button
                  type="button"
                  className="admin-button admin-button-sm"
                  onClick={() => navigate(`/orders/${order.id}`)}
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
