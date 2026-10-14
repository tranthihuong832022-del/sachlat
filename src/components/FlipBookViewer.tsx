import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RenderedPage } from '../utils/pdfLoader';
import { ThemeConfig } from '../utils/theme';
import { audioEngine } from '../utils/audio';
import { ChevronLeft, ChevronRight, BookOpen, Smartphone, FileText, Monitor } from 'lucide-react';
import { BookOrientation } from './UploadArea';

interface FlipBookViewerProps {
  pages: RenderedPage[];
  theme: ThemeConfig;
  currentPageIndex: number;
  onPageChange: (newPageIndex: number, totalPages: number) => void;
  zoom: number;
  bookRef?: React.MutableRefObject<any>;
  bookOrientation?: BookOrientation;
  onChangeBookOrientation?: (orientation: BookOrientation) => void;
}

export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({
  pages,
  theme,
  currentPageIndex,
  onPageChange,
  zoom,
  bookRef,
  bookOrientation = 'auto',
  onChangeBookOrientation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Display mode: 'dual' (2-page spread) or 'single' (1-page)
  const [viewMode, setViewMode] = useState<'dual' | 'single'>('dual');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [flipAngle, setFlipAngle] = useState<number>(0); // 0 to 180 degrees

  // Pan state for zoom
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Touch swipe tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Auto-detect mobile vs desktop
  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 768) {
        setViewMode('single');
      } else {
        setViewMode('dual');
      }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Calculate natural and effective aspect ratios
  const firstPage = pages[0];
  const naturalRatio = firstPage?.aspectRatio || 0.707;
  const isNaturalLandscape = naturalRatio >= 1.05;

  const isLandscape =
    bookOrientation === 'landscape'
      ? true
      : bookOrientation === 'portrait'
      ? false
      : isNaturalLandscape;

  // Single page aspect ratio
  const singleRatio = isLandscape
    ? (naturalRatio >= 1.05 ? naturalRatio : 1.414)
    : (naturalRatio < 1.05 ? naturalRatio : 0.707);

  // Dual spread aspect ratio
  const dualRatio = currentPageIndex === 0 ? singleRatio : singleRatio * 2;

  // Compute pages in current view
  // In dual mode:
  // - If currentPageIndex === 0: Cover page (Spread 0: only right side)
  // - If currentPageIndex > 0:
  //     leftPageIndex is odd index (e.g., 1, 3, 5...)
  //     rightPageIndex is even index (e.g., 2, 4, 6...)
  const getSpreadPages = useCallback((index: number, mode: 'dual' | 'single') => {
    if (mode === 'single') {
      return {
        leftPage: null,
        rightPage: pages[index] || null,
        leftIndex: -1,
        rightIndex: index,
      };
    }

    if (index === 0) {
      // Cover page shown on right side
      return {
        leftPage: null,
        rightPage: pages[0] || null,
        leftIndex: -1,
        rightIndex: 0,
      };
    }

    // Inside pages:
    // Left page is odd index (1, 3, 5...), right page is next index
    const leftIdx = index % 2 === 1 ? index : index - 1;
    const rightIdx = leftIdx + 1;

    return {
      leftPage: pages[leftIdx] || null,
      rightPage: pages[rightIdx] || null,
      leftIndex: leftIdx,
      rightIndex: rightIdx,
    };
  }, [pages]);

  const { leftPage, rightPage, leftIndex, rightIndex } = getSpreadPages(currentPageIndex, viewMode);

  // Turn to Next Page with realistic 3D flip animation
  const handleNext = useCallback(() => {
    if (isAnimating || pages.length === 0) return;

    let targetIndex = currentPageIndex;
    if (viewMode === 'single') {
      if (currentPageIndex >= pages.length - 1) return;
      targetIndex = currentPageIndex + 1;
    } else {
      if (currentPageIndex === 0) {
        targetIndex = 1;
      } else {
        const nextLeft = (currentPageIndex % 2 === 1 ? currentPageIndex : currentPageIndex - 1) + 2;
        if (nextLeft >= pages.length) return;
        targetIndex = nextLeft;
      }
    }

    // Start 3D page curl animation
    setIsAnimating(true);
    setFlipDirection('next');
    audioEngine.playFlip();

    const startTime = performance.now();
    const duration = 480; // ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth ease-in-out curve
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setFlipAngle(eased * 180);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setFlipDirection(null);
        setFlipAngle(0);
        onPageChange(targetIndex, pages.length);
      }
    };

    requestAnimationFrame(animate);
  }, [isAnimating, pages.length, currentPageIndex, viewMode, onPageChange]);

  // Turn to Previous Page with realistic 3D flip animation
  const handlePrev = useCallback(() => {
    if (isAnimating || pages.length === 0) return;

    let targetIndex = currentPageIndex;
    if (viewMode === 'single') {
      if (currentPageIndex <= 0) return;
      targetIndex = currentPageIndex - 1;
    } else {
      if (currentPageIndex <= 0) return;
      if (currentPageIndex <= 2) {
        targetIndex = 0; // back to cover
      } else {
        const prevLeft = (currentPageIndex % 2 === 1 ? currentPageIndex : currentPageIndex - 1) - 2;
        targetIndex = Math.max(1, prevLeft);
      }
    }

    // Start 3D page curl animation
    setIsAnimating(true);
    setFlipDirection('prev');
    audioEngine.playFlip();

    const startTime = performance.now();
    const duration = 480; // ms

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setFlipAngle(180 - eased * 180);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setFlipDirection(null);
        setFlipAngle(0);
        onPageChange(targetIndex, pages.length);
      }
    };

    requestAnimationFrame(animate);
  }, [isAnimating, pages.length, currentPageIndex, viewMode, onPageChange]);

  // Direct Jump to a specific page
  const handleGoToPage = useCallback((targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < pages.length) {
      audioEngine.playFlip();
      onPageChange(targetIndex, pages.length);
    }
  }, [pages.length, onPageChange]);

  // Expose methods via ref
  useEffect(() => {
    if (bookRef) {
      bookRef.current = {
        flipNext: handleNext,
        flipPrev: handlePrev,
        goToPage: handleGoToPage,
      };
    }
  }, [bookRef, handleNext, handlePrev, handleGoToPage]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleGoToPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleGoToPage(pages.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleGoToPage, pages.length]);

  // Touch gesture listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    // Horizontal swipe detected
    if (Math.abs(dx) > 40 && Math.abs(dy) < 60 && dt < 400) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  // Pan handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDraggingPan(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingPan || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDraggingPan(false);
  };

  useEffect(() => {
    if (zoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Check boundaries
  const isAtFirst = currentPageIndex <= 0;
  const isAtLast = viewMode === 'single'
    ? currentPageIndex >= pages.length - 1
    : (currentPageIndex > 0 ? rightIndex >= pages.length - 1 : pages.length <= 1);

  // Stack paper thickness calculation
  const totalPages = pages.length;
  const currentProgress = totalPages > 0 ? (currentPageIndex + 1) / totalPages : 0;
  const leftStackWidth = Math.min(18, Math.max(2, Math.round(currentProgress * 18)));
  const rightStackWidth = Math.min(18, Math.max(2, Math.round((1 - currentProgress) * 18)));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        cursor: zoom > 1 ? (isDraggingPan ? 'grabbing' : 'grab') : 'default',
      }}
    >
      {/* Ambient Reading Desk Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.deskGlow} 0%, transparent 75%)`,
        }}
      />

      {/* Floating Side Flip Buttons (Positioned safely at the screen edges, never overlapping pages) */}
      <button
        onClick={handlePrev}
        disabled={isAtFirst || isAnimating}
        className={`absolute left-3 sm:left-5 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md transition-all ${
          isAtFirst
            ? 'opacity-0 pointer-events-none'
            : 'opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer'
        }`}
        style={{
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1.5px solid ${theme.surfaceBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
        title="Trang trước (Phím mũi tên Trái)"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        disabled={isAtLast || isAnimating}
        className={`absolute right-3 sm:right-5 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md transition-all ${
          isAtLast
            ? 'opacity-0 pointer-events-none'
            : 'opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer'
        }`}
        style={{
          backgroundColor: theme.surface,
          color: theme.text,
          border: `1.5px solid ${theme.surfaceBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
        title="Trang sau (Phím mũi tên Phải)"
        aria-label="Trang sau"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* View Mode & Orientation Switcher Button (Desktop: 2 Trang vs 1 Trang & Khổ Đứng / Ngang) */}
      <div className="absolute top-2 right-4 z-20 hidden md:flex items-center gap-1 bg-black/15 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-sm">
        <button
          onClick={() => setViewMode('dual')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'dual' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-700 dark:text-stone-200 hover:text-stone-900'
          }`}
          title="Chế độ sách mở 2 trang"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>2 trang</span>
        </button>
        <button
          onClick={() => setViewMode('single')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'single' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-700 dark:text-stone-200 hover:text-stone-900'
          }`}
          title="Chế độ 1 trang to rõ nét"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>1 trang</span>
        </button>

        {/* Orientation Toggle Button */}
        {onChangeBookOrientation && (
          <>
            <div className="w-[1px] h-4 bg-white/30 mx-0.5" />
            <button
              onClick={() => onChangeBookOrientation(isLandscape ? 'portrait' : 'landscape')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-white/80 hover:bg-white text-stone-900 shadow-2xs"
              title={
                isLandscape
                  ? 'Đang hiển thị Khổ ngang (Nhấp để đổi sang Khổ đứng)'
                  : 'Đang hiển thị Khổ đứng (Nhấp để đổi sang Khổ ngang)'
              }
            >
              {isLandscape ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-amber-600" />
                  <span>Khổ ngang</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Khổ đứng</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Main 3D Book Stage (With Zoom and Pan) */}
      <div
        className="relative transition-transform duration-200 ease-out flex items-center justify-center"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center center',
          perspective: '2600px',
        }}
      >
        {/* PHYSICAL HARDCOVER CASING */}
        <div
          className="relative rounded-xl p-2 sm:p-3 transition-all book-cover-depth flex items-center justify-center"
          style={{
            backgroundColor: theme.bookEdge,
            border: `2px solid rgba(255, 255, 255, 0.2)`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Subtle Gilded Corners */}
          <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-amber-300/80 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-amber-300/80 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-amber-300/80 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-amber-300/80 rounded-br-sm pointer-events-none" />

          {/* Left Paper Stack Depth (Physical page stack) */}
          {viewMode === 'dual' && leftPage && leftStackWidth > 0 && (
            <div
              className="absolute left-0 top-3 bottom-3 pointer-events-none transition-all duration-300 z-10"
              style={{
                width: `${leftStackWidth}px`,
                transform: `translateX(-${leftStackWidth}px)`,
                background: `linear-gradient(to left, #D6CEBE, #FAF7F2 50%, #C4B9A5)`,
                borderTopLeftRadius: '3px',
                borderBottomLeftRadius: '3px',
                borderLeft: '1px solid #A89B85',
                boxShadow: '-4px 0 10px rgba(0,0,0,0.18)',
              }}
            />
          )}

          {/* Right Paper Stack Depth */}
          {viewMode === 'dual' && rightStackWidth > 0 && (
            <div
              className="absolute right-0 top-3 bottom-3 pointer-events-none transition-all duration-300 z-10"
              style={{
                width: `${rightStackWidth}px`,
                transform: `translateX(${rightStackWidth}px)`,
                background: `linear-gradient(to right, #D6CEBE, #FAF7F2 50%, #C4B9A5)`,
                borderTopRightRadius: '3px',
                borderBottomRightRadius: '3px',
                borderRight: '1px solid #A89B85',
                boxShadow: '4px 0 10px rgba(0,0,0,0.18)',
              }}
            />
          )}

          {/* BOOK BODY CONTAINER */}
          <div
            className="relative flex items-center justify-center bg-white rounded-md overflow-hidden"
            style={{
              maxHeight: 'calc(100vh - 180px)',
              maxWidth: 'calc(100vw - 60px)',
            }}
          >
            {/* DUAL-PAGE SPREAD VIEW */}
            {viewMode === 'dual' ? (
              <div
                className="relative flex items-stretch bg-stone-100 shadow-inner"
                style={{
                  height: isLandscape ? 'clamp(280px, 58vh, 660px)' : 'clamp(380px, 72vh, 820px)',
                  aspectRatio: `${dualRatio}`,
                }}
              >
                {/* 1. LEFT PAGE (or Empty inside cover if cover is on right) */}
                {currentPageIndex > 0 ? (
                  <div
                    onClick={handlePrev}
                    className="relative w-1/2 h-full bg-white overflow-hidden flex items-center justify-center cursor-pointer group border-r border-stone-200"
                    title="Nhấp để quay lại trang trước"
                  >
                    {leftPage ? (
                      <img
                        src={leftPage.dataUrl}
                        alt={`Trang ${leftPage.pageNumber}`}
                        className="w-full h-full object-contain pointer-events-none select-none bg-white"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FAF8F5]" />
                    )}

                    {/* Left Spine Fold Shadow */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.03) 60%, transparent 100%)',
                      }}
                    />

                    {/* Page Number Indicator */}
                    {leftPage && (
                      <div className="absolute bottom-2 left-4 text-[10px] text-stone-400 font-mono">
                        {leftPage.pageNumber}
                      </div>
                    )}
                  </div>
                ) : null}

                {/* 2. RIGHT PAGE (Cover or right page of spread) */}
                <div
                  onClick={handleNext}
                  className={`relative ${currentPageIndex === 0 ? 'w-full' : 'w-1/2'} h-full bg-white overflow-hidden flex items-center justify-center cursor-pointer group`}
                  title="Nhấp để lật sang trang sau"
                >
                  {rightPage ? (
                    <img
                      src={rightPage.dataUrl}
                      alt={`Trang ${rightPage.pageNumber}`}
                      className="w-full h-full object-contain pointer-events-none select-none bg-white"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#FAF8F5]" />
                  )}

                  {/* Right Spine Fold Shadow (only if left page exists) */}
                  {currentPageIndex > 0 && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.03) 60%, transparent 100%)',
                      }}
                    />
                  )}

                  {/* Page Number Indicator */}
                  {rightPage && (
                    <div className="absolute bottom-2 right-4 text-[10px] text-stone-400 font-mono">
                      {rightPage.pageNumber}
                    </div>
                  )}
                </div>

                {/* 3. DYNAMIC 3D TURNING PAGE LEAF (When animating) */}
                {isAnimating && (
                  <div
                    className="absolute inset-y-0 right-0 w-1/2 pointer-events-none z-30"
                    style={{
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(-${flipDirection === 'next' ? flipAngle : 180 - flipAngle}deg)`,
                    }}
                  >
                    {/* Front Face of Turning Leaf (Right Page being turned) */}
                    <div
                      className="absolute inset-0 w-full h-full bg-white overflow-hidden shadow-2xl"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      {rightPage && (
                        <img
                          src={rightPage.dataUrl}
                          alt="Đang lật"
                          className="w-full h-full object-contain bg-white"
                        />
                      )}
                      {/* Dynamic shading on turning page */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to right, rgba(0,0,0,${Math.sin((flipAngle * Math.PI) / 180) * 0.35}), transparent)`,
                        }}
                      />
                    </div>

                    {/* Back Face of Turning Leaf (Next Left Page) */}
                    <div
                      className="absolute inset-0 w-full h-full bg-white overflow-hidden shadow-2xl"
                      style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      {/* Show next page content on the back */}
                      {pages[rightIndex + 1] && (
                        <img
                          src={pages[rightIndex + 1].dataUrl}
                          alt="Trang kế tiếp"
                          className="w-full h-full object-contain bg-white"
                        />
                      )}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `linear-gradient(to left, rgba(0,0,0,${Math.sin((flipAngle * Math.PI) / 180) * 0.35}), transparent)`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Central Spine Seam Line */}
                {currentPageIndex > 0 && (
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-300/60 pointer-events-none z-20" />
                )}
              </div>
            ) : (
              /* SINGLE-PAGE VIEW (For Mobile or Zoomed-in 1-Page mode) */
              <div
                className="relative bg-white shadow-md overflow-hidden flex items-center justify-center cursor-pointer"
                style={{
                  height: isLandscape ? 'clamp(320px, 72vh, 800px)' : 'clamp(380px, 75vh, 850px)',
                  aspectRatio: `${singleRatio}`,
                }}
                onClick={handleNext}
              >
                {rightPage ? (
                  <img
                    src={rightPage.dataUrl}
                    alt={`Trang ${rightPage.pageNumber}`}
                    className="w-full h-full object-contain pointer-events-none select-none bg-white"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FAF8F5]" />
                )}

                {/* Subtle paper fold highlight */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.04)',
                  }}
                />

                {/* Bottom Page Indicator */}
                {rightPage && (
                  <div className="absolute bottom-2.5 right-4 text-xs font-mono text-stone-500 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200">
                    Trang {rightPage.pageNumber} / {pages.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
