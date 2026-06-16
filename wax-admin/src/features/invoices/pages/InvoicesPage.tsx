import { useNavigate } from 'react-router';
import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import type { InvoiceSummary } from '@/features/invoices/types/invoice';

const formatDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

// Total viene en la moneda (decimal), no en centavos
const formatTotal = (total?: number | null): string =>
  total == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

const invoiceDate = (invoice: InvoiceSummary): string => formatDate(invoice.issueDate ?? invoice.createdAt);

const customerLabel = (invoice: InvoiceSummary): string =>
  invoice.customer?.legalName ?? invoice.customer?.identification ?? '—';

export const InvoicesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useInvoices();
  const invoices = data?.items ?? [];

  if (isLoading) {
    return <div className="admin-canvas" aria-label="Cargando facturas" />;
  }

  if (invoices.length === 0) {
    return (
      <div className="admin-empty-state">
        <p>No hay facturas registradas</p>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Secuencial</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="admin-table-row-link"
              onClick={() => navigate(`/invoices/${invoice.id}`)}
            >
              <td>{invoice.sequential ?? invoice.accessKey ?? invoice.id}</td>
              <td>{customerLabel(invoice)}</td>
              <td>{invoiceDate(invoice)}</td>
              <td>{formatTotal(invoice.total)}</td>
              <td>{invoice.status ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
