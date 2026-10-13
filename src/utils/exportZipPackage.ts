import JSZip from 'jszip';
import { RenderedPage } from './pdfLoader';
import { downloadPagesAsPdf } from './samplePdfDownload';

export interface ZipExportProgress {
  step: string;
  percent: number;
}

/**
 * Builds an offline, self-contained ZIP package of the 3D Flipbook:
 * - index.html: Offline 3D Flipbook with interactive controls, sound, themes, and zoom
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
  const cleanTitle = (title || 'Ebook_Lat_Trang').replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');

  onProgress?.({ step: 'Đang chuẩn bị dữ liệu trang...', percent: 10 });

  // 1. Add README instructions in Vietnamese
  const readmeContent = `=====================================================
SÁCH ĐIỆN TỬ LẬT TRANG 3D (EBOOK LẬT TRANG)
Cuốn sách: ${title}
Tổng số trang: ${pages.length} trang
=====================================================

HƯỚNG DẪN MỞ VÀ ĐỌC SÁCH NGOẠI TUYẾN (KHÔNG CẦN INTERNET):

1. Mở sách lật 3D:
   - Nhấp đúp chuột vào tệp "index.html".
   - Sách sẽ tự động mở trên trình duyệt (Chrome, Safari, Edge, Cốc Cốc, Firefox).
   - Bạn có thể lật trang bằng cách:
     + Bấm phím mũi tên Trái / Phải trên bàn phím.
     + Nhấp chuột vào trang sách hoặc nút mũi tên hai bên.
     + Vuốt chạm trên màn hình cảm ứng nếu dùng điện thoại hoặc máy tính bảng.
   - Các nút chức năng: Phóng to (+), Thu nhỏ (-), Bật/Tắt âm thanh giấy, Đổi màu giao diện, Toàn màn hình.

2. Tệp PDF gốc:
   - Tệp "document.pdf" trong thư mục này là tệp PDF gốc để in ấn hoặc đọc trên các phần mềm PDF truyền thống.

3. Chia sẻ cho học sinh và đồng nghiệp:
   - Bạn có thể nén hoặc gửi toàn bộ thư mục này cho học sinh qua Zalo, Email, Google Drive hoặc USB. Người nhận chỉ cần mở "index.html" là đọc được ngay.
=====================================================`;
  zip.file('HUONG_DAN.txt', readmeContent);

  // 2. Add original PDF file
  onProgress?.({ step: 'Đang đóng gói tệp PDF...', percent: 25 });
  if (originalPdfFile) {
    const pdfBuffer = await originalPdfFile.arrayBuffer();
    zip.file('document.pdf', pdfBuffer);
  } else {
    // Generate PDF blob from rendered pages if no file was uploaded
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
  onProgress?.({ step: 'Đang nén các trang ảnh...', percent: 40 });
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

  const standaloneHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Sách Lật 3D Ngoại Tuyến</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
      -webkit-user-select: none;
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
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 15px;
    }
    .brand-icon {
      width: 30px; height: 30px; border-radius: 8px;
      background: var(--primary); color: white;
      display: flex; align-items: center; justify-content: center; font-size: 15px;
    }
    .tools { display: flex; align-items: center; gap: 8px; }
    .btn {
      padding: 6px 12px; border-radius: 6px;
      border: 1px solid var(--border); background: var(--surface);
      color: var(--text); font-size: 12px; font-weight: 600;
      cursor: pointer; display: flex; align-items: center; gap: 5px;
      transition: all 0.15s;
    }
    .btn:hover { background: rgba(0,0,0,0.04); }
    .btn:active { transform: scale(0.97); }
    .btn-primary { background: var(--primary); color: #FFF; border-color: var(--primary); }
    .stage {
      flex: 1; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .book-wrap {
      perspective: 2600px;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s ease-out;
    }
    .book-casing {
      background: var(--casing);
      padding: 10px; border-radius: 10px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.15);
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
      position: absolute; right: 0; top: 0; bottom: 0; width: 32px;
      background: linear-gradient(to left, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.03) 60%, transparent 100%);
      pointer-events: none;
    }
    .spine-shadow-right {
      position: absolute; left: 0; top: 0; bottom: 0; width: 32px;
      background: linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.03) 60%, transparent 100%);
      pointer-events: none;
    }
    .page-number {
      position: absolute; bottom: 8px; font-size: 11px; color: #9CA3AF; font-family: monospace;
    }
    .left-page .page-number { left: 16px; }
    .right-page .page-number { right: 16px; }
    .turning-leaf {
      position: absolute; top: 0; bottom: 0; right: 0; width: 50%;
      transform-origin: left center; transform-style: preserve-3d;
      pointer-events: none; z-index: 30;
    }
    .leaf-face {
      position: absolute; inset: 0; background: #FFF;
      overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .leaf-front { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .leaf-back { transform: rotateY(180deg); backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .leaf-face img { width: 100%; height: 100%; object-fit: contain; }
    .side-arrow {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--surface); border: 1.5px solid var(--border);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15); display: flex;
      align-items: center; justify-content: center; cursor: pointer;
      font-size: 20px; font-weight: bold; z-index: 40; transition: all 0.15s;
    }
    .side-arrow:hover { transform: translateY(-50%) scale(1.08); }
    .arrow-left { left: 20px; }
    .arrow-right { right: 20px; }
    .side-arrow.disabled { opacity: 0; pointer-events: none; }
    footer {
      height: 46px; background: var(--surface);
      border-top: 1px solid var(--border); display: flex;
      align-items: center; justify-content: space-between;
      padding: 0 20px; font-size: 12px; color: var(--muted); z-index: 50;
    }
    .page-input {
      width: 46px; text-align: center; padding: 4px;
      border: 1px solid var(--border); border-radius: 5px; font-weight: 700;
    }
    .theme-palette {
      display: flex; align-items: center; gap: 4px;
    }
    .color-dot {
      width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.2);
      cursor: pointer; transition: transform 0.15s;
    }
    .color-dot:hover { transform: scale(1.15); }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">📖</div>
      <span>${title}</span>
    </div>
    <div class="tools">
      <div class="theme-palette" title="Đổi màu không gian đọc">
        <div class="color-dot" style="background: #F4EFEA;" onclick="setTheme('#F4EFEA', '#78350F')"></div>
        <div class="color-dot" style="background: #EDF7F6;" onclick="setTheme('#EDF7F6', '#115E59')"></div>
        <div class="color-dot" style="background: #F0F5ED;" onclick="setTheme('#F0F5ED', '#166534')"></div>
        <div class="color-dot" style="background: #F5F3FF;" onclick="setTheme('#F5F3FF', '#5B21B6')"></div>
        <div class="color-dot" style="background: #0F172A;" onclick="setTheme('#0F172A', '#0284C7', true)"></div>
      </div>
      <button class="btn" id="btnSound">🔊 Âm thanh: Bật</button>
      <button class="btn" id="btnMode">📖 2 Trang</button>
      <button class="btn" id="btnZoomOut">🔍-</button>
      <button class="btn" id="btnZoomReset">100%</button>
      <button class="btn" id="btnZoomIn">🔍+</button>
      <a href="document.pdf" download="${cleanTitle}.pdf" class="btn" title="Tải file PDF ban đầu">📄 File PDF gốc</a>
      <button class="btn btn-primary" id="btnFullscreen">⛶ Toàn màn hình</button>
    </div>
  </header>

  <div class="stage">
    <button class="side-arrow arrow-left" id="btnPrev">‹</button>
    <button class="side-arrow arrow-right" id="btnNext">›</button>

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
            <div class="page-number" id="leftNum"></div>
          </div>
          <div class="page-box right-page" id="rightPageBox">
            <img id="rightImg" src="" alt="Trang phải" />
            <div class="spine-shadow-right" id="rightSpine"></div>
            <div class="page-number" id="rightNum"></div>
          </div>
          <div class="turning-leaf" id="turningLeaf" style="display: none;">
            <div class="leaf-face leaf-front">
              <img id="leafFrontImg" src="" alt="" />
            </div>
            <div class="leaf-face leaf-back">
              <img id="leafBackImg" src="" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer>
    <div>Phím <strong>Trái / Phải</strong> hoặc nhấp chuột vào trang để lật • 100% Ngoại tuyến</div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>Trang</span>
      <input type="text" class="page-input" id="pageInput" value="1" />
      <span id="pageTotal">/ ${pages.length}</span>
    </div>
    <div>Sách Điện Tử Lật Trang 3D Offline</div>
  </footer>

  <script>
    const pages = ${relativePagesJson};
    const totalPages = pages.length;
    let currentIndex = 0;
    let viewMode = window.innerWidth < 768 ? 'single' : 'dual';
    let isSoundOn = true;
    let zoomLevel = 1.0;
    let isFlipping = false;

    // Web Audio synthesizer for paper turn
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
          rightImg.src = pages[0] || '';
          rightNum.innerText = '1';
          rightSpine.style.display = 'none';
          pageInput.value = 1;
        } else {
          leftBox.style.display = 'flex';
          rightBox.style.width = '50%';
          const leftIdx = currentIndex % 2 === 1 ? currentIndex : currentIndex - 1;
          const rightIdx = leftIdx + 1;
          leftImg.src = pages[leftIdx] || '';
          leftNum.innerText = leftIdx + 1;
          rightImg.src = pages[rightIdx] || '';
          rightNum.innerText = rightIdx < totalPages ? (rightIdx + 1) : '';
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

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); flipNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); flipPrev(); }
    });

    document.getElementById('btnSound').addEventListener('click', function() {
      isSoundOn = !isSoundOn;
      this.innerText = isSoundOn ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt';
    });

    document.getElementById('btnMode').addEventListener('click', function() {
      viewMode = viewMode === 'dual' ? 'single' : 'dual';
      this.innerText = viewMode === 'dual' ? '📖 2 Trang' : '📱 1 Trang';
      renderSpread();
    });

    document.getElementById('btnZoomIn').addEventListener('click', () => {
      zoomLevel = Math.min(2.0, zoomLevel + 0.2);
      bookWrap.style.transform = 'scale(' + zoomLevel + ')';
    });
    document.getElementById('btnZoomOut').addEventListener('click', () => {
      zoomLevel = Math.max(0.7, zoomLevel - 0.2);
      bookWrap.style.transform = 'scale(' + zoomLevel + ')';
    });
    document.getElementById('btnZoomReset').addEventListener('click', () => {
      zoomLevel = 1.0;
      bookWrap.style.transform = 'scale(1.0)';
    });

    document.getElementById('btnFullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    });

    pageInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 1 && val <= totalPages) {
        currentIndex = val - 1;
        renderSpread();
      }
    });

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
