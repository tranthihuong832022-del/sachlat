/**
 * Client-side IndexedDB storage for offline & persistent book library.
 * Allows uploaded PDFs to be saved locally so that when opening a direct link
 * like https://your-app.vercel.app/?id=book_123, the book opens immediately!
 */

const DB_NAME = 'EbookLatTrangDB';
const DB_VERSION = 1;
const STORE_NAME = 'books';

export interface StoredBook {
  id: string;
  title: string;
  fileBlob: Blob;
  fileName: string;
  totalPages: number;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB không được hỗ trợ trên trình duyệt này.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBookToStorage(
  id: string,
  title: string,
  fileBlob: Blob,
  fileName: string,
  totalPages: number
): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: StoredBook = {
        id,
        title,
        fileBlob,
        fileName,
        totalPages,
        updatedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Lỗi lưu sách vào IndexedDB:', err);
  }
}

export async function getBookFromStorage(id: string): Promise<StoredBook | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Lỗi đọc sách từ IndexedDB:', err);
    return null;
  }
}

export async function listStoredBooks(): Promise<StoredBook[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const books: StoredBook[] = req.result || [];
        books.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(books);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Lỗi danh sách sách:', err);
    return [];
  }
}
