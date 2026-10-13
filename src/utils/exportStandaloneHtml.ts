import { RenderedPage } from './pdfLoader';

/**
 * Exports the entire flipbook as a single, self-contained, offline HTML file (.html)
 * When downloaded, anyone can double-click to open in any web browser (Chrome, Edge, Safari, Firefox)
 * on PC, Mac, iPad, or mobile phone. It preserves 100% of the 3D page flip effect, paper sound,
 * zoom, fullscreen, and navigation — NO internet connection and NO software installation required!
 */
export function exportStandaloneHtmlFlipbook(
  pages: RenderedPage[],
  title: string = 'Ebook Lật Trang',
  themeColor: string = '#0D9488'
) {
  const cleanTitle = title.replace(/[<>&"]/g, '');
  const pagesJson = JSON.stringify(pages.map((p) => p.dataUrl));
  const pagesTextJson = JSON.stringify(pages.map((p) => p.textContent || ''));

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanTitle} - Ebook Lật Trang 3D</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #F4EFEA;
      color: #292524;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
      -webkit-user-select: none;
    }
    header {
      height: 52px;
      background: #FFFFFF;
      border-bottom: 1px solid #E5DACF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 15px;
      color: #292524;
    }
    .brand-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: ${themeColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .nav-tools {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #D6CEBE;
      background: #FFFFFF;
      color: #292524;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .btn:hover { background: #F5EFEB; }
    .btn:active { transform: scale(0.97); }
    .btn-primary {
      background: ${themeColor};
      color: #FFFFFF;
      border-color: ${themeColor};
    }
    .stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: radial-gradient(ellipse at center, rgba(217, 199, 180, 0.45) 0%, transparent 75%);
      overflow: hidden;
    }
    .book-wrap {
      perspective: 2600px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease-out;
    }
    .book-casing {
      background: #78350F;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.15);
      position: relative;
    }
    .book-pages {
      display: flex;
      background: #FFFFFF;
      border-radius: 4px;
      overflow: hidden;
      height: min(74vh, 760px);
      aspect-ratio: 2 / 1.414;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
      position: relative;
    }
    .single-mode .book-pages {
      aspect-ratio: 1 / 1.414;
    }
    .page-box {
      width: 50%;
      height: 100%;
      background: #FFFFFF;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
    }
    .single-mode .page-box {
      width: 100%;
    }
    .page-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
    }
    .left-page {
      border-right: 1px solid #E5E7EB;
    }
    .spine-shadow-left {
      position: absolute;
      right: 0; top: 0; bottom: 0; width: 32px;
      background: linear-gradient(to left, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.03) 60%, transparent 100%);
      pointer-events: none;
    }
    .spine-shadow-right {
      position: absolute;
      left: 0; top: 0; bottom: 0; width: 32px;
      background: linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.03) 60%, transparent 100%);
      pointer-events: none;
    }
    .page-number {
      position: absolute;
      bottom: 8px;
      font-size: 11px;
      color: #9CA3AF;
      font-family: monospace;
    }
    .left-page .page-number { left: 16px; }
    .right-page .page-number { right: 16px; }
    /* Animated 3D turning leaf */
    .turning-leaf {
      position: absolute;
      top: 0; bottom: 0; right: 0; width: 50%;
      transform-origin: left center;
      transform-style: preserve-3d;
      pointer-events: none;
      z-index: 30;
    }
    .leaf-face {
      position: absolute;
      inset: 0;
      background: #FFFFFF;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .leaf-front {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .leaf-back {
      transform: rotateY(180deg);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .leaf-face img {
      width: 100%; height: 100%; object-fit: contain;
    }
    .side-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 1px solid #D6CEBE;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      z-index: 40;
      transition: all 0.15s;
    }
    .side-arrow:hover { transform: translateY(-50%) scale(1.08); background: #FAF7F2; }
    .side-arrow:active { transform: translateY(-50%) scale(0.95); }
    .arrow-left { left: 24px; }
    .arrow-right { right: 24px; }
    .side-arrow.disabled { opacity: 0; pointer-events: none; }
    footer {
      height: 44px;
      background: #FFFFFF;
      border-top: 1px solid #E5DACF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      font-size: 12px;
      color: #78716C;
      z-index: 50;
    }
    .page-input {
      width: 44px;
      text-align: center;
      padding: 3px 6px;
      border: 1px solid #D6CEBE;
      border-radius: 4px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="brand-icon">📖</div>
      <span>${cleanTitle}</span>
    </div>
    <div class="nav-tools">
      <button class="btn" id="btnSound">🔊 Âm lật: Bật</button>
      <button class="btn" id="btnSpeech" title="Đọc nội dung trang">🎧 Đọc trang</button>
      <button class="btn" id="btnAutoSpeech" title="Tự động đọc nội dung khi lật trang">⚡ Đọc khi lật: Tắt</button>
      <button class="btn" id="btnMode">📖 2 Trang</button>
      <button class="btn" id="btnZoomOut">🔍-</button>
      <button class="btn" id="btnZoomReset">100%</button>
      <button class="btn" id="btnZoomIn">🔍+</button>
      <button class="btn btn-primary" id="btnFullscreen">⛶ Toàn màn hình</button>
    </div>
  </header>

  <div class="stage">
    <button class="side-arrow arrow-left" id="btnPrev">‹</button>
    <button class="side-arrow arrow-right" id="btnNext">›</button>

    <div class="book-wrap" id="bookWrap">
      <div class="book-casing" id="bookCasing">
        <div class="book-pages" id="bookPages">
          <!-- Left page -->
          <div class="page-box left-page" id="leftPageBox">
            <img id="leftImg" src="" alt="Trang trái" />
            <div class="spine-shadow-left"></div>
            <div class="page-number" id="leftNum"></div>
          </div>
          <!-- Right page -->
          <div class="page-box right-page" id="rightPageBox">
            <img id="rightImg" src="" alt="Trang phải" />
            <div class="spine-shadow-right" id="rightSpine"></div>
            <div class="page-number" id="rightNum"></div>
          </div>
          <!-- 3D Turning Leaf -->
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
    <div>Phím mũi tên <strong>Trái / Phải</strong> hoặc nhấp chuột vào trang để lật</div>
    <div style="display: flex; align-items: center; gap: 6px;">
      <span>Trang</span>
      <input type="text" class="page-input" id="pageInput" value="1" />
      <span id="pageTotal">/ ${pages.length}</span>
    </div>
    <div>Ebook Lật Trang 3D Offline • Tự chạy không cần mạng</div>
  </footer>

  <script>
    const pages = ${pagesJson};
    const pagesText = ${pagesTextJson};
    const totalPages = pages.length;
    let currentIndex = 0;
    let viewMode = window.innerWidth < 768 ? 'single' : 'dual';
    let isSoundOn = true;
    let isAutoSpeech = false;
    let isSpeechSpeaking = false;
    let zoomLevel = 1.0;
    let isFlipping = false;

    function speakCurrentPage() {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const text = pagesText[currentIndex] || ('Trang ' + (currentIndex + 1));
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'vi-VN';
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi'));
        if (viVoice) utt.voice = viVoice;
        utt.onstart = () => {
          isSpeechSpeaking = true;
          const btn = document.getElementById('btnSpeech');
          if (btn) btn.innerText = '⏸ Đang đọc...';
        };
        utt.onend = () => {
          isSpeechSpeaking = false;
          const btn = document.getElementById('btnSpeech');
          if (btn) btn.innerText = '🎧 Đọc trang';
        };
        utt.onerror = () => {
          isSpeechSpeaking = false;
          const btn = document.getElementById('btnSpeech');
          if (btn) btn.innerText = '🎧 Đọc trang';
        };
        window.speechSynthesis.speak(utt);
      } catch (e) {}
    }

    // Web Audio synthesizer for offline flip sound
    let audioCtx = null;
    function playFlipSound() {
      if (!isSoundOn) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const bufferSize = Math.floor(audioCtx.sampleRate * 0.18);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
          const w = Math.random() * 2 - 1;
          data[i] = (last + 0.05 * w) / 1.05;
          last = data[i];
          data[i] *= 2.2;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(1.8, now);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
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
          // Cover
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

      if (isAutoSpeech) {
        speakCurrentPage();
      }
    }

    function flipNext() {
      if (isFlipping) return;
      let nextIdx = currentIndex;
      if (viewMode === 'single') {
        if (currentIndex >= totalPages - 1) return;
        nextIdx = currentIndex + 1;
      } else {
        if (currentIndex === 0) {
          nextIdx = 1;
        } else {
          const nextL = (currentIndex % 2 === 1 ? currentIndex : currentIndex - 1) + 2;
          if (nextL >= totalPages) return;
          nextIdx = nextL;
        }
      }

      playFlipSound();
      isFlipping = true;

      // Setup 3D leaf
      turningLeaf.style.display = 'block';
      leafFrontImg.src = rightImg.src;
      leafBackImg.src = pages[nextIdx] || '';

      let start = null;
      const duration = 460;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min(1, (ts - start) / duration);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const angle = ease * 180;
        turningLeaf.style.transform = 'rotateY(-' + angle + 'deg)';
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
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
      if (viewMode === 'single') {
        prevIdx = currentIndex - 1;
      } else {
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
        const angle = 180 - ease * 180;
        turningLeaf.style.transform = 'rotateY(-' + angle + 'deg)';
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          turningLeaf.style.display = 'none';
          currentIndex = prevIdx;
          isFlipping = false;
          renderSpread();
        }
      }
      requestAnimationFrame(step);
    }

    // Events
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
      this.innerText = isSoundOn ? '🔊 Âm lật: Bật' : '🔇 Âm lật: Tắt';
    });

    const btnSpeech = document.getElementById('btnSpeech');
    if (btnSpeech) {
      btnSpeech.addEventListener('click', function() {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          isSpeechSpeaking = false;
          this.innerText = '🎧 Đọc trang';
        } else {
          speakCurrentPage();
        }
      });
    }

    const btnAutoSpeech = document.getElementById('btnAutoSpeech');
    if (btnAutoSpeech) {
      btnAutoSpeech.addEventListener('click', function() {
        isAutoSpeech = !isAutoSpeech;
        this.innerText = isAutoSpeech ? '⚡ Đọc khi lật: Bật' : '⚡ Đọc khi lật: Tắt';
        if (isAutoSpeech) {
          speakCurrentPage();
        }
      });
    }

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

  // Download standalone HTML file
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filename = `${title.replace(/\s+/g, '_')}_Sach_Lat_3D.html`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
