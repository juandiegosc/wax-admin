import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { KpiCard } from '@/features/reports/components/KpiCard';
import { ReportCard } from '@/features/reports/components/ReportCard';
import {
  useOrdersSummary, useOrdersByDate, useOrdersByStatus, useTopBuyers,
  usePaymentsSummary, useProductsStock, useProductsByTypeBrand,
  useCustomProductsFunnel, useCustomProductsPriceStats,
  useSupportSummary, useSupportByDate, useUsersSummary,
  defaultRange,
} from '@/features/reports/hooks/useReports';
import {
  formatCents, formatNumber, formatDateShort,
  ORDER_STATUS_LABELS, CUSTOM_STATUS_LABELS, SUPPORT_CATEGORY_LABELS,
  CHART_COLORS, CHART_SEQUENCE, tooltipNumberFormatter,
} from '@/features/reports/utils/format';
import { exportPanelToPdf, exportAllSectionsToPdf } from '@/features/reports/utils/pdfExport';

const axisStyle = { fontSize: 11, fill: CHART_COLORS.smoke };
const gridStroke = 'rgba(15, 15, 16, 0.06)';
const tooltipStyle = {
  background: '#faf9f6',
  border: '1px solid rgba(15,15,16,0.1)',
  borderRadius: 12,
  fontSize: 12,
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const PdfIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9 15 12 18 15 15" />
  </svg>
);

const TABS = [
  { id: 'orders', label: 'Órdenes' },
  { id: 'payments', label: 'Pagos' },
  { id: 'catalog', label: 'Catálogo' },
  { id: 'quotations', label: 'Cotizaciones' },
  { id: 'support', label: 'Soporte' },
  { id: 'users', label: 'Usuarios' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export const ReportsPageContent = () => {
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [isDownloading, setIsDownloading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const range = useMemo(() => defaultRange(), []);

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  const handleDownloadCurrent = async () => {
    if (!panelRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      await exportPanelToPdf(panelRef.current, currentTab.label, currentTab.id);
      toast.success(`Reporte de ${currentTab.label} descargado`);
    } catch {
      toast.error('No se pudo generar el PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await exportAllSectionsToPdf(
        TABS.map((t) => ({ id: t.id, label: t.label })),
        (id) => setActiveTab(id as TabId),
        () => panelRef.current,
      );
      toast.success('Reporte completo descargado');
    } catch {
      toast.error('No se pudo generar el PDF completo');
    } finally {
      setIsDownloading(false);
    }
  };

  // Todas las queries se disparan al montar — al cambiar de tab los datos ya están en caché.
  const ordersSummary = useOrdersSummary();
  const ordersByDate = useOrdersByDate(range);
  const ordersByStatus = useOrdersByStatus();
  const topBuyers = useTopBuyers(10);
  const payments = usePaymentsSummary();
  const stock = useProductsStock();
  const byTypeBrand = useProductsByTypeBrand();
  const funnel = useCustomProductsFunnel();
  const priceStats = useCustomProductsPriceStats();
  const support = useSupportSummary();
  const supportByDate = useSupportByDate(range);
  const users = useUsersSummary();

  // ── Transformaciones para los charts ──────────────────────────────────────
  const statusData = (ordersByStatus.data ?? [])
    .filter((s) => s.count > 0)
    .map((s) => ({ name: ORDER_STATUS_LABELS[s.status] ?? s.status, value: s.count, revenue: s.revenue }));

  const ordersTimeline = (ordersByDate.data ?? []).map((d) => ({
    date: formatDateShort(d.date),
    Pedidos: d.orderCount,
    Ingreso: d.revenue / 100,
  }));

  const stockData = stock.data
    ? [
        { name: 'En stock', value: stock.data.inStock, color: CHART_COLORS.green },
        { name: 'Bajo stock', value: stock.data.lowStock, color: CHART_COLORS.orange },
        { name: 'Agotados', value: stock.data.outOfStock, color: CHART_COLORS.red },
      ].filter((d) => d.value > 0)
    : [];

  const typeBrandData = (byTypeBrand.data ?? [])
    .map((d) => ({ name: `${d.type} · ${d.brand}`, value: d.count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const funnelData = (funnel.data ?? []).map((f) => ({
    name: CUSTOM_STATUS_LABELS[f.status] ?? f.status,
    value: f.count,
  }));

  const categoryData = support.data
    ? Object.entries(support.data.byCategory).map(([k, v]) => ({
        name: SUPPORT_CATEGORY_LABELS[k] ?? k,
        value: v,
      }))
    : [];

  const supportTimeline = (supportByDate.data ?? []).map((d) => ({
    date: formatDateShort(d.date),
    Tickets: d.ticketCount,
  }));

  const roleData = users.data
    ? Object.entries(users.data.byRole).map(([k, v]) => ({ name: k, value: v }))
    : [];

  return (
    <section className="reports-page">
      <header className="reports-header">
        <p className="reports-lead">
          Indicadores agregados de todo el sistema. Datos de los últimos 30 días donde aplica.
        </p>
      </header>

      <div className="reports-toolbar">
        <div className="reports-tabs" role="tablist" aria-label="Secciones de reportería">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`reports-tab${activeTab === t.id ? ' is-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="reports-actions">
          <button
            type="button"
            className="reports-download-btn"
            onClick={handleDownloadCurrent}
            disabled={isDownloading}
            title={`Descargar PDF de ${currentTab.label}`}
            aria-label={`Descargar PDF de ${currentTab.label}`}
          >
            <PdfIcon />
            <span className="reports-download-tag">PDF</span>
            <span className="reports-download-label">Sección actual</span>
          </button>
          <button
            type="button"
            className="reports-download-btn reports-download-btn--primary"
            onClick={handleDownloadAll}
            disabled={isDownloading}
            title="Descargar PDF con todas las secciones"
            aria-label="Descargar PDF con todas las secciones"
          >
            <PdfIcon />
            <span className="reports-download-tag">PDF</span>
            <span className="reports-download-label">{isDownloading ? 'Generando…' : 'Reporte completo'}</span>
          </button>
        </div>
      </div>

      {/* ── Órdenes ───────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="reports-panel" ref={panelRef}>
          <div className="reports-kpi-grid">
            <KpiCard label="Órdenes totales" value={formatNumber(ordersSummary.data?.totalOrders)} accent="blue" />
            <KpiCard label="Ingreso total" value={formatCents(ordersSummary.data?.totalRevenue)} hint="Todas las órdenes" accent="amber" />
            <KpiCard label="Promedio" value={formatCents(ordersSummary.data?.averageTicket)} accent="purple" />
          </div>

          <div className="reports-grid">
            <ReportCard
              title="Órdenes por estado"
              subtitle="Distribución del total de órdenes"
              isLoading={ordersByStatus.isLoading}
              isError={ordersByStatus.isError}
              isEmpty={statusData.length === 0}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} label={(e: { percent?: number }) => `${((e.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {statusData.map((d, i) => (
                    <Cell key={d.name} fill={CHART_SEQUENCE[i % CHART_SEQUENCE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={tooltipNumberFormatter('Órdenes')} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ReportCard>

            <ReportCard
              title="Órdenes por día"
              subtitle="Últimos 30 días"
              wide
              isLoading={ordersByDate.isLoading}
              isError={ordersByDate.isError}
              isEmpty={ordersTimeline.length === 0}
              emptyLabel="No hay órdenes en el rango"
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={ordersTimeline} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} />
                  <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="Pedidos" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ReportCard>

            <ReportCard
              title="Top compradores"
              subtitle="Por ingreso total"
              wide
              isLoading={topBuyers.isLoading}
              isError={topBuyers.isError}
              isEmpty={(topBuyers.data ?? []).length === 0}
            >
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Órdenes</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(topBuyers.data ?? []).map((b, i) => (
                    <tr key={b.buyerEmail}>
                      <td>{i + 1}</td>
                      <td>{b.buyerEmail}</td>
                      <td>{formatNumber(b.orderCount)}</td>
                      <td>{formatCents(b.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ReportCard>
          </div>
        </div>
      )}

      {/* ── Pagos ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="reports-panel" ref={panelRef}>
          <div className="reports-kpi-grid">
            <KpiCard label="Ingreso confirmado" value={formatCents(payments.data?.confirmedAmount)} hint={`${formatNumber(payments.data?.confirmedCount)} órdenes`} accent="green" />
            <KpiCard label="Pagos fallidos" value={formatCents(payments.data?.failedAmount)} hint={`${formatNumber(payments.data?.failedCount)} órdenes`} accent="red" />
            <KpiCard label="Con discrepancia" value={formatCents(payments.data?.mismatchAmount)} hint={`${formatNumber(payments.data?.mismatchCount)} órdenes`} accent="amber" />
          </div>
        </div>
      )}

      {/* ── Catálogo ──────────────────────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div className="reports-panel" ref={panelRef}>
          <div className="reports-grid">
            <ReportCard
              title="Niveles de inventario"
              subtitle={`Total: ${formatNumber(stock.data?.totalProducts)} productos`}
              isLoading={stock.isLoading}
              isError={stock.isError}
              isEmpty={stockData.length === 0}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={stockData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} label={(e: { percent?: number }) => `${((e.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {stockData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={tooltipNumberFormatter('Productos')} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ReportCard>

            <ReportCard
              title="Productos por tipo y marca"
              subtitle="Top 8 combinaciones"
              wide
              isLoading={byTypeBrand.isLoading}
              isError={byTypeBrand.isError}
              isEmpty={typeBrandData.length === 0}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={typeBrandData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} width={130} />
                  <Tooltip contentStyle={tooltipStyle} formatter={tooltipNumberFormatter('Productos')} />
                  <Bar dataKey="value" fill={CHART_COLORS.orange} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>
        </div>
      )}

      {/* ── Cotizaciones (custom products) ────────────────────────────────────── */}
      {activeTab === 'quotations' && (
        <div className="reports-panel" ref={panelRef}>
          <div className="reports-kpi-grid">
            <KpiCard label="Cotizaciones aprobadas" value={formatNumber(priceStats.data?.approvedCount)} accent="blue" />
            <KpiCard label="Precio promedio" value={formatCents(priceStats.data?.averagePrice)} accent="purple" />
            <KpiCard label="Precio mínimo" value={formatCents(priceStats.data?.minPrice)} accent="green" />
            <KpiCard label="Precio máximo" value={formatCents(priceStats.data?.maxPrice)} accent="red" />
          </div>

          <div className="reports-grid">
            <ReportCard
              title="Embudo de negociación"
              subtitle="Cuántas avanzan en el flujo"
              wide
              isLoading={funnel.isLoading}
              isError={funnel.isError}
              isEmpty={funnelData.every((f) => f.value === 0)}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={funnelData} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} width={110} />
                  <Tooltip contentStyle={tooltipStyle} formatter={tooltipNumberFormatter('Piezas')} />
                  <Bar dataKey="value" fill={CHART_COLORS.purple} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>
        </div>
      )}

      {/* ── Soporte ───────────────────────────────────────────────────────────── */}
      {activeTab === 'support' && (
        <div className="reports-panel" ref={panelRef}>
          <div className="reports-kpi-grid">
            <KpiCard label="Tickets totales" value={formatNumber(support.data?.total)} accent="ink" />
            <KpiCard label="Abiertos" value={formatNumber(support.data?.open)} accent="amber" />
            <KpiCard label="En progreso" value={formatNumber(support.data?.inProgress)} accent="ink" />
            <KpiCard label="Cerrados" value={formatNumber(support.data?.closed)} accent="green" />
          </div>

          <div className="reports-grid">
            <ReportCard
              title="Tickets por categoría"
              isLoading={support.isLoading}
              isError={support.isError}
              isEmpty={categoryData.every((c) => c.value === 0)}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} label={(e: { percent?: number }) => `${((e.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryData.map((d, i) => (
                    <Cell key={d.name} fill={CHART_SEQUENCE[i % CHART_SEQUENCE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={tooltipNumberFormatter('Tickets')} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ReportCard>

            <ReportCard
              title="Tickets por día"
              subtitle="Últimos 30 días"
              wide
              isLoading={supportByDate.isLoading}
              isError={supportByDate.isError}
              isEmpty={supportTimeline.length === 0}
              emptyLabel="No hay tickets en el rango"
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={supportTimeline} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                  <CartesianGrid stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="date" tick={axisStyle} tickLine={false} axisLine={false} />
                  <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="Tickets" stroke={CHART_COLORS.orange} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>
        </div>
      )}

      {/* ── Usuarios ──────────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="reports-panel" ref={panelRef}>
          <div className="reports-kpi-grid">
            <KpiCard label="Usuarios totales" value={formatNumber(users.data?.totalUsers)} accent="ink" />
            <KpiCard label="Emails verificados" value={formatNumber(users.data?.confirmedEmails)} accent="green" />
          </div>

          <div className="reports-grid">
            <ReportCard
              title="Usuarios por rol"
              isLoading={users.isLoading}
              isError={users.isError}
              isEmpty={roleData.every((r) => r.value === 0)}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} label={(e: { percent?: number }) => `${((e.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {roleData.map((d, i) => (
                    <Cell key={d.name} fill={CHART_SEQUENCE[i % CHART_SEQUENCE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={tooltipNumberFormatter('Usuarios')} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ReportCard>
          </div>
        </div>
      )}
    </section>
  );
};
