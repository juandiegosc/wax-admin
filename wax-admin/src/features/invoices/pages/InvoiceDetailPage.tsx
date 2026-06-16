import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useInvoice } from '@/features/invoices/hooks/useInvoices';
import { routePaths } from '@/routes/routePaths';

const formatDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const formatMoney = (n?: number | null): string =>
  n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError } = useInvoice(id!);

  useEffect(() => {
    if (isError) {
      toast.error('Factura no encontrada');
      navigate(routePaths.invoices, { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return <div className="admin-canvas" aria-label="Cargando factura" />;
  }

  if (!invoice) return null;

  return (
    <div className="admin-content">
      <div className="admin-catalog-header">
        <h2 className="admin-topbar-title">
          Factura {invoice.sequential ?? invoice.accessKey ?? invoice.id}
        </h2>
        <button
          type="button"
          className="admin-button admin-button-ghost"
          onClick={() => navigate(routePaths.invoices)}
        >
          Volver
        </button>
      </div>

      <div className="admin-panel-grid">
        <div className="admin-card">
          <span className="admin-card-label">Cliente</span>
          <p className="admin-card-text">{invoice.customer?.legalName ?? '—'}</p>
          <p className="admin-card-text">
            {invoice.customer?.identificationType ?? ''} {invoice.customer?.identification ?? ''}
          </p>
        </div>

        <div className="admin-card">
          <span className="admin-card-label">Resumen</span>
          <p className="admin-card-text">Fecha: {formatDate(invoice.issueDate ?? invoice.createdAt)}</p>
          <p className="admin-card-text">Estado: {invoice.status ?? '—'}</p>
          <p className="admin-card-value">{formatMoney(invoice.total)}</p>
        </div>
      </div>

      <div className="admin-table-card">
        <span className="admin-table-caption">Detalle</span>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Impuesto</th>
            </tr>
          </thead>
          <tbody>
            {invoice.details.length === 0 ? (
              <tr>
                <td colSpan={5}>Sin líneas de detalle</td>
              </tr>
            ) : (
              invoice.details.map((line, i) => (
                <tr key={`${line.code ?? 'line'}-${i}`}>
                  <td>{line.code ?? '—'}</td>
                  <td>{line.description ?? '—'}</td>
                  <td>{line.quantity ?? '—'}</td>
                  <td>{formatMoney(line.unitPrice)}</td>
                  <td>{formatMoney(line.tax)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-card">
        <span className="admin-table-caption">Métodos de pago</span>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Método</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {invoice.paymentMethods.length === 0 ? (
              <tr>
                <td colSpan={2}>Sin métodos de pago</td>
              </tr>
            ) : (
              invoice.paymentMethods.map((pm, i) => (
                <tr key={`${pm.method ?? 'pm'}-${i}`}>
                  <td>{pm.method ?? '—'}</td>
                  <td>{formatMoney(pm.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
