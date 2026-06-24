import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

// Filename: wax-reportes-{section}-{YYYY-MM-DD}_{HH-MM}.pdf
export const timestampFilename = (section: string): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
  return `wax-reportes-${section}-${date}_${time}.pdf`;
};

// ── Constantes de layout editorial ──────────────────────────────────────────
const BG = '#faf9f6';
const MARGIN = 40;
const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 36;

// Paleta brand
const ACCENT = { r: 143, g: 115, b: 82 };  // waxAmber
const INK = { r: 15, g: 15, b: 16 };
const GRAPHITE = { r: 39, g: 39, b: 42 };
const SMOKE = { r: 113, g: 113, b: 122 };
const RULE = { r: 220, g: 220, b: 220 };
const BG_BAND = { r: 242, g: 241, b: 237 }; // bone

const setFill = (pdf: jsPDF, c: { r: number; g: number; b: number }) =>
  pdf.setFillColor(c.r, c.g, c.b);
const setDraw = (pdf: jsPDF, c: { r: number; g: number; b: number }) =>
  pdf.setDrawColor(c.r, c.g, c.b);
const setText = (pdf: jsPDF, c: { r: number; g: number; b: number }) =>
  pdf.setTextColor(c.r, c.g, c.b);

const captureToPng = (element: HTMLElement): Promise<string> =>
  toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: BG,
    style: { boxShadow: 'none' },
  });

const loadImage = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

const formatDateLong = (d: Date): string =>
  d.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// ── Cabecera por página ─────────────────────────────────────────────────────
const drawPageHeader = (pdf: jsPDF, sectionLabel: string) => {
  const pageW = pdf.internal.pageSize.getWidth();

  // Banda superior fina de color (acento marca)
  setFill(pdf, ACCENT);
  pdf.rect(0, 0, pageW, 4, 'F');

  // Kicker — pequeño, letterspacing visual con espacios dobles
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(pdf, SMOKE);
  pdf.text('WAX  ·  REPORTERÍA  ·  TRAZABILIDAD', MARGIN, MARGIN + 8);

  // Título principal — serif para tono editorial
  pdf.setFont('times', 'normal');
  pdf.setFontSize(28);
  setText(pdf, INK);
  pdf.text(sectionLabel, MARGIN, MARGIN + 34);

  // Subtítulo: fecha y hora
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  setText(pdf, SMOKE);
  pdf.text(formatDateLong(new Date()), MARGIN, MARGIN + 52);

  // Divisor sutil bajo el header
  setDraw(pdf, RULE);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, MARGIN + 62, pageW - MARGIN, MARGIN + 62);
};

// ── Pie de página ───────────────────────────────────────────────────────────
const drawPageFooter = (pdf: jsPDF, pageNumber: number, totalPages: number) => {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const baseline = pageH - 22;

  // Divisor sutil sobre el footer
  setDraw(pdf, RULE);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, baseline - 12, pageW - MARGIN, baseline - 12);

  // Izquierda: wordmark
  pdf.setFont('times', 'normal');
  pdf.setFontSize(12);
  setText(pdf, INK);
  pdf.text('WAX', MARGIN, baseline);

  // Centro: nota
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setText(pdf, SMOKE);
  const note = 'Generado por WAX Admin · Dashboard de Trazabilidad';
  pdf.text(note, (pageW - pdf.getTextWidth(note)) / 2, baseline);

  // Derecha: número de página (solo si hay más de una)
  if (totalPages > 1) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setText(pdf, GRAPHITE);
    const txt = `${String(pageNumber).padStart(2, '0')}  /  ${String(totalPages).padStart(2, '0')}`;
    pdf.text(txt, pageW - MARGIN - pdf.getTextWidth(txt), baseline);
  }
};

// ── Imagen capturada ────────────────────────────────────────────────────────
const drawCapturedImage = (pdf: jsPDF, img: HTMLImageElement) => {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const maxW = pageW - MARGIN * 2;
  const maxH = pageH - MARGIN * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (pageW - w) / 2;
  const y = MARGIN + HEADER_HEIGHT;
  pdf.addImage(img.src, 'PNG', x, y, w, h);
};

// ── Portada (solo para reporte completo multi-sección) ─────────────────────
const drawCoverPage = (pdf: jsPDF, sections: { id: string; label: string }[]) => {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Banda superior gruesa de color
  setFill(pdf, ACCENT);
  pdf.rect(0, 0, pageW, 6, 'F');

  // Fondo de bone sutil en la mitad inferior
  setFill(pdf, BG_BAND);
  pdf.rect(0, pageH * 0.55, pageW, pageH * 0.45, 'F');

  // Kicker
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  setText(pdf, SMOKE);
  pdf.text('WAX  ·  ADMIN  ·  PANEL OPERATIVO', MARGIN, pageH * 0.32);

  // Título principal (Reporte de trazabilidad)
  pdf.setFont('times', 'normal');
  pdf.setFontSize(48);
  setText(pdf, INK);
  pdf.text('Reporte', MARGIN, pageH * 0.42);
  pdf.text('de trazabilidad', MARGIN, pageH * 0.48);

  // Fecha grande
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  setText(pdf, GRAPHITE);
  pdf.text(formatDateLong(new Date()), MARGIN, pageH * 0.62);

  // Índice de secciones
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  setText(pdf, SMOKE);
  pdf.text('SECCIONES', MARGIN, pageH * 0.7);

  pdf.setFont('times', 'normal');
  pdf.setFontSize(13);
  setText(pdf, INK);
  sections.forEach((s, i) => {
    const y = pageH * 0.74 + i * 18;
    const num = String(i + 1).padStart(2, '0');
    // Número en accent
    setText(pdf, ACCENT);
    pdf.text(num, MARGIN, y);
    // Label en ink
    setText(pdf, INK);
    pdf.text(s.label, MARGIN + 28, y);
  });

  // Footer del cover
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  setText(pdf, SMOKE);
  pdf.text('Generado por WAX Admin', MARGIN, pageH - 28);
};

// ── Finaliza: pinta footers en todas las páginas ───────────────────────────
const finalizeFooters = (pdf: jsPDF) => {
  const total = pdf.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    pdf.setPage(i);
    drawPageFooter(pdf, i, total);
  }
};

// ── Export: un solo panel ──────────────────────────────────────────────────
export const exportPanelToPdf = async (
  element: HTMLElement,
  sectionLabel: string,
  filenameKey: string,
): Promise<void> => {
  const png = await captureToPng(element);
  const img = await loadImage(png);

  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  drawPageHeader(pdf, sectionLabel);
  drawCapturedImage(pdf, img);
  finalizeFooters(pdf);

  pdf.save(timestampFilename(filenameKey));
};

// ── Export: todas las secciones (multi-página) ─────────────────────────────
export const exportAllSectionsToPdf = async (
  tabs: { id: string; label: string }[],
  setActiveTab: (id: string) => void,
  getPanelEl: () => HTMLElement | null,
  waitMs = 750,
): Promise<void> => {
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

  // Portada
  drawCoverPage(pdf, tabs);

  // Una página por sección
  for (const tab of tabs) {
    setActiveTab(tab.id);
    await new Promise((r) => setTimeout(r, waitMs));
    const el = getPanelEl();
    if (!el) continue;

    const png = await captureToPng(el);
    const img = await loadImage(png);

    pdf.addPage();
    drawPageHeader(pdf, tab.label);
    drawCapturedImage(pdf, img);
  }

  finalizeFooters(pdf);
  pdf.save(timestampFilename('completo'));
};
