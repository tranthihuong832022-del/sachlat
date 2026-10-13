/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Palette,
  Volume2,
  VolumeX,
  Upload,
  ArrowLeft,
  Download,
  Info,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  RenderedPage,
  loadPdfDocument,
  renderPdfPage,
} from './utils/pdfLoader';
import { validatePdfFile, validatePdfBinaryHeader } from './utils/pdfValidator';
import {
  ThemeConfig,
  loadSavedTheme,
  saveTheme,
} from './utils/theme';
import { audioEngine } from './utils/audio';
import {
  generateSampleBookPages,
  SAMPLE_BOOKS,
} from './utils/sampleBook';
import { downloadPagesAsPdf } from './utils/samplePdfDownload';
import { exportStandaloneHtmlFlipbook } from './utils/exportStandaloneHtml';
import { exportFlipbookZipPackage, ZipExportProgress } from './utils/exportZipPackage';
import { UploadArea } from './components/UploadArea';
import { FlipBookViewer } from './components/FlipBookViewer';
import { ReadingToolbar } from './components/ReadingToolbar';
import { ThemeModal } from './components/ThemeModal';
import { PageThumbnailsDrawer } from './components/PageThumbnailsDrawer';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeConfig>(() => loadSavedTheme());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Book & PDF State
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [bookTitle, setBookTitle] = useState<string>('');
  const [isSampleBook, setIsSampleBook] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<{
    step: string;
    percent: number;
    current?: number;
    total?: number;
  }>({ step: '', percent: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ZIP export state
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<ZipExportProgress | null>(null);

  // Viewer Controls
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => audioEngine.getMuted());
  const [volume, setVolume] = useState<number>(() => audioEngine.getVolume());
  const [isAutoFlipping, setIsAutoFlipping] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const bookFlipRef = useRef<{
    flipNext: () => void;
    flipPrev: () => void;
    goToPage: (page: number) => void;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show auto-dismissing toast
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((prev) => (prev?.message === message ? null : prev));
      }, 3500);
    },
    []
  );

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Auto-flip slideshow interval
  useEffect(() => {
    if (!isAutoFlipping || pages.length === 0) return;

    const interval = setInterval(() => {
      if (currentPageIndex >= pages.length - 1) {
        setIsAutoFlipping(false);
        showToast('Đã trình chiếu đến trang cuối cùng!', 'info');
      } else {
        bookFlipRef.current?.flipNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoFlipping, currentPageIndex, pages.length, showToast]);

  // Handle theme updates
  const handleThemeChange = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  // Audio controls
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioEngine.setMuted(newMuted);
    showToast(newMuted ? 'Đã tắt âm thanh lật trang' : 'Đã bật âm thanh lật trang', 'info');
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.0, Math.round((prev + 0.2) * 10) / 10));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.7, Math.round((prev - 0.2) * 10) / 10));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        showToast('Trình duyệt không hỗ trợ chế độ toàn màn hình', 'error');
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Download PDF handler
  const handleDownloadPdf = async () => {
    try {
      if (uploadedFile) {
        // Direct download of original uploaded file
        const url = URL.createObjectURL(uploadedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = uploadedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        showToast(`Đang tải về "${uploadedFile.name}"...`, 'success');
      } else if (pages.length > 0) {
        const filename = `${(bookTitle || 'Ebook_Lat_Trang').replace(/\s+/g, '_')}.pdf`;
        showToast(`Đang kết xuất và tải về "${filename}"...`, 'info');
        await downloadPagesAsPdf(pages, filename);
        showToast(`Đã tải về "${filename}" thành công!`, 'success');
      }
    } catch (err) {
      console.error('Failed to download PDF:', err);
      showToast('Không thể tải file PDF về máy.', 'error');
    }
  };

  // Download single page image
  const handleDownloadCurrentPageImage = () => {
    if (pages.length === 0 || !pages[currentPageIndex]) return;
    try {
      const curPage = pages[currentPageIndex];
      const a = document.createElement('a');
      a.href = curPage.dataUrl;
      const cleanTitle = (bookTitle || 'Sach').replace(/\s+/g, '_');
      a.download = `${cleanTitle}_Trang_${curPage.pageNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Đã tải ảnh chất lượng cao Trang ${curPage.pageNumber} (.png)!`, 'success');
    } catch (err) {
      console.error('Failed to download image:', err);
      showToast('Không thể tải ảnh trang này.', 'error');
    }
  };

  // Download Offline 3D Flipbook ZIP Package (Contains index.html, document.pdf, pages/, HUONG_DAN.txt)
  const handleDownloadZipFlipbook = async () => {
    if (pages.length === 0) return;
    setIsExportingZip(true);
    setZipProgress({ step: 'Khởi tạo gói ZIP sách lật...', percent: 5 });
    try {
      showToast('Đang đóng gói ZIP sách lật 3D...', 'info');
      await exportFlipbookZipPackage(
        pages,
        bookTitle || 'Ebook_Lat_Trang',
        uploadedFile,
        theme.primary,
        (progress) => setZipProgress(progress)
      );
      showToast('Đã tải gói ZIP sách lật 3D thành công! Giải nén và mở index.html để đọc ngoại tuyến.', 'success');
    } catch (err: any) {
      console.error('Failed to export ZIP package:', err);
      showToast(`Không thể xuất gói ZIP: ${err?.message || 'Lỗi xử lý'}`, 'error');
    } finally {
      setIsExportingZip(false);
      setZipProgress(null);
    }
  };

  // Download Standalone Offline 3D HTML Flipbook (Preserves 100% 3D page flip and sound)
  const handleDownloadHtmlFlipbook = () => {
    if (pages.length === 0) return;
    try {
      const cleanTitle = bookTitle || 'Ebook_Lat_Trang';
      showToast('Đang đóng gói file Ebook Lật Trang 3D tự chạy...', 'info');
      exportStandaloneHtmlFlipbook(pages, cleanTitle, theme.primary);
      showToast('Đã tải file Ebook 3D (.html)! Mở bằng trình duyệt để lật trang offline.', 'success');
    } catch (err) {
      console.error('Failed to export standalone HTML:', err);
      showToast('Không thể xuất file Ebook tự chạy.', 'error');
    }
  };

  // Process uploaded PDF file
  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);

    // 1. Validate file format and size
    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Tệp tin không hợp lệ.');
      showToast(validation.errorMessage || 'Tệp tin không hợp lệ.', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingProgress({ step: 'Đang đọc tệp tin...', percent: 10 });

    try {
      // 2. Read array buffer
      const buffer = await file.arrayBuffer();

      // 3. Validate binary header
      const headerValidation = await validatePdfBinaryHeader(buffer);
      if (!headerValidation.isValid) {
        throw new Error(headerValidation.errorMessage);
      }

      setLoadingProgress({ step: 'Đang giải mã tệp PDF...', percent: 25 });

      // 4. Load PDF document
      const pdfDoc = await loadPdfDocument(buffer);
      const numPages = pdfDoc.numPages;

      if (numPages === 0) {
        throw new Error('Tệp PDF không có trang nội dung nào.');
      }

      setLoadingProgress({
        step: `Đang kết xuất ${numPages} trang sách...`,
        percent: 35,
        current: 1,
        total: numPages,
      });

      // 5. Progressive rendering:
      // Render first 4 pages immediately so reader launches rapidly
      const initialBatchCount = Math.min(4, numPages);
      const initialPages: RenderedPage[] = [];

      for (let i = 1; i <= initialBatchCount; i++) {
        setLoadingProgress({
          step: `Đang kết xuất trang ${i} / ${numPages}...`,
          percent: Math.round(35 + (i / initialBatchCount) * 40),
          current: i,
          total: numPages,
        });
        const rendered = await renderPdfPage(pdfDoc, i, 900);
        initialPages.push(rendered);
      }

      // Save uploaded file reference for download!
      setUploadedFile(file);
      setPages([...initialPages]);
      setCurrentPageIndex(0);
      setBookTitle(file.name.replace(/\.[^/.]+$/, ''));
      setIsSampleBook(false);
      setIsLoading(false);
      showToast(`Đã mở "${file.name}" (${numPages} trang)!`, 'success');

      // Continue rendering remaining pages in background if more than initialBatchCount
      if (numPages > initialBatchCount) {
        (async () => {
          const remaining: RenderedPage[] = [...initialPages];
          for (let p = initialBatchCount + 1; p <= numPages; p++) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 30));
              const pageData = await renderPdfPage(pdfDoc, p, 900);
              remaining.push(pageData);
              setPages([...remaining]);
            } catch (err) {
              console.warn(`Error rendering page ${p}:`, err);
            }
          }
        })();
      }
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      const message =
        err?.message ||
        'Không thể mở tệp PDF này. Tệp có thể đã bị hỏng hoặc có mật khẩu bảo vệ.';
      setErrorMessage(message);
      showToast(message, 'error');
      setIsLoading(false);
    }
  };

  // Open built-in sample book
  const handleSelectSampleBook = (bookId: string) => {
    setIsLoading(true);
    setLoadingProgress({ step: 'Đang chuẩn bị sách mẫu...', percent: 50 });

    setTimeout(() => {
      try {
        const samplePages = generateSampleBookPages(bookId);
        const meta = SAMPLE_BOOKS.find((b) => b.id === bookId);

        setUploadedFile(null); // not uploaded file
        setPages(samplePages);
        setCurrentPageIndex(0);
        setBookTitle(meta?.title || 'Sách Mẫu Giáo Dục');
        setIsSampleBook(true);
        setIsLoading(false);
        showToast(`Đã mở "${meta?.title}" (${samplePages.length} trang)`, 'success');
      } catch (err) {
        console.error('Error generating sample book:', err);
        setIsLoading(false);
        setErrorMessage('Không thể tạo sách mẫu. Vui lòng thử lại.');
      }
    }, 150);
  };

  // Download sample book as PDF
  const handleDownloadSamplePdf = async (bookId: string) => {
    try {
      const samplePages = generateSampleBookPages(bookId);
      const meta = SAMPLE_BOOKS.find((b) => b.id === bookId);
      const filename = `${(meta?.title || 'Sach_Mau')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')}.pdf`;

      showToast('Đang tạo file PDF mẫu để tải về...', 'info');
      await downloadPagesAsPdf(samplePages, filename);
      showToast('Đã tải tệp PDF mẫu về máy! Bạn có thể thử tải lên ngay.', 'success');
    } catch (err) {
      console.error('Failed to download sample pdf:', err);
      showToast('Không thể tải file PDF về máy.', 'error');
    }
  };

  // Back to home / open another file
  const handleOpenFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReturnToUpload = () => {
    setPages([]);
    setBookTitle('');
    setErrorMessage(null);
    setCurrentPageIndex(0);
    setIsAutoFlipping(false);
  };

  const isReading = pages.length > 0;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300 overflow-x-hidden font-sans"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {/* Hidden file input for "Mở file khác" */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {/* Top Bar Navigation (Clean 3-zone contract) */}
      <header
        className="w-full border-b transition-colors shrink-0 z-30 shadow-xs"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.surfaceBorder,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single Brand Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isReading && (
              <button
                onClick={handleReturnToUpload}
                className="p-1.5 rounded-lg border hover:bg-black/5 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                style={{ borderColor: theme.surfaceBorder }}
                title="Quay lại trang tải sách"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
            )}
            <div
              onClick={handleReturnToUpload}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div
                className="w-8.5 h-8.5 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105"
                style={{ backgroundColor: theme.primary, color: theme.primaryText }}
              >
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <span className="text-base sm:text-xl font-serif font-bold tracking-tight whitespace-nowrap shrink-0">
                Ebook Lật Trang
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Info / Status */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium" style={{ color: theme.mutedText }}>
            {isReading ? (
              <div className="flex items-center gap-2.5 truncate max-w-md">
                <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                  {bookTitle}
                </span>
                <span>·</span>
                <span>{pages.length} trang</span>
                {isSampleBook && (
                  <>
                    <span>·</span>
                    <span className="text-amber-700 font-medium">Bản mẫu thử</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>Hỗ trợ giáo viên & học sinh</span>
                <span>·</span>
                <span>Mọi thiết bị</span>
                <span>·</span>
                <span>Không cần tài khoản</span>
              </div>
            )}
          </div>

          {/* Zone 3: Primary Action & Quick Settings */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Download CTA in Header when reading */}
            {isReading && (
              <button
                onClick={handleDownloadPdf}
                className="p-2 sm:px-3 sm:py-2 rounded-lg border hover:bg-black/5 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer text-emerald-700 dark:text-emerald-400"
                style={{ borderColor: theme.surfaceBorder }}
                title="Tải cuốn sách PDF này về máy tính"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tải về</span>
              </button>
            )}

            {/* Audio Toggle in Header */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-lg border hover:bg-black/5 transition-colors cursor-pointer"
              style={{
                borderColor: theme.surfaceBorder,
                color: isMuted ? theme.mutedText : theme.primary,
              }}
              title={isMuted ? 'Bật âm thanh lật trang' : 'Tắt âm thanh lật trang'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Theme Customization Button */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border hover:bg-black/5 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              style={{ borderColor: theme.surfaceBorder }}
              title="Tùy chỉnh màu sắc giao diện"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Giao diện</span>
            </button>

            {/* Upload / Switch Book CTA */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-all hover:opacity-95 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              style={{
                backgroundColor: theme.primary,
                color: theme.primaryText,
              }}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isReading ? 'Mở PDF khác' : 'Tải file PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {isReading ? (
          /* ACTIVE READING VIEW */
          <div className="flex-1 flex flex-col h-full relative">
            {/* Top Toolbar in Desktop or Tablet */}
            <ReadingToolbar
              currentPage={currentPageIndex + 1}
              totalPages={pages.length}
              onPrevPage={() => bookFlipRef.current?.flipPrev()}
              onNextPage={() => bookFlipRef.current?.flipNext()}
              onGoToPage={(pageNumber) => bookFlipRef.current?.goToPage(pageNumber - 1)}
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              isMuted={isMuted}
              volume={volume}
              onToggleMute={handleToggleMute}
              onVolumeChange={handleVolumeChange}
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
              onOpenFileSelector={handleOpenFileSelector}
              onOpenThumbnails={() => setIsThumbnailsOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              onDownloadZipFlipbook={handleDownloadZipFlipbook}
              onDownloadCurrentPage={handleDownloadCurrentPageImage}
              isExportingZip={isExportingZip}
              isAutoFlipping={isAutoFlipping}
              onToggleAutoFlip={() => setIsAutoFlipping((prev) => !prev)}
              isBookmarked={isBookmarked}
              onToggleBookmark={() => setIsBookmarked((prev) => !prev)}
              theme={theme}
              bookTitle={bookTitle}
            />

            {/* Book Flip Stage (Centered) */}
            <div className="flex-1 relative w-full h-[calc(100vh-140px)] min-h-[520px] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
              <FlipBookViewer
                pages={pages}
                theme={theme}
                currentPageIndex={currentPageIndex}
                onPageChange={(newIndex) => setCurrentPageIndex(newIndex)}
                zoom={zoom}
                bookRef={bookFlipRef}
              />
            </div>

            {/* Bottom Keyboard & Touch Instructions (Subtle Footer Bar) */}
            <div
              className="w-full py-2 px-4 border-t text-center text-xs transition-colors hidden sm:flex items-center justify-center gap-6 opacity-80"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.surfaceBorder,
                color: theme.mutedText,
              }}
            >
              <span>Phím mũi tên <strong>Trái / Phải</strong> hoặc <strong>Nhấp mép trang</strong> để lật sách</span>
              <span>•</span>
              <span>Nút <strong>Tải sách về</strong> ngay trên khung sách để lưu file PDF</span>
              <span>•</span>
              <span>Phím <strong>F</strong> xem toàn màn hình</span>
            </div>
          </div>
        ) : (
          /* INITIAL UPLOAD & SAMPLE SCREEN */
          <div className="flex-1 flex flex-col justify-center">
            <UploadArea
              theme={theme}
              onFileSelect={handleFileSelect}
              onSelectSampleBook={handleSelectSampleBook}
              onDownloadSamplePdf={handleDownloadSamplePdf}
              isLoading={isLoading}
              loadingProgress={loadingProgress}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(null)}
            />
          </div>
        )}
      </main>

      {/* Theme Customization Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Page Thumbnails Drawer */}
      <PageThumbnailsDrawer
        isOpen={isThumbnailsOpen}
        onClose={() => setIsThumbnailsOpen(false)}
        pages={pages}
        currentPageIndex={currentPageIndex}
        onSelectPage={(index) => {
          setCurrentPageIndex(index);
          bookFlipRef.current?.goToPage(index);
        }}
        theme={theme}
      />

      {/* ZIP Packaging Progress Modal / Banner */}
      {isExportingZip && zipProgress && (
        <div className="fixed top-18 right-6 z-50 bg-white dark:bg-stone-800 border border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 animate-in slide-in-from-top-3 max-w-sm">
          <div className="w-8 h-8 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin shrink-0" />
          <div className="text-xs flex-1">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span>Đang tạo gói ZIP sách lật...</span>
              <span className="font-mono text-emerald-600 font-bold">{zipProgress.percent}%</span>
            </div>
            <div className="text-stone-500 dark:text-stone-400 mt-0.5 text-[11px]">{zipProgress.step}</div>
            <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-200"
                style={{ width: `${zipProgress.percent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4.5 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-stone-900 text-stone-100 border-stone-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4.5 h-4.5 text-sky-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
