/**
 * Persistent Storage Utilities for Custom Profile Photo & Authentic Voice Recording
 * Uses IndexedDB for rich audio recordings (handling larger files smoothly)
 * and LocalStorage for fast synchronous avatar caching.
 */

const AVATAR_KEY = 'portfolio_custom_avatar';
const AUDIO_DB_NAME = 'SoumadipPortfolioDB';
const AUDIO_STORE_NAME = 'voiceMedia';
const AUDIO_RECORD_KEY = 'authentic_voice_recording';

// -------------------------------------------------------------
// PROFILE PHOTO PERSISTENCE
// -------------------------------------------------------------

export function getStoredAvatar(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(AVATAR_KEY);
  } catch (err) {
    console.warn('Unable to read avatar from localStorage:', err);
    return null;
  }
}

export function saveStoredAvatar(dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AVATAR_KEY, dataUrl);
  } catch (err) {
    console.warn('Unable to save avatar to localStorage:', err);
  }
}

export function removeStoredAvatar(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AVATAR_KEY);
  } catch (err) {
    console.warn('Unable to remove avatar from localStorage:', err);
  }
}

/**
 * Optimizes an uploaded image file into a high-DPI crisp JPEG data URL
 * Scales down to max 1000px to ensure fast load and safe storage.
 */
export function optimizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (JPEG, PNG, WEBP).'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(optimizedDataUrl);
      };
      img.onerror = () => reject(new Error('Could not load image.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// AUTHENTIC VOICE AUDIO PERSISTENCE (IndexedDB + LocalStorage fallback)
// -------------------------------------------------------------

function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(AUDIO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) {
        db.createObjectStore(AUDIO_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getStoredVoiceAudio(): Promise<string | null> {
  // First check localStorage quick cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('portfolio_voice_cache');
      if (cached) return cached;
    } catch {
      // ignore
    }
  }

  // Fallback to IndexedDB
  try {
    const db = await openAudioDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(AUDIO_STORE_NAME, 'readonly');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      const request = store.get(AUDIO_RECORD_KEY);
      request.onsuccess = () => {
        resolve((request.result as string) || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Error reading stored voice audio:', err);
    return null;
  }
}

export async function saveStoredVoiceAudio(audioDataUrl: string): Promise<void> {
  // Try saving in localStorage if small
  if (typeof window !== 'undefined') {
    try {
      if (audioDataUrl.length < 3 * 1024 * 1024) {
        localStorage.setItem('portfolio_voice_cache', audioDataUrl);
      }
    } catch {
      // if quota exceeded, IndexedDB will handle it
    }
  }

  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      const request = store.put(audioDataUrl, AUDIO_RECORD_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Error saving voice audio to IndexedDB:', err);
  }
}

export async function removeStoredVoiceAudio(): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('portfolio_voice_cache');
    } catch {
      // ignore
    }
  }

  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      const request = store.delete(AUDIO_RECORD_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Error deleting voice audio from IndexedDB:', err);
  }
}
