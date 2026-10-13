export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  bg: string;             // Main page background
  surface: string;        // Toolbars and modals
  surfaceBorder: string;  // Hairline border
  text: string;           // Headings and body text
  mutedText: string;      // Captions and metadata
  primary: string;        // Accent / active buttons
  primaryText: string;    // Contrast on primary button
  deskGlow: string;       // Subtle vignette/glow behind book
  bookEdge: string;       // Book binding / edge simulation
  isDark: boolean;
}

export const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'parchment',
    name: 'Nâu giấy cổ điển',
    description: 'Tông màu giấy da ấm áp, tự nhiên như thư viện xưa',
    bg: '#F5EFEB',
    surface: '#FFFFFF',
    surfaceBorder: '#E5DACF',
    text: '#292524',
    mutedText: '#78716C',
    primary: '#854D0E',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(217, 199, 180, 0.4)',
    bookEdge: '#78350F',
    isDark: false,
  },
  {
    id: 'jade',
    name: 'Xanh ngọc dịu',
    description: 'Thanh mát, dịu mắt, phù hợp đọc sách trong thời gian dài',
    bg: '#EDF7F6',
    surface: '#FFFFFF',
    surfaceBorder: '#D1EAE7',
    text: '#134E4A',
    mutedText: '#2DD4BF',
    primary: '#0D9488',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(20, 184, 166, 0.25)',
    bookEdge: '#115E59',
    isDark: false,
  },
  {
    id: 'sage',
    name: 'Xanh lá học tập',
    description: 'Màu xanh lục thảo mộc, khơi gợi tập trung và sáng tạo',
    bg: '#F0F5ED',
    surface: '#FFFFFF',
    surfaceBorder: '#D8E5D3',
    text: '#14532D',
    mutedText: '#4ADE80',
    primary: '#15803D',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(34, 197, 94, 0.22)',
    bookEdge: '#166534',
    isDark: false,
  },
  {
    id: 'lavender',
    name: 'Tím lavender',
    description: 'Lãng mạn, nhẹ nhàng, thanh tao và thư giãn',
    bg: '#F5F3FF',
    surface: '#FFFFFF',
    surfaceBorder: '#DDD6FE',
    text: '#4C1D95',
    mutedText: '#8B5CF6',
    primary: '#7C3AED',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(139, 92, 246, 0.22)',
    bookEdge: '#5B21B6',
    isDark: false,
  },
  {
    id: 'rose',
    name: 'Hồng pastel',
    description: 'Ngọt ngào, êm dịu, dễ chịu cho mắt',
    bg: '#FFF1F2',
    surface: '#FFFFFF',
    surfaceBorder: '#FECDD3',
    text: '#881337',
    mutedText: '#F43F5E',
    primary: '#E11D48',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(244, 63, 94, 0.22)',
    bookEdge: '#9F1239',
    isDark: false,
  },
  {
    id: 'ocean',
    name: 'Xanh dương thanh lịch',
    description: 'Chuyên nghiệp, tinh tế, phong cách giáo dục hiện đại',
    bg: '#F0F9FF',
    surface: '#FFFFFF',
    surfaceBorder: '#BAE6FD',
    text: '#0C4A6E',
    mutedText: '#0284C7',
    primary: '#0284C7',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(14, 165, 233, 0.22)',
    bookEdge: '#0369A1',
    isDark: false,
  },
  {
    id: 'minimal',
    name: 'Trắng tối giản',
    description: 'Phong cách hiện đại tinh khiết, tập trung tối đa vào nội dung',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceBorder: '#E2E8F0',
    text: '#0F172A',
    mutedText: '#64748B',
    primary: '#334155',
    primaryText: '#FFFFFF',
    deskGlow: 'rgba(100, 116, 139, 0.15)',
    bookEdge: '#1E293B',
    isDark: false,
  },
  {
    id: 'midnight',
    name: 'Đêm trầm tĩnh',
    description: 'Giao diện tối chống lóa mắt khi đọc sách vào ban đêm',
    bg: '#0F172A',
    surface: '#1E293B',
    surfaceBorder: '#334155',
    text: '#F1F5F9',
    mutedText: '#94A3B8',
    primary: '#38BDF8',
    primaryText: '#0F172A',
    deskGlow: 'rgba(56, 189, 248, 0.15)',
    bookEdge: '#0284C7',
    isDark: true,
  },
];

export const DEFAULT_THEME = PRESET_THEMES[0]; // Nâu giấy cổ điển default

const THEME_STORAGE_KEY = 'ebook_lat_trang_theme_v2';

/**
 * Calculates luminance to determine whether black or white text has better contrast
 */
export function getContrastingColor(hexColor: string): '#FFFFFF' | '#0F172A' {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return '#FFFFFF';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? '#0F172A' : '#FFFFFF';
}

export function loadSavedTheme(): ThemeConfig {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.bg && parsed.primary) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_THEME;
}

export function saveTheme(theme: ThemeConfig) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch {}
}
