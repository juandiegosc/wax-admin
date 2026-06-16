import { useMemo, useState } from 'react';
import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import type { InvoiceSummary } from '@/features/invoices/types/invoice';

const formatDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

// Total viene en la moneda (decimal), no en centavos
const formatTotal = (total?: number | null): string =>
  total == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

const invoiceDateIso = (invoice: InvoiceSummary): string | null =>
  invoice.issueDate ?? invoice.createdAt ?? null;

const invoiceDate = (invoice: InvoiceSummary): string => formatDate(invoiceDateIso(invoice));

const customerLabel = (invoice: InvoiceSummary): string =>
  invoice.customer?.legalName ?? invoice.customer?.identification ?? '—';

export const InvoicesPage = () => {
  const { data, isLoading } = useInvoices();
  const allInvoices = useMemo(() => data?.items ?? [], [data]);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const invoices = useMemo(() => {
    if (!from && !to) return allInvoices;
    // 'to' incluye todo el día seleccionado
    const fromTime = from ? new Date(from).setHours(0, 0, 0, 0) : null;
    const toTime = to ? new Date(to).setHours(23, 59, 59, 999) : null;
    return allInvoices.filter((invoice) => {
      const iso = invoiceDateIso(invoice);
      if (!iso) return false;
      const time = new Date(iso).getTime();
      if (fromTime != null && time < fromTime) return false;
      if (toTime != null && time > toTime) return false;
      return true;
    });
  }, [allInvoices, from, to]);

  const clearFilters = () => {
    setFrom('');
    setTo('');
  };

  if (isLoading) {
    return <div className="admin-canvas" aria-label="Cargando facturas" />;
  }

  return (
    <div className="admin-content">
      <div className="admin-filters">
        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="invoice-from">Desde</label>
          <input
            id="invoice-from"
            className="admin-form-input"
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="invoice-to">Hasta</label>
          <input
            id="invoice-to"
            className="admin-form-input"
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        {(from || to) && (
          <button type="button" className="admin-button admin-button-ghost admin-button-sm" onClick={clearFilters}>
            Limpiar
          </button>
        )}
        <span className="admin-table-note">
          {invoices.length} de {allInvoices.length} facturas
        </span>
      </div>

      {invoices.length === 0 ? (
        <div className="admin-empty-state">
          <p>{allInvoices.length === 0 ? 'No hay facturas registradas' : 'Sin facturas en ese rango de fechas'}</p>
        </div>
      ) : (
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
                <tr key={invoice.id}>
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
      )}
    </div>
  );
};
