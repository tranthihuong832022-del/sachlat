import React, { useRef, useState } from 'react';
import {
  Upload,
  BookOpen,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  BookMarked,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { ThemeConfig } from '../utils/theme';
import { SAMPLE_BOOKS, SampleBookMeta } from '../utils/sampleBook';

interface UploadAreaProps {
  theme: ThemeConfig;
  onFileSelect: (file: File) => void;
  onSelectSampleBook: (bookId: string) => void;
  onDownloadSamplePdf: (bookId: string) => void;
  isLoading: boolean;
  loadingProgress: { step: string; percent: number; current?: number; total?: number };
  errorMessage: string | null;
  onClearError: () => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  theme,
  onFileSelect,
  onSelectSampleBook,
  onDownloadSamplePdf,
  isLoading,
  loadingProgress,
  errorMessage,
  onClearError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-14 flex flex-col items-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Main Title and Introduction */}
      <div className="text-center mb-10 max-w-2xl">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border shadow-2xs backdrop-blur-xs"
          style={{
            backgroundColor: `${theme.primary}12`,
            color: theme.primary,
            borderColor: `${theme.primary}30`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Công Nghệ Lật Trang 3D Độc Quyền Dành Cho Giáo Viên & Độc Giả</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-4 text-balance"
          style={{ color: theme.text }}
        >
          Ebook Lật Trang
        </h1>
        <p className="text-base sm:text-xl font-normal leading-relaxed text-balance" style={{ color: theme.mutedText }}>
          Tải file PDF để bắt đầu đọc sách lật.
        </p>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="w-full mb-8 p-4 rounded-2xl border border-rose-300 bg-rose-50 text-rose-900 flex items-start justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Không thể nạp tệp tin</p>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={onClearError}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline px-2 py-1 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Main 2-Column Split: Upload Zone + Book Preview Illustration */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
        {/* Left Column: Upload Dropzone (7 Cols) */}
        <div
          className={`lg:col-span-7 rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-300 relative overflow-hidden flex flex-col justify-center items-center ${
            isDragOver
              ? 'scale-[1.01] ring-4 shadow-xl'
              : 'hover:shadow-lg'
          }`}
          style={{
            backgroundColor: theme.surface,
            borderColor: isDragOver ? theme.primary : theme.surfaceBorder,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Loading Overlay */}
          {isLoading ? (
            <div className="py-8 w-full flex flex-col items-center justify-center space-y-5">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div
                  className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: `${theme.primary} transparent transparent transparent` }}
                />
                <BookOpen className="w-8 h-8 absolute" style={{ color: theme.primary }} />
              </div>

              <div className="max-w-md w-full px-2 text-center">
                <p className="font-bold text-base mb-1" style={{ color: theme.text }}>
                  {loadingProgress.step || 'Đang xử lý tệp PDF...'}
                </p>
                {loadingProgress.total ? (
                  <p className="text-xs mb-3 font-medium" style={{ color: theme.mutedText }}>
                    Đã chuẩn bị trang {loadingProgress.current} / {loadingProgress.total} ({loadingProgress.percent}%)
                  </p>
                ) : (
                  <p className="text-xs mb-3 font-medium" style={{ color: theme.mutedText }}>
                    {loadingProgress.percent}% hoàn tất
                  </p>
                )}

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-black/10 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-200 ease-out"
                    style={{
                      width: `${loadingProgress.percent}%`,
                      backgroundColor: theme.primary,
                    }}
                  />
                </div>
              </div>

              <p className="text-xs italic opacity-75" style={{ color: theme.mutedText }}>
                Xử lý an toàn 100% trong bộ nhớ trình duyệt, không tải lên máy chủ
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md">
              {/* Upload Icon illustration with subtle pulse */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${theme.primary}18`,
                  color: theme.primary,
                  border: `1.5px solid ${theme.primary}30`,
                }}
              >
                <Upload className="w-9 h-9" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-2.5 font-serif" style={{ color: theme.text }}>
                Kéo thả file PDF vào đây
              </h2>
              <p className="text-sm mb-7 leading-relaxed" style={{ color: theme.mutedText }}>
                Tải lên tài liệu giáo án, truyện, sách giáo khoa hoặc giáo trình để đọc với hiệu ứng lật trang 3D chân thực.
              </p>

              {/* Main Action Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-10 py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryText,
                  boxShadow: `0 8px 24px ${theme.primary}40`,
                }}
              >
                <Upload className="w-5 h-5" />
                <span>Tải file PDF lên</span>
              </button>

              {/* Specifications badges */}
              <div className="mt-8 pt-6 border-t w-full flex flex-wrap items-center justify-center gap-3 text-xs" style={{ borderColor: theme.surfaceBorder, color: theme.mutedText }}>
                <span className="flex items-center gap-1.5 font-medium">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Định dạng: <strong>.PDF</strong>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Tối đa: <strong>50 MB</strong>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Bảo mật: <strong>Riêng tư 100%</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3D Visual Book Experience Showcase (5 Cols) */}
        <div
          className="lg:col-span-5 rounded-3xl p-8 flex flex-col justify-between border shadow-sm relative overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.surfaceBorder,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                Trực quan & Sinh động
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold mb-2" style={{ color: theme.text }}>
              Cảm giác như cầm cuốn sách thật
            </h3>
            <p className="text-xs leading-relaxed mb-6" style={{ color: theme.mutedText }}>
              Âm thanh sột soạt tự nhiên của giấy, nếp gấp gáy sách chân thực, bóng đổ mềm mại cùng các công cụ đọc chuyên dụng cho lớp học.
            </p>

            {/* Realistic 3D Miniature Book Render */}
            <div className="relative py-4 flex items-center justify-center">
              <div
                className="w-64 h-44 rounded-lg shadow-2xl relative flex overflow-hidden border border-amber-900/20"
                style={{
                  background: 'linear-gradient(to right, #FAF7F2 48%, #E5DDD3 50%, #FAF7F2 52%)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                }}
              >
                {/* Center fold spine shadow */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 book-spine-shadow z-10" />

                {/* Left Mini Page */}
                <div className="w-1/2 p-3 flex flex-col justify-between border-r border-stone-200">
                  <div className="space-y-1.5">
                    <div className="w-16 h-2 bg-emerald-800/40 rounded-xs" />
                    <div className="w-full h-1.5 bg-stone-300/80 rounded-xs" />
                    <div className="w-4/5 h-1.5 bg-stone-300/80 rounded-xs" />
                    <div className="w-full h-1.5 bg-stone-300/80 rounded-xs" />
                  </div>
                  <div className="w-full h-12 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-center text-[9px] text-emerald-800 font-serif">
                    Minh họa bài học
                  </div>
                  <div className="text-[8px] text-stone-400 font-mono text-center">- 14 -</div>
                </div>

                {/* Right Mini Page with turning curl visual */}
                <div className="w-1/2 p-3 flex flex-col justify-between bg-white">
                  <div className="space-y-1.5">
                    <div className="w-20 h-2 bg-amber-800/40 rounded-xs" />
                    <div className="w-full h-1.5 bg-stone-300/80 rounded-xs" />
                    <div className="w-full h-1.5 bg-stone-300/80 rounded-xs" />
                    <div className="w-3/4 h-1.5 bg-stone-300/80 rounded-xs" />
                  </div>
                  <div className="w-full h-12 bg-amber-50 border border-amber-200 rounded-sm p-1.5 space-y-1">
                    <div className="w-12 h-1.5 bg-amber-700/50 rounded-xs" />
                    <div className="w-full h-1 bg-amber-600/30 rounded-xs" />
                  </div>
                  <div className="text-[8px] text-stone-400 font-mono text-center">- 15 -</div>
                </div>

                {/* Mini silk ribbon */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-10 bg-rose-600 rounded-b-xs shadow-md z-20" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: theme.surfaceBorder }}>
            <span className="font-medium" style={{ color: theme.mutedText }}>
              Phím mũi tên, chuột hoặc cảm ứng
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Siêu mượt
            </span>
          </div>
        </div>
      </div>

      {/* SAMPLE BOOKS SECTION - Clearly distinguished so users don't confuse with their own files */}
      <div className="w-full pt-10 border-t" style={{ borderColor: theme.surfaceBorder }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                Sách Mẫu Trải Nghiệm Thử
              </span>
              <span className="text-xs font-medium" style={{ color: theme.mutedText }}>
                (Không phải file của bạn)
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold" style={{ color: theme.text }}>
              Khám phá thử ngay khi chưa có sẵn file PDF:
            </h3>
            <p className="text-xs mt-1" style={{ color: theme.mutedText }}>
              Bạn có thể nhấp để đọc thử ngay hoặc tải file PDF mẫu về máy tính để thử nghiệm tính năng tải lên.
            </p>
          </div>
        </div>

        {/* Sample books cards grid with rich cover depth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_BOOKS.map((book: SampleBookMeta) => (
            <div
              key={book.id}
              className="p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] flex flex-col justify-between"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.surfaceBorder,
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${book.coverAccent}15`, color: book.coverAccent }}
                  >
                    {book.tag} • {book.totalPages} trang sách
                  </span>
                  <BookMarked className="w-5 h-5 shrink-0" style={{ color: book.coverAccent }} />
                </div>

                <h4 className="text-lg font-serif font-bold mb-1.5" style={{ color: theme.text }}>
                  {book.title}
                </h4>
                <p className="text-xs font-semibold mb-2 opacity-80" style={{ color: theme.text }}>
                  {book.subtitle}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: theme.mutedText }}>
                  {book.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: theme.surfaceBorder }}>
                <button
                  onClick={() => onSelectSampleBook(book.id)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:opacity-95 active:scale-95 flex items-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.primaryText,
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Đọc thử sách mẫu ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>

                <button
                  onClick={() => onDownloadSamplePdf(book.id)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-black/5 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  style={{ borderColor: theme.surfaceBorder, color: theme.text }}
                  title="Tải file PDF mẫu này về máy"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Tải file PDF về máy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
