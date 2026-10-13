import React, { useState } from 'react';
import { X, RotateCcw, Palette, Check } from 'lucide-react';
import { ThemeConfig, PRESET_THEMES, DEFAULT_THEME, getContrastingColor } from '../utils/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: ThemeConfig) => {
    onThemeChange({ ...preset });
  };

  const handleCustomColorChange = (key: 'bg' | 'primary' | 'surface', value: string) => {
    const updated: ThemeConfig = {
      ...currentTheme,
      id: 'custom',
      name: 'Tùy chỉnh riêng',
      [key]: value,
    };
    if (key === 'primary') {
      updated.primaryText = getContrastingColor(value);
    }
    if (key === 'bg') {
      const isDark = getContrastingColor(value) === '#FFFFFF';
      updated.isDark = isDark;
      updated.text = isDark ? '#F8FAFC' : '#1E293B';
      updated.mutedText = isDark ? '#94A3B8' : '#64748B';
      updated.surfaceBorder = isDark ? '#334155' : '#E2E8F0';
    }
    onThemeChange(updated);
  };

  const handleReset = () => {
    onThemeChange({ ...DEFAULT_THEME });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transition-all border"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
          color: currentTheme.text,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <div>
              <h3 className="font-semibold text-lg leading-tight">Tùy Chỉnh Giao Diện</h3>
              <p className="text-xs" style={{ color: currentTheme.mutedText }}>
                Đổi màu nền và điều khiển mà không ảnh hưởng nội dung sách
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            title="Đóng bảng tùy chỉnh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b px-6 pt-3 gap-4 text-sm font-medium" style={{ borderColor: currentTheme.surfaceBorder }}>
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-current font-semibold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={{ color: activeTab === 'presets' ? currentTheme.primary : undefined }}
          >
            Mẫu phối sẵn ({PRESET_THEMES.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-current font-semibold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            style={{ color: activeTab === 'custom' ? currentTheme.primary : undefined }}
          >
            Tự chọn màu chi tiết
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_THEMES.map((preset) => {
                const isSelected = currentTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all relative group ${
                      isSelected
                        ? 'ring-2 ring-offset-1 shadow-xs'
                        : 'hover:border-stone-400'
                    }`}
                    style={{
                      backgroundColor: preset.surface,
                      borderColor: isSelected ? preset.primary : preset.surfaceBorder,
                    }}
                  >
                    {/* Color Swatch Preview */}
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 border flex items-center justify-center shadow-xs overflow-hidden"
                      style={{ backgroundColor: preset.bg, borderColor: preset.surfaceBorder }}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-xs"
                        style={{ backgroundColor: preset.primary }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-medium text-sm flex items-center gap-1.5" style={{ color: preset.text }}>
                        <span>{preset.name}</span>
                        {preset.isDark && (
                          <span className="text-[10px] px-1 py-0.2 rounded bg-slate-700 text-slate-200">
                            Đêm
                          </span>
                        )}
                      </div>
                      <p className="text-xs line-clamp-2 mt-0.5" style={{ color: preset.mutedText }}>
                        {preset.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div
                        className="absolute right-3 top-3.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: preset.primary }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs" style={{ color: currentTheme.mutedText }}>
                Chọn mã màu tùy thích theo phong cách của bạn. Giao diện sẽ tự động căn chỉnh độ tương phản để chữ luôn dễ đọc.
              </p>

              {/* Color pickers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: currentTheme.surfaceBorder }}>
                  <div>
                    <label className="text-sm font-medium block">Màu nền không gian đọc</label>
                    <span className="text-xs" style={{ color: currentTheme.mutedText }}>Nền bàn đọc phía sau cuốn sách</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">{currentTheme.bg}</span>
                    <input
                      type="color"
                      value={currentTheme.bg}
                      onChange={(e) => handleCustomColorChange('bg', e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-black/10 bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: currentTheme.surfaceBorder }}>
                  <div>
                    <label className="text-sm font-medium block">Màu điểm nhấn & Nút bấm</label>
                    <span className="text-xs" style={{ color: currentTheme.mutedText }}>Nút chính, trang đang chọn, viền tiêu điểm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">{currentTheme.primary}</span>
                    <input
                      type="color"
                      value={currentTheme.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-black/10 bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: currentTheme.surfaceBorder }}>
                  <div>
                    <label className="text-sm font-medium block">Màu thanh công cụ</label>
                    <span className="text-xs" style={{ color: currentTheme.mutedText }}>Nền của thanh điều khiển và bảng chức năng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">{currentTheme.surface}</span>
                    <input
                      type="color"
                      value={currentTheme.surface}
                      onChange={(e) => handleCustomColorChange('surface', e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-black/10 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-black/2" style={{ borderColor: currentTheme.surfaceBorder }}>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium opacity-75 hover:opacity-100 transition-opacity py-2 px-3 rounded-lg hover:bg-black/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-opacity hover:opacity-90"
            style={{
              backgroundColor: currentTheme.primary,
              color: currentTheme.primaryText,
            }}
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
