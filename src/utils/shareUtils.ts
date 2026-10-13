import QRCode from 'qrcode';

const STORAGE_KEY_VERCEL_DOMAIN = 'ebook_lat_trang_vercel_domain';

/**
 * Retrieves the stored Vercel deployment URL or defaults to window.location.origin
 */
export function getSavedVercelDomain(): string {
  if (typeof window === 'undefined') return 'https://sach-lat-ebook.vercel.app';
  const saved = localStorage.getItem(STORAGE_KEY_VERCEL_DOMAIN);
  if (saved && saved.trim()) {
    return saved.trim().replace(/\/+$/, '');
  }
  // If running in development or preview or vercel, use origin
  const origin = window.location.origin;
  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return origin.replace(/\/+$/, '');
  }
  return origin || 'https://sach-lat-ebook.vercel.app';
}

/**
 * Saves custom Vercel domain preference
 */
export function saveVercelDomain(domain: string): void {
  if (typeof window === 'undefined') return;
  const clean = domain.trim().replace(/\/+$/, '');
  if (clean) {
    localStorage.setItem(STORAGE_KEY_VERCEL_DOMAIN, clean);
  } else {
    localStorage.removeItem(STORAGE_KEY_VERCEL_DOMAIN);
  }
}

export interface ShareUrlOptions {
  domain?: string;
  bookId?: string | null;
  sampleBookId?: string | null;
  pageIndex?: number;
  pdfUrl?: string | null;
}

/**
 * Constructs the full shareable URL to open the flipbook app on Vercel
 */
export function buildBookAppUrl(options: ShareUrlOptions): string {
  const baseDomain = (options.domain || getSavedVercelDomain()).replace(/\/+$/, '');
  const params = new URLSearchParams();

  if (options.sampleBookId) {
    params.set('sample', options.sampleBookId);
  } else if (options.bookId) {
    params.set('id', options.bookId);
  } else if (options.pdfUrl) {
    params.set('pdf', options.pdfUrl);
  }

  if (typeof options.pageIndex === 'number' && options.pageIndex > 0) {
    params.set('page', String(options.pageIndex + 1));
  }

  const query = params.toString();
  return query ? `${baseDomain}/?${query}` : baseDomain;
}

/**
 * Generates and triggers download of a Windows .url Internet Shortcut file.
 * Double-clicking this file on Windows immediately opens the Vercel flipbook link!
 */
export function downloadUrlShortcutFile(url: string, title: string): void {
  const safeName = (title || 'Sach_Lat_3D')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_');
  const filename = `${safeName}_Link_Vercel.url`;

  const content = `[InternetShortcut]\r\nURL=${url}\r\nIconIndex=0\r\n`;
  const blob = new Blob([content], { type: 'application/internet-shortcut' });
  const downloadUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

/**
 * Generates and triggers download of a universal HTML redirect shortcut file.
 * Double-clicking this file on Mac, Windows, Linux, or mobile opens the browser
 * and instantly redirects to the flipbook on Vercel!
 */
export function downloadHtmlShortcutFile(url: string, title: string): void {
  const safeName = (title || 'Sach_Lat_3D')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_');
  const filename = `${safeName}_Mo_Tren_Vercel.html`;

  const safeTitle = (title || 'Sách Lật 3D').replace(/[<>&"]/g, '');

  const content = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${url}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mở Sách Lật Trên Vercel: ${safeTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #FAF7F2;
      color: #382F2D;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: white;
      padding: 32px 28px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      max-width: 440px;
      width: 100%;
      border: 1px solid #EBE4DC;
    }
    h2 { font-size: 18px; margin-bottom: 8px; color: #1C1917; }
    p { font-size: 14px; color: #78716C; margin-bottom: 20px; }
    a.btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      background: #0D9488;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      border-radius: 10px;
      transition: opacity 0.2s;
    }
    a.btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 36px; margin-bottom: 12px;">📖</div>
    <h2>Đang mở "${safeTitle}" trên Vercel...</h2>
    <p>Trình duyệt sẽ tự động chuyển tiếp đến liên kết sách lật trong giây lát.</p>
    <a class="btn" href="${url}">Nhấp vào đây nếu không tự chuyển tiếp</a>
  </div>
  <script>
    window.location.replace("${url}");
  </script>
</body>
</html>`;

  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

/**
 * Generates high quality QR code data URL (PNG)
 */
export async function generateQrCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1C1917',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return '';
  }
}
