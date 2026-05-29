import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyLabel?: string;
  /** Hace la card más ancha en el grid (2 columnas) */
  wide?: boolean;
  children: ReactNode;
};

export const ReportCard = ({
  title,
  subtitle,
  isLoading,
  isError,
  isEmpty,
  emptyLabel = 'Sin datos para mostrar',
  wide,
  children,
}: Props) => (
  <section className={`report-card${wide ? ' report-card--wide' : ''}`}>
    <header className="report-card-head">
      <h3 className="report-card-title">{title}</h3>
      {subtitle && <p className="report-card-subtitle">{subtitle}</p>}
    </header>

    <div className="report-card-body">
      {isLoading ? (
        <div className="report-card-state">Cargando…</div>
      ) : isError ? (
        <div className="report-card-state report-card-state--error">No se pudo cargar este reporte</div>
      ) : isEmpty ? (
        <div className="report-card-state">{emptyLabel}</div>
      ) : (
        children
      )}
    </div>
  </section>
);
