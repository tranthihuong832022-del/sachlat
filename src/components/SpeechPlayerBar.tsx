import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Settings,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  Headphones,
  Check,
} from 'lucide-react';
import { ThemeConfig } from '../utils/theme';
import { speechEngine, SpeechState } from '../utils/speechReader';

interface SpeechPlayerBarProps {
  theme: ThemeConfig;
  currentPageNumber: number;
  totalPages: number;
  currentPageText: string;
  bookTitle?: string;
  autoReadOnFlip: boolean;
  onToggleAutoReadOnFlip: (enabled: boolean) => void;
  onClose?: () => void;
}

export const SpeechPlayerBar: React.FC<SpeechPlayerBarProps> = ({
  theme,
  currentPageNumber,
  totalPages,
  currentPageText,
  bookTitle,
  autoReadOnFlip,
  onToggleAutoReadOnFlip,
  onClose,
}) => {
  const [speechState, setSpeechState] = useState<SpeechState>(() => speechEngine.getState());
  const [spokenText, setSpokenText] = useState<string>(() => speechEngine.getCurrentText());
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTextPreview, setShowTextPreview] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(() => speechEngine.getSettings().rate);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string | null>(
    () => speechEngine.getSettings().voiceUri
  );

  // Subscribe to speech engine updates
  useEffect(() => {
    const unsubscribe = speechEngine.subscribeState((state, text) => {
      setSpeechState(state);
      if (text) setSpokenText(text);
    });

    const loadedVoices = speechEngine.getVoices();
    setVoices(loadedVoices);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = () => {
    if (speechState === 'speaking') {
      speechEngine.pause();
    } else if (speechState === 'paused') {
      speechEngine.resume();
    } else {
      speechEngine.speak(currentPageText, {
        pageNumber: currentPageNumber,
        bookTitle,
      });
    }
  };

  const handleStop = () => {
    speechEngine.stop();
  };

  const handleCycleRate = () => {
    const rates = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = rates.indexOf(rate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setRate(nextRate);
    speechEngine.setRate(nextRate);
    // If currently speaking, restart with new rate
    if (speechState === 'speaking') {
      speechEngine.speak(currentPageText, {
        pageNumber: currentPageNumber,
        bookTitle,
      });
    }
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceUri(uri);
    speechEngine.setVoice(uri);
    if (speechState === 'speaking') {
      speechEngine.speak(currentPageText, {
        pageNumber: currentPageNumber,
        bookTitle,
      });
    }
  };

  const displayText = spokenText || currentPageText || 'Trang sách không có văn bản hoặc chỉ có hình ảnh.';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl transition-all duration-300">
      <div
        className="rounded-2xl border shadow-2xl backdrop-blur-md overflow-hidden transition-all"
        style={{
          backgroundColor: theme.surface === '#FFFFFF' ? 'rgba(255,255,255,0.95)' : theme.surface,
          borderColor: theme.surfaceBorder,
          color: theme.text,
        }}
      >
        {/* Main Floating Controls Bar */}
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Speaker icon & Page info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={handleTogglePlay}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm"
              style={{
                backgroundColor: theme.primary,
                color: '#FFFFFF',
              }}
              title={speechState === 'speaking' ? 'Tạm dừng đọc' : 'Đọc nội dung trang'}
            >
              {speechState === 'speaking' ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}

              {/* Animated wave ring when speaking */}
              {speechState === 'speaking' && (
                <span className="absolute -inset-1 rounded-xl border-2 border-emerald-500 animate-ping opacity-30 pointer-events-none" />
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-black/5 uppercase tracking-wide">
                  Trang {currentPageNumber}/{totalPages}
                </span>

                {/* Pulsing audio wave visualizer */}
                {speechState === 'speaking' && (
                  <div className="flex items-end gap-0.5 h-3 px-1">
                    <span className="w-0.5 bg-emerald-500 animate-[bounce_0.6s_infinite_100ms] h-full rounded-full" />
                    <span className="w-0.5 bg-emerald-500 animate-[bounce_0.6s_infinite_250ms] h-3/4 rounded-full" />
                    <span className="w-0.5 bg-emerald-500 animate-[bounce_0.6s_infinite_400ms] h-1/2 rounded-full" />
                  </div>
                )}
                {speechState === 'speaking' && (
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                    Đang đọc trang...
                  </span>
                )}
                {speechState === 'paused' && (
                  <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hidden sm:inline">
                    Đang tạm dừng
                  </span>
                )}
                {speechState === 'idle' && (
                  <span className="text-[11px] font-medium opacity-70 hidden sm:inline">
                    Sẵn sàng đọc giọng nói
                  </span>
                )}
              </div>

              {/* Snippet preview button */}
              <button
                onClick={() => setShowTextPreview((prev) => !prev)}
                className="text-left text-xs truncate max-w-[160px] sm:max-w-xs block opacity-80 hover:opacity-100 hover:underline cursor-pointer"
                title="Nhấp để xem/ẩn phụ đề đoạn văn"
              >
                {displayText}
              </button>
            </div>
          </div>

          {/* Right: Controls & Options */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Stop button */}
            {speechState !== 'idle' && (
              <button
                onClick={handleStop}
                className="p-1.5 sm:p-2 rounded-lg border hover:bg-black/5 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                style={{ borderColor: theme.surfaceBorder }}
                title="Dừng đọc hoàn toàn"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Speed Rate Button */}
            <button
              onClick={handleCycleRate}
              className="px-2 py-1 rounded-lg border text-xs font-mono font-semibold hover:bg-black/5 transition-colors cursor-pointer"
              style={{ borderColor: theme.surfaceBorder }}
              title="Đổi tốc độ đọc (0.75x, 1.0x, 1.25x, 1.5x)"
            >
              {rate}x
            </button>

            {/* Auto Read on Flip Toggle */}
            <button
              onClick={() => onToggleAutoReadOnFlip(!autoReadOnFlip)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                autoReadOnFlip
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'hover:bg-black/5 opacity-80'
              }`}
              style={{ borderColor: autoReadOnFlip ? undefined : theme.surfaceBorder }}
              title="Khi bật: Mỗi lần lật sang trang mới sẽ tự động phát âm thanh đọc nội dung trang đó"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Đọc khi lật</span>
              {autoReadOnFlip && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            {/* Settings toggle */}
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
                showSettings ? 'bg-black/10' : 'hover:bg-black/5'
              }`}
              style={{ borderColor: theme.surfaceBorder }}
              title="Cài đặt giọng đọc & phụ đề"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Close Bar */}
            {onClose && (
              <button
                onClick={() => {
                  handleStop();
                  onClose();
                }}
                className="p-1.5 sm:p-2 rounded-lg border hover:bg-black/5 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                style={{ borderColor: theme.surfaceBorder }}
                title="Đóng thanh đọc sách"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Subtitle / Text Preview Drawer */}
        {showTextPreview && (
          <div
            className="border-t px-4 py-2.5 text-xs sm:text-sm leading-relaxed max-h-36 overflow-y-auto animate-in slide-in-from-top-2"
            style={{
              borderColor: theme.surfaceBorder,
              backgroundColor: theme.bg,
            }}
          >
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold opacity-70 uppercase tracking-wide">
              <span>Nội dung đang đọc (Trang {currentPageNumber})</span>
              <button
                onClick={() => setShowTextPreview(false)}
                className="hover:underline cursor-pointer"
              >
                Thu nhỏ
              </button>
            </div>
            <p className="whitespace-pre-line select-text font-serif">{displayText}</p>
          </div>
        )}

        {/* Expandable Settings Drawer */}
        {showSettings && (
          <div
            className="border-t p-4 space-y-3 text-xs animate-in slide-in-from-top-2"
            style={{
              borderColor: theme.surfaceBorder,
              backgroundColor: theme.bg,
            }}
          >
            <div className="flex items-center justify-between font-semibold pb-1 border-b" style={{ borderColor: theme.surfaceBorder }}>
              <span className="flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Cài đặt Âm thanh Đọc Trang Sách
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {/* Auto Read Switch */}
            <label className="flex items-center justify-between p-2 rounded-lg bg-black/5 cursor-pointer">
              <div>
                <div className="font-semibold text-xs">Tự động đọc giọng nói khi lật trang</div>
                <div className="text-[11px] opacity-75">
                  Mỗi khi bạn nhấn lật hoặc quẹt sang trang mới, app sẽ tự động đọc nội dung trang
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoReadOnFlip}
                onChange={(e) => onToggleAutoReadOnFlip(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </label>

            {/* Voice selector */}
            <div>
              <label className="block font-semibold mb-1">Chọn giọng đọc hệ thống:</label>
              <select
                value={selectedVoiceUri || ''}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full p-2 rounded-lg border text-xs bg-white dark:bg-stone-800 focus:outline-hidden"
                style={{ borderColor: theme.surfaceBorder }}
              >
                <option value="">Giọng Tiếng Việt chuẩn mặc định</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Speed Selection */}
            <div>
              <label className="block font-semibold mb-1">Tốc độ đọc giọng nói:</label>
              <div className="grid grid-cols-4 gap-2">
                {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setRate(spd);
                      speechEngine.setRate(spd);
                      if (speechState === 'speaking') {
                        speechEngine.speak(currentPageText, {
                          pageNumber: currentPageNumber,
                          bookTitle,
                        });
                      }
                    }}
                    className={`py-1.5 text-center font-bold rounded-lg border transition-all cursor-pointer ${
                      rate === spd
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'hover:bg-black/5'
                    }`}
                    style={{ borderColor: rate === spd ? undefined : theme.surfaceBorder }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
