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

const BG = '#faf9f6'; // mismo fondo que las cards
const MARGIN = 32;
const HEADER_HEIGHT = 42;

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

const drawPageHeader = (pdf: jsPDF, sectionLabel: string) => {
  const pageW = pdf.internal.pageSize.getWidth();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(15, 15, 16);
  pdf.text(`WAX — Reporte: ${sectionLabel}`, MARGIN, MARGIN);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(113, 113, 122);
  const dateStr = new Date().toLocaleString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  pdf.text(dateStr, MARGIN, MARGIN + 14);

  // Línea divisoria
  pdf.setDrawColor(220, 220, 220);
  pdf.line(MARGIN, MARGIN + 22, pageW - MARGIN, MARGIN + 22);

  pdf.setTextColor(0, 0, 0);
};

const drawCapturedImage = (pdf: jsPDF, img: HTMLImageElement) => {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const maxW = pageW - MARGIN * 2;
  const maxH = pageH - MARGIN * 2 - HEADER_HEIGHT;
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (pageW - w) / 2;
  const y = MARGIN + HEADER_HEIGHT;
  pdf.addImage(img.src, 'PNG', x, y, w, h);
};

/** Exporta un único panel (sección actual) a un PDF de 1 página. */
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

  pdf.save(timestampFilename(filenameKey));
};

/**
 * Exporta múltiples secciones a un PDF multi-página.
 * Itera por cada tab: la activa, espera el render, captura el panel.
 */
export const exportAllSectionsToPdf = async (
  tabs: { id: string; label: string }[],
  setActiveTab: (id: string) => void,
  getPanelEl: () => HTMLElement | null,
  waitMs = 750,
): Promise<void> => {
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  let first = true;

  for (const tab of tabs) {
    setActiveTab(tab.id);
    // Esperar que React monte el panel y Recharts termine las animaciones de entrada
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, waitMs));
    const el = getPanelEl();
    if (!el) continue;

    // eslint-disable-next-line no-await-in-loop
    const png = await captureToPng(el);
    // eslint-disable-next-line no-await-in-loop
    const img = await loadImage(png);

    if (!first) pdf.addPage();
    first = false;

    drawPageHeader(pdf, tab.label);
    drawCapturedImage(pdf, img);
  }

  pdf.save(timestampFilename('completo'));
};
