export interface TripPhoto {
  id: string;
  day: number;
  itemTitle: string;
  dataUrl: string;
  addedAt: number;
}

function storageKey(tripId: string) {
  return `travelDiaryPhotos_${tripId}`;
}

type PhotoStore = Record<number, TripPhoto[]>;

function readStore(tripId: string): PhotoStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(tripId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(tripId: string, store: PhotoStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(tripId), JSON.stringify(store));
  } catch {
    alert("儲存空間快滿了，建議刪除一些舊照片後再試一次");
  }
}

export function getAllPhotos(tripId: string): PhotoStore {
  return readStore(tripId);
}

export function getPhotosForDay(tripId: string, day: number): TripPhoto[] {
  return readStore(tripId)[day] ?? [];
}

export function addPhoto(tripId: string, photo: TripPhoto) {
  const store = readStore(tripId);
  const list = store[photo.day] ?? [];
  store[photo.day] = [...list, photo];
  writeStore(tripId, store);
}

export function removePhoto(tripId: string, day: number, id: string) {
  const store = readStore(tripId);
  store[day] = (store[day] ?? []).filter((p) => p.id !== id);
  writeStore(tripId, store);
}

// 壓縮圖片，避免佔用太多儲存空間
export function compressImage(file: File, maxWidth = 900, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("no canvas context");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("圖片解碼失敗，可能是不支援的照片格式（例如 HEIC）"));
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const PROFILE_KEY = "travelDiaryProfile";

export interface ProfileData {
  name: string;
  role: string;
  avatar: string;
}

export function getProfile(fallback: ProfileData): ProfileData {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveProfile(profile: ProfileData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

function quoteKey(tripId: string) {
  return `travelDiaryQuote_${tripId}`;
}

export function getQuote(tripId: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(quoteKey(tripId));
    return raw ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveQuote(tripId: string, quote: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(quoteKey(tripId), quote);
  } catch {
    alert("儲存失敗，請再試一次");
  }
}
