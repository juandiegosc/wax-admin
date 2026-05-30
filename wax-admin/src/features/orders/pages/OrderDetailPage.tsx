import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useOrder } from '@/features/orders/hooks/useOrders';
import { routePaths } from '@/routes/routePaths';

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
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrder(id!);

  useEffect(() => {
    if (isError) {
      toast.error('Pedido no encontrado');
      navigate(routePaths.orders, { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return <div className="admin-canvas" aria-label="Cargando pedido" />;
  }

  if (!order) return null;

  const address = order.billingAddress;
  const payment = order.paymentSummary;

  return (
    <div className="admin-ticket-detail">
      <div className="admin-product-page-header">
        <div className="admin-ticket-detail-top">
          <div>
            <span className="admin-section-label">Pedidos</span>
            <h2 className="admin-product-page-title">Pedido #{order.id.slice(0, 8)}</h2>
          </div>
          <div className="admin-table-actions">
            <span className={`admin-status ${STATUS_CLASS[order.orderStatus] ?? ''}`}>
              {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
            </span>
            <button
              type="button"
              className="admin-button admin-button-ghost"
              onClick={() => navigate(routePaths.orders)}
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <div className="admin-order-summary-grid">
        <div className="admin-card">
          <span className="admin-form-label">Comprador</span>
          <p>{order.buyerEmail}</p>
        </div>
        <div className="admin-card">
          <span className="admin-form-label">Fecha</span>
          <p>{formatDate(order.createdAt)}</p>
          {order.updatedAt && (
            <p style={{ color: 'var(--wax-admin-muted)', fontSize: '0.82rem' }}>
              Actualizado: {formatDate(order.updatedAt)}
            </p>
          )}
        </div>
        <div className="admin-card">
          <span className="admin-form-label">Pago</span>
          <p style={{ textTransform: 'capitalize' }}>
            {payment.brand} **** {payment.last4}
          </p>
          <p style={{ color: 'var(--wax-admin-muted)', fontSize: '0.82rem' }}>
            Exp: {payment.expMonth}/{payment.expYear}
          </p>
        </div>
      </div>

      <div className="admin-order-body">
        <div className="admin-table-card">
          <span className="admin-form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
            Productos
          </span>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-order-totals">
            <div className="admin-order-total-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="admin-order-total-row">
              <span>Envio</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="admin-order-total-row">
                <span>Descuento</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="admin-order-total-row admin-order-total-final">
              <strong>Total</strong>
              <strong>{formatPrice(order.total)}</strong>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <span className="admin-form-label">Direccion de facturacion</span>
          <p>{address.name}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
        </div>
      </div>
    </div>
  );
};
