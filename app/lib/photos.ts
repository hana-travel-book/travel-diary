export interface TripPhoto {
  id: string;
  day: number;
  itemTitle: string;
  dataUrl: string;
  addedAt: number;
}

const STORAGE_KEY = "travelDiaryPhotos";

type PhotoStore = Record<number, TripPhoto[]>;

function readStore(): PhotoStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: PhotoStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    alert("儲存空間快滿了，建議刪除一些舊照片後再試一次");
  }
}

export function getAllPhotos(): PhotoStore {
  return readStore();
}

export function getPhotosForDay(day: number): TripPhoto[] {
  return readStore()[day] ?? [];
}

export function addPhoto(photo: TripPhoto) {
  const store = readStore();
  const list = store[photo.day] ?? [];
  store[photo.day] = [...list, photo];
  writeStore(store);
}

export function removePhoto(day: number, id: string) {
  const store = readStore();
  store[day] = (store[day] ?? []).filter((p) => p.id !== id);
  writeStore(store);
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
      img.onerror = reject;
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

const QUOTE_KEY = "travelDiaryQuote";

export function getQuote(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(QUOTE_KEY);
    return raw ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveQuote(quote: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUOTE_KEY, quote);
  } catch {
    alert("儲存失敗，請再試一次");
  }
}
