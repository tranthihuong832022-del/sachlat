import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Palette,
  FolderOpen,
  LayoutGrid,
  Download,
  FileDown,
  Archive,
  Image as ImageIcon,
  Play,
  Pause,
  Bookmark,
  Sparkles,
  Loader2,
  Share2,
  Globe,
  Headphones,
} from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface ReadingToolbarProps {
  currentPage: number; // 1-based
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
  onOpenThemeModal: () => void;
  onOpenFileSelector: () => void;
  onOpenThumbnails: () => void;
  onOpenShareModal: () => void;
  onDownloadPdf: () => void; // "Tải PDF gốc"
  onDownloadZipFlipbook: () => void; // "Tải sách lật về" (gói ZIP)
  onDownloadCurrentPage: () => void;
  isExportingZip?: boolean;
  isAutoFlipping?: boolean;
  onToggleAutoFlip?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  isSpeechSpeaking?: boolean;
  isSpeechPlayerOpen?: boolean;
  onToggleSpeechPlayer?: () => void;
  autoReadOnFlip?: boolean;
  onToggleAutoReadOnFlip?: (enabled: boolean) => void;
  theme: ThemeConfig;
  bookTitle?: string;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange,
  onOpenThemeModal,
  onOpenFileSelector,
  onOpenThumbnails,
  onOpenShareModal,
  onDownloadPdf,
  onDownloadZipFlipbook,
  onDownloadCurrentPage,
  isExportingZip = false,
  isAutoFlipping = false,
  onToggleAutoFlip,
  isBookmarked = false,
  onToggleBookmark,
  isSpeechSpeaking = false,
  isSpeechPlayerOpen = false,
  onToggleSpeechPlayer,
  autoReadOnFlip = false,
  onToggleAutoReadOnFlip,
  theme,
  bookTitle,
}) => {
  const [pageInputVal, setPageInputVal] = useState<string>(String(currentPage));
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const volumePopoverRef = useRef<HTMLDivElement>(null);

  // Sync page input value with currentPage
  useEffect(() => {
    setPageInputVal(String(currentPage));
  }, [currentPage]);

  // Click outside to close volume popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumePopoverRef.current && !volumePopoverRef.current.contains(e.target as Node)) {
        setShowVolumePopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInputVal, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onGoToPage(parsed);
    } else {
      setPageInputVal(String(currentPage));
    }
  };

  const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const isAtFirst = currentPage <= 1;
  const isAtLast = currentPage >= totalPages;

  return (
    <div
      className="w-full shadow-md border-b transition-colors z-40 shrink-0 select-none"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.surfaceBorder,
        color: theme.text,
      }}
    >
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left Area: File Management, Outline & 2 Explicit Download Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <button
            onClick={onOpenFileSelector}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs hover:bg-black/5 active:scale-95 transition-all cursor-pointer shrink-0"
            style={{
              borderColor: theme.surfaceBorder,
              color: theme.primary,
            }}
            title="Mở file PDF khác từ máy tính"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mở file khác</span>
          </button>

          <button
            onClick={onOpenThumbnails}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border hover:bg-black/5 transition-colors cursor-pointer shrink-0"
            style={{ borderColor: theme.surfaceBorder }}
            title="Xem danh sách trang thu nhỏ"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mục lục ({totalPages})</span>
          </button>

          {/* BUTTON 0: "Link App Vercel" (Chia sẻ trực tuyến, QR & Tải file Lối tắt .url) */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 hover:bg-black/5 cursor-pointer shrink-0 shadow-2xs"
            style={{
              borderColor: theme.primary,
              color: theme.primary,
            }}
            title="Lấy link đọc sách trực tiếp trên trang Vercel, quét mã QR hoặc tải tệp lối tắt (.url)"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Link App Vercel</span>
          </button>

          {/* BUTTON 1: "Tải sách lật về" (Gói ZIP mở offline có index.html & PDF) */}
          <button
            onClick={onDownloadZipFlipbook}
            disabled={isExportingZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 hover:opacity-95 disabled:opacity-50 cursor-pointer shrink-0"
            style={{
              backgroundColor: theme.primary,
              color: theme.primaryText,
            }}
            title="Tải gói ZIP sách lật 3D mở không cần Internet (chứa file index.html, PDF gốc và ảnh trang)"
          >
            {isExportingZip ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Archive className="w-3.5 h-3.5" />
            )}
            <span>{isExportingZip ? 'Đang nén ZIP...' : 'Tải sách lật về'}</span>
          </button>

          {/* BUTTON 2: "Tải PDF gốc" */}
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs hover:bg-black/5 active:scale-95 transition-all cursor-pointer shrink-0"
            style={{
              borderColor: theme.surfaceBorder,
              color: theme.text,
            }}
            title="Tải file PDF ban đầu để in ấn hoặc nộp bài"
          >
            <FileDown className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
            <span className="hidden sm:inline">Tải PDF gốc</span>
          </button>

          {/* Book Title label */}
          {bookTitle && (
            <span
              className="text-xs font-serif font-medium truncate max-w-[90px] sm:max-w-[140px] lg:max-w-[180px] opacity-75 pl-1 border-l pl-2 hidden md:inline"
              style={{ borderColor: theme.surfaceBorder }}
              title={bookTitle}
            >
              {bookTitle}
            </span>
          )}
        </div>

        {/* Center Area: Page Navigation & Progress */}
        <div className="flex items-center gap-2">
          {/* Previous Page */}
          <button
            onClick={onPrevPage}
            disabled={isAtFirst}
            className={`p-1.5 sm:p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isAtFirst
                ? 'opacity-35 cursor-not-allowed'
                : 'hover:bg-black/5 active:scale-95'
            }`}
            style={{ borderColor: theme.surfaceBorder }}
            title="Trang trước (Phím mũi tên Trái)"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page input form */}
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 text-xs">
            <span className="hidden md:inline font-medium" style={{ color: theme.mutedText }}>
              Trang
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInputVal}
              onChange={(e) => setPageInputVal(e.target.value)}
              onBlur={handlePageInputSubmit}
              className="w-12 h-7.5 sm:h-8 text-center font-bold rounded-lg border text-xs focus:outline-hidden focus:ring-2 transition-all"
              style={{
                backgroundColor: theme.bg,
                borderColor: theme.surfaceBorder,
                color: theme.text,
              }}
              title="Nhập số trang và nhấn Enter để chuyển đến"
            />
            <span className="font-semibold text-xs opacity-75">
              / {totalPages}
            </span>
          </form>

          {/* Next Page */}
          <button
            onClick={onNextPage}
            disabled={isAtLast}
            className={`p-1.5 sm:p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              isAtLast
                ? 'opacity-35 cursor-not-allowed'
                : 'hover:bg-black/5 active:scale-95'
            }`}
            style={{ borderColor: theme.surfaceBorder }}
            title="Trang sau (Phím mũi tên Phải)"
            aria-label="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer ${
                isBookmarked ? 'text-amber-500 bg-amber-500/10' : 'hover:bg-black/5 opacity-70'
              }`}
              style={{ borderColor: theme.surfaceBorder }}
              title={isBookmarked ? 'Bỏ đánh dấu trang này' : 'Đánh dấu trang này'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Auto Flip / Slideshow Toggle */}
          {onToggleAutoFlip && (
            <button
              onClick={onToggleAutoFlip}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isAutoFlipping ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'hover:bg-black/5'
              }`}
              style={{ borderColor: isAutoFlipping ? undefined : theme.surfaceBorder }}
              title={isAutoFlipping ? 'Dừng lật tự động' : 'Tự động lật trang mỗi 5 giây (Trình chiếu giảng dạy)'}
            >
              {isAutoFlipping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{isAutoFlipping ? 'Đang chiếu' : 'Tự động'}</span>
            </button>
          )}
        </div>

        {/* Right Area: Zoom, Volume, Theme, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-0.5 border rounded-lg p-0.5" style={{ borderColor: theme.surfaceBorder }}>
            <button
              onClick={onZoomOut}
              disabled={zoom <= 0.75}
              className="p-1.5 rounded hover:bg-black/5 disabled:opacity-30 transition-all cursor-pointer"
              title="Thu nhỏ (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetZoom}
              className="px-1.5 text-[11px] font-mono font-medium hover:bg-black/5 rounded transition-colors"
              title="Đặt lại kích thước 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              disabled={zoom >= 2.0}
              className="p-1.5 rounded hover:bg-black/5 disabled:opacity-30 transition-all cursor-pointer"
              title="Phóng to (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio toggle & volume popover */}
          <div className="relative" ref={volumePopoverRef}>
            <button
              onClick={() => setShowVolumePopover((prev) => !prev)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isMuted ? 'opacity-60' : 'hover:bg-black/5'
              }`}
              style={{
                borderColor: theme.surfaceBorder,
                color: isMuted ? theme.mutedText : theme.primary,
              }}
              title={isMuted ? 'Âm thanh lật trang đang tắt (Nhấp để bật)' : `Âm thanh lật trang (${Math.round(volume * 100)}%)`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Volume popover */}
            {showVolumePopover && (
              <div
                className="absolute right-0 top-full mt-2 p-3 rounded-xl border shadow-xl z-50 w-60 flex flex-col gap-3 animate-in fade-in zoom-in-95"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.surfaceBorder,
                  color: theme.text,
                }}
              >
                {/* 1. Page flip sound effect */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span>Âm thanh lật trang giấy</span>
                    <button
                      onClick={onToggleMute}
                      className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      {isMuted ? 'Bật âm' : 'Tắt âm'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={onToggleMute} className="opacity-70 hover:opacity-100 cursor-pointer">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-black/10 accent-current"
                      style={{ accentColor: theme.primary }}
                    />
                    <span className="text-[11px] font-mono w-7 text-right">
                      {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                    </span>
                  </div>
                </div>

                {/* 2. Voice reading / Speech section */}
                {onToggleSpeechPlayer && (
                  <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: theme.surfaceBorder }}>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Headphones className="w-3.5 h-3.5" />
                        Giọng đọc nội dung
                      </span>
                      {isSpeechSpeaking && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                          Đang đọc
                        </span>
                      )}
                    </div>

                    {/* Auto Read on Flip toggle */}
                    {onToggleAutoReadOnFlip && (
                      <label className="flex items-center justify-between text-[11px] cursor-pointer hover:opacity-100 opacity-90">
                        <span>Tự động đọc khi lật trang</span>
                        <input
                          type="checkbox"
                          checked={autoReadOnFlip}
                          onChange={(e) => onToggleAutoReadOnFlip(e.target.checked)}
                          className="w-3.5 h-3.5 accent-emerald-600 cursor-pointer"
                        />
                      </label>
                    )}

                    <button
                      onClick={() => {
                        onToggleSpeechPlayer();
                        setShowVolumePopover(false);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      {isSpeechSpeaking ? 'Điều khiển giọng đọc' : 'Bật đọc trang này'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Voice Narration / Speech Reader Button on Toolbar */}
          {onToggleSpeechPlayer && (
            <button
              onClick={onToggleSpeechPlayer}
              className={`relative px-2.5 py-2 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
                isSpeechSpeaking
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-pulse'
                  : isSpeechPlayerOpen
                  ? 'bg-black/10 border-black/20'
                  : 'hover:bg-black/5'
              }`}
              style={{
                borderColor: isSpeechSpeaking ? undefined : theme.surfaceBorder,
                color: isSpeechSpeaking ? '#FFFFFF' : autoReadOnFlip ? theme.primary : theme.text,
              }}
              title={
                isSpeechSpeaking
                  ? 'Đang đọc giọng nói trang sách (Nhấp để mở bảng điều khiển)'
                  : autoReadOnFlip
                  ? 'Giọng đọc đang ở chế độ tự động đọc khi lật (Nhấp để mở)'
                  : 'Đọc to nội dung trang sách (Giọng đọc AI / Text-to-Speech)'
              }
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden lg:inline">
                {isSpeechSpeaking ? 'Đang đọc...' : 'Đọc trang'}
              </span>

              {/* Status indicator badge */}
              {autoReadOnFlip && !isSpeechSpeaking && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Tự động đọc khi lật đang bật" />
              )}
            </button>
          )}

          {/* Theme Palette Button */}
          <button
            onClick={onOpenThemeModal}
            className="p-2 rounded-lg border hover:bg-black/5 transition-all cursor-pointer"
            style={{ borderColor: theme.surfaceBorder }}
            title="Tùy chỉnh màu sắc giao diện"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg border hover:bg-black/5 transition-all cursor-pointer"
            style={{ borderColor: theme.surfaceBorder }}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Xem toàn màn hình'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Thin Reading Progress Indicator Bar at bottom of toolbar */}
      <div className="w-full h-1 bg-black/5 overflow-hidden relative">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: theme.primary,
          }}
          title={`Tiến độ đọc: ${progressPercent}%`}
        />
      </div>
    </div>
  );
};
