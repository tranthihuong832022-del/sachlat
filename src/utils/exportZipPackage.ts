import JSZip from 'jszip';
import { RenderedPage } from './pdfLoader';

export interface ZipExportProgress {
  step: string;
  percent: number;
}

/**
 * Builds an offline, self-contained ZIP package of the 3D Flipbook:
 * - index.html: Offline 3D Flipbook with interactive controls, sound, themes, zoom, swipe & keyboard
 * - document.pdf: The original PDF file (or generated PDF from pages)
 * - pages/: Folder with all high-resolution page images
 * - HUONG_DAN.txt: Vietnamese instructions for teachers & students
 */
export async function exportFlipbookZipPackage(
  pages: RenderedPage[],
  title: string,
  originalPdfFile: File | null,
  themeColor: string = '#0D9488',
  onProgress?: (progress: ZipExportProgress) => void
): Promise<void> {
  const zip = new JSZip();
  const safeTitle = (title || 'Ebook_Lat_Trang').trim();
  const cleanTitle = safeTitle.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');

  onProgress?.({ step: 'Đang chuẩn bị dữ liệu trang...', percent: 10 });

  // 1. Add README instructions in Vietnamese
  const readmeContent = `======================================================================
SÁCH ĐIỆN TỬ LẬT TRANG 3D NGOẠI TUYẾN (EBOOK LẬT TRANG)
Cuốn sách: ${safeTitle}
Tổng số trang: ${pages.length} trang
Thời gian đóng gói: ${new Date().toLocaleString('vi-VN')}
======================================================================

HƯỚNG DẪN MỞ VÀ ĐỌC SÁCH NGOẠI TUYẾN (100% KHÔNG CẦN INTERNET):

1. MỞ SÁCH LẬT 3D:
   - Bước 1: Giải nén toàn bộ tệp ZIP này vào một thư mục trên máy tính của bạn.
   - Bước 2: Nhấp đúp chuột vào tệp "index.html".
   - Sách sẽ lập tức mở trong trình duyệt web (Google Chrome, Cốc Cốc, Microsoft Edge, Safari, Firefox).
   - KHÔNG CẦN KẾT NỐI INTERNET: Sách đã chứa đầy đủ mã nguồn, hình ảnh và âm thanh lật trang.

2. CÁCH LẬT TRANG VÀ THAO TÁC:
   - Lật trang kế tiếp:
     + Nhấp chuột vào trang bên phải hoặc nút mũi tên (›) ở mép phải.
     + Bấm phím mũi tên [Sang Phải] hoặc phím [Space] trên bàn phím.
     + Vuốt sang trái trên màn hình cảm ứng (iPad, điện thoại).
   - Lật trang trước đó:
     + Nhấp chuột vào trang bên trái hoặc nút mũi tên (‹) ở mép trái.
     + Bấm phím mũi tên [Sang Trái] trên bàn phím.
     + Vuốt sang phải trên màn hình cảm ứng.
   - Nhảy nhanh đến trang: Nhập số trang vào ô "Trang [...]" ở thanh dưới cùng và nhấn Enter.
   - Phóng to / Thu nhỏ: Dùng nút [🔍+] và [🔍-], hoặc giữ phím Ctrl và lăn chuột.
   - Đổi màu giao diện: Nhấp vào các chấm màu ở góc trên để chọn phông nền phù hợp với mắt (Giấy mộc, Ngọc bích, Rừng xanh, Lavender, hoặc Chế độ ban đêm).
   - Bật / Tắt âm thanh: Nhấp nút [Âm thanh: Bật / Tắt] ở thanh trên cùng.
   - Toàn màn hình: Nhấp nút [Toàn màn hình] để có trải nghiệm đọc tập trung như sách thật.

3. TỆP PDF GỐC (document.pdf):
   - Tệp "document.pdf" đi kèm là tệp tài liệu PDF gốc dùng để in ấn, photo hoặc lưu trữ bài giảng.

4. CHIA SẺ CHO HỌC SINH VÀ ĐỒNG NGHIỆP:
   - Giáo viên có thể gửi cả tệp ZIP này qua Zalo, Email, Google Drive, OneDrive hoặc copy vào USB.
   - Người nhận chỉ cần giải nén và mở tệp "index.html" là có thể đọc ngay lập tức.
======================================================================`;
  zip.file('HUONG_DAN.txt', readmeContent);

  // 2. Add original PDF file
  onProgress?.({ step: 'Đang đóng gói tệp PDF...', percent: 25 });
  if (originalPdfFile) {
    const pdfBuffer = await originalPdfFile.arrayBuffer();
    zip.file('document.pdf', pdfBuffer);
  } else {
    // Generate valid PDF 1.4 binary blob from rendered pages if no file was uploaded
    const objects: string[] = [];
    const xrefOffsets: number[] = [];
    const addObj = (c: string) => { objects.push(c); return objects.length; };
    const pageImageRefs: { imageObjId: number; pageObjId: number; width: number; height: number }[] = [];

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      const base64Data = p.dataUrl.split(',')[1];
      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const imgObjIndex = addObj(
        `<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${len} >>\nstream\n${binaryStr}\nendstream`
      );
      const pageObjIndex = addObj('');
      pageImageRefs.push({ imageObjId: imgObjIndex, pageObjId: pageObjIndex, width: p.width, height: p.height });
    }

    const pagesObjIndex = addObj('');
    const catalogObjIndex = addObj(`<< /Type /Catalog /Pages ${pagesObjIndex} 0 R >>`);
    const pageKidsRefs: string[] = [];

    for (let i = 0; i < pageImageRefs.length; i++) {
      const { imageObjId, pageObjId, width, height } = pageImageRefs[i];
      pageKidsRefs.push(`${pageObjId} 0 R`);
      const contentStream = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ`;
      const contentObjIndex = addObj(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
      objects[pageObjId - 1] = `<< /Type /Page /Parent ${pagesObjIndex} 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 ${imageObjId} 0 R >> >> /Contents ${contentObjIndex} 0 R >>`;
    }

    objects[pagesObjIndex - 1] = `<< /Type /Pages /Kids [${pageKidsRefs.join(' ')}] /Count ${pageImageRefs.length} >>`;

    let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    for (let i = 0; i < objects.length; i++) {
      xrefOffsets.push(pdf.length);
      pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }
    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const offset of xrefOffsets) {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjIndex} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const uint8 = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) uint8[i] = pdf.charCodeAt(i) & 0xff;
    zip.file('document.pdf', uint8);
  }

  // 3. Add individual high-resolution page images to pages/ directory
  onProgress?.({ step: 'Đang lưu trữ các trang ảnh...', percent: 40 });
  const pagesFolder = zip.folder('pages')!;
  const pageImageRelativePaths: string[] = [];

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const base64Data = p.dataUrl.split(',')[1];
    const fileName = `page_${i + 1}.jpg`;
    pagesFolder.file(fileName, base64Data, { base64: true });
    pageImageRelativePaths.push(`pages/${fileName}`);
  }

  // 4. Generate standalone index.html referencing local relative page paths
  onProgress?.({ step: 'Đang tạo giao diện lật sách ngoại tuyến...', percent: 65 });
  const relativePagesJson = JSON.stringify(pageImageRelativePaths);
  const escapedTitle = safeTitle.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[m] || m));

  const standaloneHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">
  <title>${escapedTitle} - Sách Lật 3D Ngoại Tuyến</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #F4EFEA;
      --surface: #FFFFFF;
      --text: #292524;
      --muted: #78716C;
      --border: #E5DACF;
      --primary: ${themeColor};
      --casing: #78350F;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
      -webkit-user-select: none;
      transition: background-color 0.3s ease;
    }
    header {
      height: 54px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 50;
      gap: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 15px;
      min-width: 0;
    }
    .brand-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--primary); color: white;
      display: flex; align-items: center; justify-content: center; font-size: 16px;
      flex-shrink: 0;
    }
    .brand-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 260px;
    }
    @media (max-width: 640px) {
      .brand-title { max-width: 130px; font-size: 13px; }
    }
    .tools {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .btn {
      padding: 6px 10px; border-radius: 7px;
      border: 1px solid var(--border); background: var(--surface);
      color: var(--text); font-size: 12px; font-weight: 600;
      cursor: pointer; display: flex; align-items: center; gap: 5px;
      transition: all 0.15s; white-space: nowrap;
    }
    .btn:hover { background: rgba(0,0,0,0.05); }
    .btn:active { transform: scale(0.96); }
    .btn-primary { background: var(--primary); color: #FFF; border-color: var(--primary); }
    .btn-primary:hover { opacity: 0.95; }
    .stage {
      flex: 1; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .book-wrap {
      perspective: 2600px;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: center center;
    }
    .book-casing {
      background: var(--casing);
      padding: 10px; border-radius: 12px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.32), 0 2px 10px rgba(0,0,0,0.18);
      position: relative;
    }
    .corner-brass {
      position: absolute; width: 14px; height: 14px; pointer-events: none;
    }
    .cb-tl { top: 3px; left: 3px; border-top: 2px solid #FCD34D; border-left: 2px solid #FCD34D; }
    .cb-tr { top: 3px; right: 3px; border-top: 2px solid #FCD34D; border-right: 2px solid #FCD34D; }
    .cb-bl { bottom: 3px; left: 3px; border-bottom: 2px solid #FCD34D; border-left: 2px solid #FCD34D; }
    .cb-br { bottom: 3px; right: 3px; border-bottom: 2px solid #FCD34D; border-right: 2px solid #FCD34D; }
    .book-pages {
      display: flex; background: #FFFFFF; border-radius: 4px;
      overflow: hidden; height: min(74vh, 780px);
      aspect-ratio: 2 / 1.414; position: relative;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.06);
    }
    .single-mode .book-pages { aspect-ratio: 1 / 1.414; }
    .page-box {
      width: 50%; height: 100%; background: #FFF;
      position: relative; display: flex; align-items: center; justify-content: center;
      overflow: hidden; cursor: pointer;
    }
    .single-mode .page-box { width: 100%; }
    .page-box img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
    .left-page { border-right: 1px solid #E5E7EB; }
    .spine-shadow-left {
      position: absolute; right: 0; top: 0; bottom: 0; width: 34px;
      background: linear-gradient(to left, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 60%, transparent 100%);
      pointer-events: none; z-index: 10;
    }
    .spine-shadow-right {
      position: absolute; left: 0; top: 0; bottom: 0; width: 34px;
      background: linear-gradient(to right, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 60%, transparent 100%);
      pointer-events: none; z-index: 10;
    }
    .edge-shadow-left {
      position: absolute; left: 0; top: 0; bottom: 0; width: 8px;
      background: linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 100%);
      pointer-events: none;
    }
    .edge-shadow-right {
      position: absolute; right: 0; top: 0; bottom: 0; width: 8px;
      background: linear-gradient(to left, rgba(0,0,0,0.08) 0%, transparent 100%);
      pointer-events: none;
    }
    .page-number {
      position: absolute; bottom: 8px; font-size: 11px; color: #9CA3AF; font-family: monospace;
      padding: 2px 6px; background: rgba(255,255,255,0.7); border-radius: 4px;
    }
    .left-page .page-number { left: 16px; }
    .right-page .page-number { right: 16px; }
    .turning-leaf {
      position: absolute; top: 0; bottom: 0; right: 0; width: 50%;
      transform-origin: left center; transform-style: preserve-3d;
      pointer-events: none; z-index: 35;
    }
    .single-mode .turning-leaf { width: 100%; }
    .leaf-face {
      position: absolute; inset: 0; background: #FFF;
      overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.28);
    }
    .leaf-front { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .leaf-back { transform: rotateY(180deg); backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .leaf-face img { width: 100%; height: 100%; object-fit: contain; }
    .leaf-shadow {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(to right, rgba(0,0,0,0.22) 0%, transparent 60%);
    }
    .side-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--surface); border: 1.5px solid var(--border);
      box-shadow: 0 8px 24px rgba(0,0,0,0.18); display: flex;
      align-items: center; justify-content: center; cursor: pointer;
      font-size: 24px; font-weight: bold; z-index: 40; transition: all 0.18s;
      color: var(--text);
    }
    .side-arrow:hover { transform: translateY(-50%) scale(1.1); background: var(--surface); }
    .side-arrow:active { transform: translateY(-50%) scale(0.95); }
    .arrow-left { left: 16px; }
    .arrow-right { right: 16px; }
    .side-arrow.disabled { opacity: 0; pointer-events: none; }
    footer {
      height: 48px; background: var(--surface);
      border-top: 1px solid var(--border); display: flex;
      align-items: center; justify-content: space-between;
      padding: 0 16px; font-size: 12px; color: var(--muted); z-index: 50;
      gap: 10px;
    }
    .page-input {
      width: 48px; text-align: center; padding: 4px;
      border: 1px solid var(--border); border-radius: 6px; font-weight: 700;
      background: var(--surface); color: var(--text);
    }
    .page-input:focus { outline: 2px solid var(--primary); }
    .theme-palette {
      display: flex; align-items: center; gap: 5px;
    }
    .color-dot {
      width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.18);
      cursor: pointer; transition: transform 0.15s;
    }
    .color-dot:hover { transform: scale(1.2); }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">📖</div>
      <span class="brand-title" title="${escapedTitle}">${escapedTitle}</span>
    </div>
    <div class="tools">
      <div class="theme-palette" title="Đổi màu không gian đọc">
        <div class="color-dot" style="background: #F4EFEA;" title="Giấy Cổ Điển" onclick="setTheme('#F4EFEA', '#78350F')"></div>
        <div class="color-dot" style="background: #EDF7F6;" title="Ngọc Bích" onclick="setTheme('#EDF7F6', '#115E59')"></div>
        <div class="color-dot" style="background: #F0F5ED;" title="Thư Viện" onclick="setTheme('#F0F5ED', '#166534')"></div>
        <div class="color-dot" style="background: #F5F3FF;" title="Thạch Anh" onclick="setTheme('#F5F3FF', '#5B21B6')"></div>
        <div class="color-dot" style="background: #0F172A;" title="Đêm Trăng (Tối)" onclick="setTheme('#0F172A', '#0284C7', true)"></div>
      </div>
      <button class="btn" id="btnSound">🔊 Âm thanh: Bật</button>
      <button class="btn" id="btnMode">📖 2 Trang</button>
      <button class="btn" id="btnZoomOut" title="Thu nhỏ">🔍-</button>
      <button class="btn" id="btnZoomReset" title="Đặt lại 100%">100%</button>
      <button class="btn" id="btnZoomIn" title="Phóng to">🔍+</button>
      <a href="document.pdf" download="${cleanTitle}.pdf" class="btn" title="Tải file PDF ban đầu">📄 PDF gốc</a>
      <button class="btn btn-primary" id="btnFullscreen">⛶ Toàn màn hình</button>
    </div>
  </header>

  <div class="stage" id="stageArea">
    <button class="side-arrow arrow-left" id="btnPrev" title="Trang trước (Phím mũi tên Trái)">‹</button>
    <button class="side-arrow arrow-right" id="btnNext" title="Trang sau (Phím mũi tên Phải)">›</button>

    <div class="book-wrap" id="bookWrap">
      <div class="book-casing" id="bookCasing">
        <div class="corner-brass cb-tl"></div>
        <div class="corner-brass cb-tr"></div>
        <div class="corner-brass cb-bl"></div>
        <div class="corner-brass cb-br"></div>
        <div class="book-pages" id="bookPages">
          <div class="page-box left-page" id="leftPageBox">
            <img id="leftImg" src="" alt="Trang trái" />
            <div class="spine-shadow-left"></div>
            <div class="edge-shadow-left"></div>
            <div class="page-number" id="leftNum"></div>
          </div>
          <div class="page-box right-page" id="rightPageBox">
            <img id="rightImg" src="" alt="Trang phải" />
            <div class="spine-shadow-right" id="rightSpine"></div>
            <div class="edge-shadow-right"></div>
            <div class="page-number" id="rightNum"></div>
          </div>
          <div class="turning-leaf" id="turningLeaf" style="display: none;">
            <div class="leaf-face leaf-front">
              <img id="leafFrontImg" src="" alt="" />
              <div class="leaf-shadow"></div>
            </div>
            <div class="leaf-face leaf-back">
              <img id="leafBackImg" src="" alt="" />
              <div class="leaf-shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer>
    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      Phím <strong>Trái / Phải</strong> hoặc vuốt màn hình • <strong>100% Ngoại tuyến</strong>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
      <span>Trang</span>
      <input type="text" class="page-input" id="pageInput" value="1" title="Nhập số trang và nhấn Enter" />
      <span id="pageTotal">/ ${pages.length}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
      <span>Ebook Lật Trang 3D Offline</span>
    </div>
  </footer>

  <script>
    const pages = ${relativePagesJson};
    const totalPages = pages.length;
    let currentIndex = 0;
    let viewMode = window.innerWidth < 768 ? 'single' : 'dual';
    let isSoundOn = true;
    let zoomLevel = 1.0;
    let isFlipping = false;

    // Web Audio synthesizer for paper turn (100% offline, zero audio files required)
    let audioCtx = null;
    function playFlipSound() {
      if (!isSoundOn) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const buf = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 0.18), audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < data.length; i++) {
          const w = Math.random() * 2 - 1;
          data[i] = (last + 0.05 * w) / 1.05;
          last = data[i];
          data[i] *= 2.2;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(1.8, now);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        src.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
        src.start(now);
      } catch (e) {}
    }

    const leftBox = document.getElementById('leftPageBox');
    const rightBox = document.getElementById('rightPageBox');
    const leftImg = document.getElementById('leftImg');
    const rightImg = document.getElementById('rightImg');
    const leftNum = document.getElementById('leftNum');
    const rightNum = document.getElementById('rightNum');
    const rightSpine = document.getElementById('rightSpine');
    const pageInput = document.getElementById('pageInput');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const turningLeaf = document.getElementById('turningLeaf');
    const leafFrontImg = document.getElementById('leafFrontImg');
    const leafBackImg = document.getElementById('leafBackImg');
    const bookPages = document.getElementById('bookPages');
    const bookWrap = document.getElementById('bookWrap');
    const btnMode = document.getElementById('btnMode');

    function setTheme(bg, casing, isDark = false) {
      document.documentElement.style.setProperty('--bg', bg);
      document.documentElement.style.setProperty('--casing', casing);
      if (isDark) {
        document.documentElement.style.setProperty('--surface', '#1E293B');
        document.documentElement.style.setProperty('--text', '#F8FAFC');
        document.documentElement.style.setProperty('--border', '#334155');
        document.documentElement.style.setProperty('--muted', '#94A3B8');
      } else {
        document.documentElement.style.setProperty('--surface', '#FFFFFF');
        document.documentElement.style.setProperty('--text', '#292524');
        document.documentElement.style.setProperty('--border', '#E5DACF');
        document.documentElement.style.setProperty('--muted', '#78716C');
      }
    }

    function renderSpread() {
      if (viewMode === 'single') {
        bookPages.classList.add('single-mode');
        leftBox.style.display = 'none';
        rightBox.style.width = '100%';
        rightImg.style.visibility = 'visible';
        rightImg.src = pages[currentIndex] || '';
        rightNum.innerText = (currentIndex + 1) + ' / ' + totalPages;
        rightSpine.style.display = 'none';
        pageInput.value = currentIndex + 1;
      } else {
        bookPages.classList.remove('single-mode');
        rightSpine.style.display = 'block';
        if (currentIndex === 0) {
          leftBox.style.display = 'none';
          rightBox.style.width = '100%';
          rightImg.style.visibility = 'visible';
          rightImg.src = pages[0] || '';
          rightNum.innerText = '1';
          rightSpine.style.display = 'none';
          pageInput.value = 1;
        } else {
          leftBox.style.display = 'flex';
          rightBox.style.width = '50%';
          const leftIdx = currentIndex % 2 === 1 ? currentIndex : currentIndex - 1;
          const rightIdx = leftIdx + 1;

          if (leftIdx < totalPages) {
            leftImg.style.visibility = 'visible';
            leftImg.src = pages[leftIdx] || '';
            leftNum.innerText = leftIdx + 1;
          } else {
            leftImg.style.visibility = 'hidden';
            leftNum.innerText = '';
          }

          if (rightIdx < totalPages) {
            rightImg.style.visibility = 'visible';
            rightImg.src = pages[rightIdx] || '';
            rightNum.innerText = rightIdx + 1;
          } else {
            rightImg.style.visibility = 'hidden';
            rightNum.innerText = '';
          }

          pageInput.value = leftIdx + 1;
        }
      }
      btnPrev.classList.toggle('disabled', currentIndex <= 0);
      const isAtLast = viewMode === 'single'
        ? currentIndex >= totalPages - 1
        : (currentIndex > 0 ? (currentIndex % 2 === 1 ? currentIndex + 1 : currentIndex) >= totalPages - 1 : totalPages <= 1);
      btnNext.classList.toggle('disabled', isAtLast);
    }

    function flipNext() {
      if (isFlipping) return;
      let nextIdx = currentIndex;
      if (viewMode === 'single') {
        if (currentIndex >= totalPages - 1) return;
        nextIdx = currentIndex + 1;
      } else {
        if (currentIndex === 0) nextIdx = 1;
        else {
          const nextL = (currentIndex % 2 === 1 ? currentIndex : currentIndex - 1) + 2;
          if (nextL >= totalPages) return;
          nextIdx = nextL;
        }
      }

      playFlipSound();
      isFlipping = true;
      turningLeaf.style.display = 'block';
      leafFrontImg.src = rightImg.src;
      leafBackImg.src = pages[nextIdx] || '';

      // Prepare upcoming page under the turning leaf so it reveals naturally
      if (viewMode === 'dual' && nextIdx + 1 < totalPages) {
        rightImg.src = pages[nextIdx + 1] || '';
      }

      let start = null;
      const duration = 460;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        turningLeaf.style.transform = 'rotateY(-' + (ease * 180) + 'deg)';
        if (p < 1) requestAnimationFrame(step);
        else {
          turningLeaf.style.display = 'none';
          currentIndex = nextIdx;
          isFlipping = false;
          renderSpread();
        }
      }
      requestAnimationFrame(step);
    }

    function flipPrev() {
      if (isFlipping || currentIndex <= 0) return;
      let prevIdx = currentIndex;
      if (viewMode === 'single') prevIdx = currentIndex - 1;
      else {
        if (currentIndex <= 2) prevIdx = 0;
        else {
          const prevL = (currentIndex % 2 === 1 ? currentIndex : currentIndex - 1) - 2;
          prevIdx = Math.max(1, prevL);
        }
      }

      playFlipSound();
      isFlipping = true;
      turningLeaf.style.display = 'block';
      leafFrontImg.src = pages[currentIndex] || '';
      leafBackImg.src = leftImg.src;

      let start = null;
      const duration = 460;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        turningLeaf.style.transform = 'rotateY(-' + (180 - ease * 180) + 'deg)';
        if (p < 1) requestAnimationFrame(step);
        else {
          turningLeaf.style.display = 'none';
          currentIndex = prevIdx;
          isFlipping = false;
          renderSpread();
        }
      }
      requestAnimationFrame(step);
    }

    btnNext.addEventListener('click', flipNext);
    btnPrev.addEventListener('click', flipPrev);
    rightBox.addEventListener('click', flipNext);
    leftBox.addEventListener('click', flipPrev);

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault(); flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); flipPrev();
      } else if (e.key === 'Home') {
        e.preventDefault(); currentIndex = 0; renderSpread();
      } else if (e.key === 'End') {
        e.preventDefault(); currentIndex = totalPages - 1; renderSpread();
      }
    });

    // Touch Swipe gestures for iPad & Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          if (dx < 0) flipNext();
          else flipPrev();
        }
      }
    }, { passive: true });

    // Sound toggle
    document.getElementById('btnSound').addEventListener('click', function() {
      isSoundOn = !isSoundOn;
      this.innerText = isSoundOn ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt';
    });

    // Dual / Single view mode toggle
    btnMode.innerText = viewMode === 'dual' ? '📖 2 Trang' : '📱 1 Trang';
    btnMode.addEventListener('click', function() {
      viewMode = viewMode === 'dual' ? 'single' : 'dual';
      this.innerText = viewMode === 'dual' ? '📖 2 Trang' : '📱 1 Trang';
      renderSpread();
    });

    // Zoom controls
    function applyZoom() {
      bookWrap.style.transform = 'scale(' + zoomLevel + ')';
    }
    document.getElementById('btnZoomIn').addEventListener('click', () => {
      zoomLevel = Math.min(2.2, Math.round((zoomLevel + 0.2) * 10) / 10);
      applyZoom();
    });
    document.getElementById('btnZoomOut').addEventListener('click', () => {
      zoomLevel = Math.max(0.6, Math.round((zoomLevel - 0.2) * 10) / 10);
      applyZoom();
    });
    document.getElementById('btnZoomReset').addEventListener('click', () => {
      zoomLevel = 1.0;
      applyZoom();
    });

    // Fullscreen toggle
    document.getElementById('btnFullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Direct Page number input
    pageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
          currentIndex = val - 1;
          renderSpread();
        }
      }
    });
    pageInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 1 && val <= totalPages) {
        currentIndex = val - 1;
        renderSpread();
      }
    });

    // Auto-adapt mode on resize
    window.addEventListener('resize', () => {
      const shouldBeSingle = window.innerWidth < 768;
      if (shouldBeSingle && viewMode !== 'single') {
        viewMode = 'single';
        btnMode.innerText = '📱 1 Trang';
        renderSpread();
      }
    });

    // Initial render
    renderSpread();
  </script>
</body>
</html>`;

  zip.file('index.html', standaloneHtml);

  // 5. Generate and trigger download of the ZIP file
  onProgress?.({ step: 'Đang nén toàn bộ gói ZIP...', percent: 80 });

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      const currentPct = Math.round(80 + (metadata.percent / 100) * 19);
      onProgress?.({
        step: `Đang nén dữ liệu (${Math.round(metadata.percent)}%)...`,
        percent: currentPct,
      });
    }
  );

  onProgress?.({ step: 'Hoàn tất đóng gói ZIP!', percent: 100 });

  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${cleanTitle}_Sach_Lat_3D.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}
