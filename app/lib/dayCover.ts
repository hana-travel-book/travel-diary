import { compressImage } from "./photos";

function storageKey(tripId: string) {
  return `travelDiaryDayCovers_${tripId}`;
}

type CoverStore = Record<number, string>;

function readStore(tripId: string): CoverStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(tripId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(tripId: string, store: CoverStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(tripId), JSON.stringify(store));
  } catch {
    alert("儲存空間快滿了，請刪除一些照片後再試一次");
  }
}

export function getDayCover(tripId: string, day: number, fallback: string): string {
  const store = readStore(tripId);
  return store[day] ?? fallback;
}

export function saveDayCover(tripId: string, day: number, dataUrl: string) {
  const store = readStore(tripId);
  store[day] = dataUrl;
  writeStore(tripId, store);
}

export { compressImage };
