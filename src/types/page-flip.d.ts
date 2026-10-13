declare module 'page-flip' {
  export interface PageFlipOptions {
    startPage?: number;
    size?: 'fixed' | 'stretch';
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    destroy(): void;
    update(): void;
    loadFromImages(images: string[]): void;
    loadFromHTML(elements: HTMLElement[] | NodeListOf<HTMLElement>): void;
    updateFromImages(images: string[]): void;
    updateFromHtml(elements: HTMLElement[] | NodeListOf<HTMLElement>): void;
    clear(): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    turnToPage(pageNum: number): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(pageNum: number, corner?: 'top' | 'bottom'): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): 'portrait' | 'landscape';
    getState(): string;
    on(event: 'flip' | 'changeState' | 'changeOrientation' | 'init' | 'update', callback: (e: { data: any; object: PageFlip }) => void): PageFlip;
    off(event: string): void;
  }
}
