import { jsPDF } from 'jspdf';
import type { InvoiceSummary } from '@/features/invoices/types/invoice';

// Layout y paleta alineados con el PDF de Reportería (mismo lenguaje visual)
const MARGIN = 40;
const ACCENT = { r: 143, g: 115, b: 82 };
const INK = { r: 15, g: 15, b: 16 };
const SMOKE = { r: 113, g: 113, b: 122 };
const RULE = { r: 220, g: 220, b: 220 };
const BAND = { r: 242, g: 241, b: 237 };

const setFill = (pdf: jsPDF, c: { r: number; g: number; b: number }) => pdf.setFillColor(c.r, c.g, c.b);
const setDraw = (pdf: jsPDF, c: { r: number; g: number; b: number }) => pdf.setDrawColor(c.r, c.g, c.b);
const setText = (pdf: jsPDF, c: { r: number; g: number; b: number }) => pdf.setTextColor(c.r, c.g, c.b);

const formatDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const formatTotal = (total?: number | null): string =>
  total == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

const customerLabel = (inv: InvoiceSummary): string =>
  inv.customer?.legalName ?? inv.customer?.identification ?? '—';

const sequentialLabel = (inv: InvoiceSummary): string =>
  inv.sequential ?? inv.accessKey ?? inv.id;

const filenameDate = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
};

type RangeLabel = { from?: string; to?: string };

const rangeText = (range: RangeLabel): string => {
  if (!range.from && !range.to) return 'Todas las facturas';
  const from = range.from ? formatDate(range.from) : 'inicio';
  const to = range.to ? formatDate(range.to) : 'hoy';
  return `${from}  –  ${to}`;
};

export const exportInvoicesPdf = (invoices: InvoiceSummary[], range: RangeLabel): void => {
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Banda superior de acento
  setFill(pdf, ACCENT);
  pdf.rect(0, 0, pageW, 4, 'F');

  // Kicker + título editorial
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(pdf, SMOKE);
  pdf.text('WAX  ·  FACTURACIÓN', MARGIN, MARGIN + 8);

  pdf.setFont('times', 'normal');
  pdf.setFontSize(28);
  setText(pdf, INK);
  pdf.text('Facturas', MARGIN, MARGIN + 34);

  // Subtítulo: rango filtrado + total de registros
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  setText(pdf, SMOKE);
  pdf.text(`${rangeText(range)}   ·   ${invoices.length} ${invoices.length === 1 ? 'factura' : 'facturas'}`, MARGIN, MARGIN + 52);

  setDraw(pdf, RULE);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, MARGIN + 62, pageW - MARGIN, MARGIN + 62);

  // Columnas: secuencial, cliente, fecha, total, estado
  const cols = [
    { label: 'Secuencial', x: MARGIN, w: 90 },
    { label: 'Cliente', x: MARGIN + 95, w: 165 },
    { label: 'Fecha', x: MARGIN + 265, w: 80 },
    { label: 'Total', x: MARGIN + 350, w: 75 },
    { label: 'Estado', x: MARGIN + 430, w: 75 },
  ];

  let y = MARGIN + 88;

  const drawHeaderRow = () => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    setText(pdf, SMOKE);
    for (const c of cols) pdf.text(c.label.toUpperCase(), c.x, y);
    y += 8;
    setDraw(pdf, RULE);
    pdf.line(MARGIN, y, pageW - MARGIN, y);
    y += 14;
  };

  drawHeaderRow();

  invoices.forEach((inv, i) => {
    if (y > pageH - 50) {
      pdf.addPage();
      setFill(pdf, ACCENT);
      pdf.rect(0, 0, pageW, 4, 'F');
      y = MARGIN + 20;
      drawHeaderRow();
    }

    // Banda alterna sutil para legibilidad
    if (i % 2 === 1) {
      setFill(pdf, BAND);
      pdf.rect(MARGIN, y - 9, pageW - MARGIN * 2, 18, 'F');
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    setText(pdf, INK);

    const cells = [
      sequentialLabel(inv),
      customerLabel(inv),
      formatDate(inv.issueDate ?? inv.createdAt),
      formatTotal(inv.total),
      inv.status ?? '—',
    ];
    cols.forEach((c, idx) => {
      const text = pdf.splitTextToSize(cells[idx], c.w)[0] ?? '';
      pdf.text(text, c.x, y + 3);
    });
    y += 18;
  });

  // Pie con wordmark
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  setText(pdf, INK);
  pdf.text('WAX', MARGIN, pageH - 22);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setText(pdf, SMOKE);
  const note = 'Generado por WAX Admin · Facturación';
  pdf.text(note, (pageW - pdf.getTextWidth(note)) / 2, pageH - 22);

  pdf.save(`wax-facturas-${filenameDate()}.pdf`);
};
