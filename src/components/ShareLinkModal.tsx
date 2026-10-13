import React, { useState, useEffect } from 'react';
import {
  X,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Download,
  FileCode,
  Archive,
  FileDown,
  Globe,
  Smartphone,
  Sparkles,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { ThemeConfig } from '../utils/theme';
import {
  getSavedVercelDomain,
  saveVercelDomain,
  buildBookAppUrl,
  downloadUrlShortcutFile,
  downloadHtmlShortcutFile,
  generateQrCodeDataUrl,
} from '../utils/shareUtils';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  bookTitle: string;
  bookId?: string | null;
  sampleBookId?: string | null;
  currentPageIndex: number;
  onDownloadZip: () => void;
  onDownloadPdf: () => void;
  onDownloadStandaloneHtml?: () => void;
  isExportingZip: boolean;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  theme,
  bookTitle,
  bookId,
  sampleBookId,
  currentPageIndex,
  onDownloadZip,
  onDownloadPdf,
  onDownloadStandaloneHtml,
  isExportingZip,
}) => {
  const [vercelDomain, setVercelDomain] = useState<string>('');
  const [isEditingDomain, setIsEditingDomain] = useState<boolean>(false);
  const [tempDomain, setTempDomain] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'link' | 'shortcuts' | 'offline'>('link');

  // Load domain and compute URL
  useEffect(() => {
    if (isOpen) {
      const saved = getSavedVercelDomain();
      setVercelDomain(saved);
      setTempDomain(saved);
      setCopied(false);
    }
  }, [isOpen]);

  // Construct current share URL
  const currentAppUrl = buildBookAppUrl({
    domain: vercelDomain,
    bookId,
    sampleBookId,
    pageIndex: currentPageIndex,
  });

  // Generate QR code when URL changes or modal opens
  useEffect(() => {
    if (isOpen && currentAppUrl) {
      generateQrCodeDataUrl(currentAppUrl).then(setQrCodeUrl);
    }
  }, [isOpen, currentAppUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = currentAppUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveDomain = () => {
    saveVercelDomain(tempDomain);
    setVercelDomain(tempDomain.trim() || window.location.origin);
    setIsEditingDomain(false);
  };

  const handleDownloadUrlShortcut = () => {
    downloadUrlShortcutFile(currentAppUrl, bookTitle);
  };

  const handleDownloadHtmlShortcut = () => {
    downloadHtmlShortcutFile(currentAppUrl, bookTitle);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden"
        style={{ borderColor: theme.surfaceBorder }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: theme.surfaceBorder }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.primary, color: theme.primaryText }}
            >
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>Link App Sách Lật trên Vercel</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                  Trực tuyến
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-xs sm:max-w-md">
                {bookTitle || 'Sách Lật 3D'} • Trang {currentPageIndex + 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          className="flex border-b px-5 pt-2 gap-2 text-xs font-semibold shrink-0 bg-stone-50/60 dark:bg-stone-900/60"
          style={{ borderColor: theme.surfaceBorder }}
        >
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'link'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Link Web App</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Lối Tắt (.url)</span>
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'offline'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Tải Offline & PDF</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: DIRECT LINK APP ON VERCEL */}
          {activeTab === 'link' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Primary Link Box */}
              <div
                className="p-3.5 rounded-xl border bg-stone-50 dark:bg-stone-800/70 space-y-2.5"
                style={{ borderColor: theme.surfaceBorder }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Đường dẫn mở sách lật trực tiếp:
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Mở được trên mọi thiết bị
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      readOnly
                      value={currentAppUrl}
                      className="w-full py-2 px-3 pr-8 rounded-lg border text-xs font-mono select-all bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-hidden"
                      style={{ borderColor: theme.surfaceBorder }}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95"
                    style={{
                      backgroundColor: copied ? '#10B981' : theme.primary,
                      color: theme.primaryText,
                    }}
                    title="Sao chép link vào bộ nhớ tạm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>

                  <a
                    href={currentAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
                    title="Mở thử liên kết trên tab mới"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Vercel Custom Domain Config */}
                <div className="pt-2 border-t border-dashed flex items-center justify-between text-xs" style={{ borderColor: theme.surfaceBorder }}>
                  {!isEditingDomain ? (
                    <>
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 truncate">
                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate">Tên miền Vercel: <code className="text-emerald-700 dark:text-emerald-300 font-medium">{vercelDomain}</code></span>
                      </div>
                      <button
                        onClick={() => setIsEditingDomain(true)}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline shrink-0 cursor-pointer"
                      >
                        Đổi link Vercel
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>Nhập địa chỉ trang Vercel của bạn (ví dụ: https://my-flipbook.vercel.app):</span>
                        <button
                          onClick={() => setIsEditingDomain(false)}
                          className="hover:underline cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="url"
                          placeholder="https://ten-du-an.vercel.app"
                          value={tempDomain}
                          onChange={(e) => setTempDomain(e.target.value)}
                          className="flex-1 py-1 px-2.5 rounded-md border text-xs font-mono bg-white dark:bg-stone-900"
                          style={{ borderColor: theme.surfaceBorder }}
                        />
                        <button
                          onClick={handleSaveDomain}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Quick Scan */}
              <div
                className="p-3.5 rounded-xl border flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/50 dark:bg-emerald-950/20"
                style={{ borderColor: theme.surfaceBorder }}
              >
                {qrCodeUrl ? (
                  <div className="p-2 bg-white rounded-lg shadow-xs border border-stone-200 shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="Mã QR mở sách lật trên Vercel"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                ) : null}

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Quét mã QR để mở sách trên điện thoại</span>
                  </div>
                  <p className="text-[12px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    Dùng camera iPhone hoặc điện thoại Android quét mã QR này để mở trực tiếp sách lật 3D trên trang Vercel mà không cần cài đặt ứng dụng.
                  </p>
                  {qrCodeUrl && (
                    <a
                      href={qrCodeUrl}
                      download={`${bookTitle || 'Sach_Lat'}_QR.png`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline pt-1"
                    >
                      <Download className="w-3 h-3" />
                      Tải ảnh mã QR để in hoặc gửi kèm bài viết
                    </a>
                  )}
                </div>
              </div>

              {/* Benefits highlight */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border bg-stone-50/50 dark:bg-stone-800/40 space-y-0.5" style={{ borderColor: theme.surfaceBorder }}>
                  <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Không lo trang trắng
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Mở trực tiếp trên web Vercel, tải trang mượt mà không cần giải nén tệp.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg border bg-stone-50/50 dark:bg-stone-800/40 space-y-0.5" style={{ borderColor: theme.surfaceBorder }}>
                  <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                    Dễ chia sẻ
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Gửi link qua Zalo, Messenger, Email cho độc giả đọc ngay lập tức.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD SHORTCUT FILES */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Tệp Lối Tắt (Shortcut)</strong> có dung lượng siêu nhẹ (chỉ 1 KB). Khi bạn tải về máy tính và nhấp đúp vào file, nó sẽ <strong>tự động mở trình duyệt và dẫn thẳng đến sách lật trên trang Vercel</strong>!
                </p>
              </div>

              {/* Option 1: .url for Windows */}
              <div
                className="p-3.5 rounded-xl border hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 bg-white dark:bg-stone-800/60"
                style={{ borderColor: theme.surfaceBorder }}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Lối tắt Windows (.url)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-mono">1 KB</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Nhấp đúp trên Windows để mở ngay sách lật trong Google Chrome / Microsoft Edge.
                  </p>
                </div>
                <button
                  onClick={handleDownloadUrlShortcut}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải .url</span>
                </button>
              </div>

              {/* Option 2: .html redirect for Mac/Universal */}
              <div
                className="p-3.5 rounded-xl border hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 bg-white dark:bg-stone-800/60"
                style={{ borderColor: theme.surfaceBorder }}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Tệp Chuyển hướng Web (.html)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-mono">1 KB</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Mở được trên mọi máy tính Mac, Windows, điện thoại, tự động chuyển đến sách trên Vercel.
                  </p>
                </div>
                <button
                  onClick={handleDownloadHtmlShortcut}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải .html</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OFFLINE PACKAGE & ORIGINAL PDF */}
          {activeTab === 'offline' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Nếu bạn cần đọc sách ở những nơi <strong>không có kết nối mạng Internet</strong> hoặc muốn lưu trữ lâu dài:
              </p>

              {/* Gói ZIP Ngoại Tuyến */}
              <div
                className="p-3.5 rounded-xl border flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-800/50"
                style={{ borderColor: theme.surfaceBorder }}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Archive className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Gói ZIP Sách Lật Ngoại Tuyến (.zip)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">100% Offline</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Chứa file index.html (đã nhúng ảnh sẵn không lo trang trắng), PDF gốc và âm thanh lật sách.
                  </p>
                </div>
                <button
                  onClick={onDownloadZip}
                  disabled={isExportingZip}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryText,
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingZip ? 'Đang nén...' : 'Tải gói ZIP'}</span>
                </button>
              </div>

              {/* Tải PDF gốc */}
              <div
                className="p-3.5 rounded-xl border flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-800/50"
                style={{ borderColor: theme.surfaceBorder }}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <FileDown className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                    <span>Tải tệp PDF gốc (.pdf)</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    File tài liệu PDF ban đầu để in ấn hoặc nộp bài.
                  </p>
                </div>
                <button
                  onClick={onDownloadPdf}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
                  style={{ borderColor: theme.surfaceBorder }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải PDF gốc</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-between shrink-0 text-xs"
          style={{ borderColor: theme.surfaceBorder }}
        >
          <span className="text-stone-500 dark:text-stone-400 text-[11px]">
            Hỗ trợ triển khai Vercel, Next.js & React
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
