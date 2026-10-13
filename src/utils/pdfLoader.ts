import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

export interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  textContent?: string;
}

export interface PdfDocumentInfo {
  numPages: number;
  title?: string;
  author?: string;
  fileSize: number;
  fileName: string;
}

/**
 * Load a PDF document from an ArrayBuffer or Uint8Array
 */
export async function loadPdfDocument(data: ArrayBuffer | Uint8Array) {
  const loadingTask = pdfjsLib.getDocument({
    data,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/**
 * Render a single page to a crisp dataURL with high-DPI scaling and extract text content
 */
export async function renderPdfPage(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  targetWidth = 1000
): Promise<RenderedPage> {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0 });
  const scale = Math.min(2.5, Math.max(1.2, targetWidth / unscaledViewport.width));
  const viewport = page.getViewport({ scale });

  // Extract text content for speech reading & accessibility
  let textContent = '';
  try {
    const textObj = await page.getTextContent();
    if (textObj && Array.isArray(textObj.items)) {
      textContent = textObj.items
        .map((item: any) => (typeof item?.str === 'string' ? item.str : ''))
        .filter((str: string) => str.trim().length > 0)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  } catch (err) {
    console.warn(`Không thể trích xuất văn bản trang ${pageNumber}:`, err);
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Không thể khởi tạo bộ vẽ đồ họa (Canvas 2D)');
  }

  // White background for transparent pages
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  return {
    pageNumber,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    aspectRatio: unscaledViewport.width / unscaledViewport.height,
    textContent: textContent || undefined,
  };
}
