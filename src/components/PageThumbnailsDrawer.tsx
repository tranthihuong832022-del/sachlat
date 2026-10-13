import React from 'react';
import { X, Check } from 'lucide-react';
import { RenderedPage } from '../utils/pdfLoader';
import { ThemeConfig } from '../utils/theme';

interface PageThumbnailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pages: RenderedPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  theme: ThemeConfig;
}

export const PageThumbnailsDrawer: React.FC<PageThumbnailsDrawerProps> = ({
  isOpen,
  onClose,
  pages,
  currentPageIndex,
  onSelectPage,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm sm:max-w-md h-full shadow-2xl flex flex-col border-l transition-all animate-in slide-in-from-right duration-200"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.surfaceBorder,
          color: theme.text,
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: theme.surfaceBorder }}>
          <div>
            <h3 className="font-semibold text-base">Danh Sách Trang ({pages.length})</h3>
            <p className="text-xs" style={{ color: theme.mutedText }}>
              Nhấp vào trang để chuyển đến ngay
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            title="Đóng danh sách trang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5">
          {pages.map((page, index) => {
            const isSelected = index === currentPageIndex;
            return (
              <button
                key={page.pageNumber}
                onClick={() => {
                  onSelectPage(index);
                  onClose();
                }}
                className={`relative rounded-xl overflow-hidden border p-1 text-left flex flex-col transition-all cursor-pointer group ${
                  isSelected
                    ? 'ring-2 shadow-md'
                    : 'hover:border-stone-400 hover:shadow-xs'
                }`}
                style={{
                  backgroundColor: theme.bg,
                  borderColor: isSelected ? theme.primary : theme.surfaceBorder,
                }}
              >
                <div className="relative aspect-[1/1.4] w-full rounded-lg overflow-hidden bg-white shadow-xs">
                  <img
                    src={page.dataUrl}
                    alt={`Trang ${page.pageNumber}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="mt-1.5 px-1 py-0.5 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? 'text-primary' : ''}`}>
                    {index === 0 ? 'Bìa trước' : index === pages.length - 1 ? 'Bìa sau' : `Trang ${page.pageNumber}`}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold" style={{ color: theme.primary }}>
                      Đang đọc
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
