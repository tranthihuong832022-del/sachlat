import { RenderedPage } from './pdfLoader';

/**
 * Builds a valid, lightweight PDF file (PDF 1.4) from an array of image pages
 * so users can download it to their device and test the upload workflow directly.
 */
export async function downloadPagesAsPdf(pages: RenderedPage[], fileName = 'Sach_Mau_Ebook_Lat_Trang.pdf') {
  // Simple PDF 1.4 binary assembler with JPEG image streams
  const objects: string[] = [];
  const xrefOffsets: number[] = [];

  const addObj = (content: string) => {
    objects.push(content);
    return objects.length; // 1-based index
  };

  // We convert dataURLs to binary JPEG chunks
  const pageImageRefs: { imageObjId: number; pageObjId: number; width: number; height: number }[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    // Strip data:image/jpeg;base64,
    const base64Data = page.dataUrl.split(',')[1];
    const binaryStr = atob(base64Data);
    const len = binaryStr.length;

    // Image XObject
    const imgObjIndex = addObj(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${len} >>\nstream\n${binaryStr}\nendstream`
    );

    // Page object placeholder (will reference parent /Pages)
    const pageObjIndex = addObj(''); // placeholder, will fill in next pass
    pageImageRefs.push({
      imageObjId: imgObjIndex,
      pageObjId: pageObjIndex,
      width: page.width,
      height: page.height,
    });
  }

  // Catalog and Pages
  const pagesObjIndex = addObj(''); // will set Kids
  const catalogObjIndex = addObj(`<< /Type /Catalog /Pages ${pagesObjIndex} 0 R >>`);

  // Fill in Page objects and content streams
  const pageKidsRefs: string[] = [];
  for (let i = 0; i < pageImageRefs.length; i++) {
    const { imageObjId, pageObjId, width, height } = pageImageRefs[i];
    pageKidsRefs.push(`${pageObjId} 0 R`);

    // Draw image to fill full page
    const contentStream = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ`;
    const contentObjIndex = addObj(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);

    objects[pageObjId - 1] = `<< /Type /Page /Parent ${pagesObjIndex} 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 ${imageObjId} 0 R >> >> /Contents ${contentObjIndex} 0 R >>`;
  }

  // Update /Pages object
  objects[pagesObjIndex - 1] = `<< /Type /Pages /Kids [${pageKidsRefs.join(' ')}] /Count ${pageImageRefs.length} >>`;

  // Assemble full PDF
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  for (let i = 0; i < objects.length; i++) {
    xrefOffsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of xrefOffsets) {
    const padded = offset.toString().padStart(10, '0');
    pdf += `${padded} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjIndex} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  // Convert binary string to Uint8Array
  const uint8 = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) {
    uint8[i] = pdf.charCodeAt(i) & 0xff;
  }

  const blob = new Blob([uint8], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
