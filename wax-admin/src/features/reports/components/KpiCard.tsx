import { CHART_COLORS } from '@/features/reports/utils/format';

type Accent = 'ink' | 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'teal' | 'amber';

type Props = {
  label: string;
  value: string;
  hint?: string;
  accent?: Accent;
};

const ACCENT_COLOR: Record<Accent, string> = {
  ink:    CHART_COLORS.ink,
  blue:   CHART_COLORS.blue,
  orange: CHART_COLORS.orange,
  green:  CHART_COLORS.green,
  red:    CHART_COLORS.red,
  purple: CHART_COLORS.purple,
  teal:   CHART_COLORS.teal,
  amber:  CHART_COLORS.amber,
};

export const KpiCard = ({ label, value, hint, accent = 'ink' }: Props) => (
  <article className="report-kpi" style={{ borderLeft: `3px solid ${ACCENT_COLOR[accent]}` }}>
    <span className="report-kpi-label">{label}</span>
    <strong className="report-kpi-value" style={{ color: ACCENT_COLOR[accent] }}>
      {value}
    </strong>
    {hint && <span className="report-kpi-hint">{hint}</span>}
  </article>
);
