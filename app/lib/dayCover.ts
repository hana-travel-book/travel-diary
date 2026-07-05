import { compressImage } from "./photos";

const STORAGE_KEY = "travelDiaryDayCovers";

type CoverStore = Record<number, string>;

function readStore(): CoverStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: CoverStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    alert("儲存空間快滿了，請刪除一些照片後再試一次");
  }
}

export function getDayCover(day: number, fallback: string): string {
  const store = readStore();
  return store[day] ?? fallback;
}

export function saveDayCover(day: number, dataUrl: string) {
  const store = readStore();
  store[day] = dataUrl;
  writeStore(store);
}

export { compressImage };
