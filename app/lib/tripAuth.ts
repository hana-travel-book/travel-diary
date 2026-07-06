import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const UNLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

function unlockKey(tripId: string) {
  return `tripUnlockedUntil_${tripId}`;
}

export function isUnlockedThisSession(tripId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(unlockKey(tripId));
  if (!raw) return false;
  const unlockedUntil = Number(raw);
  if (Number.isNaN(unlockedUntil)) return false;
  return Date.now() < unlockedUntil;
}

export function markUnlocked(tripId: string) {
  if (typeof window === "undefined") return;
  const unlockedUntil = Date.now() + UNLOCK_DURATION_MS;
  localStorage.setItem(unlockKey(tripId), String(unlockedUntil));
}

export interface TripAccessInfo {
  password: string | null;
}

export async function getTripAccessInfo(tripId: string): Promise<TripAccessInfo> {
  const snap = await getDoc(doc(db, "tripAccess", tripId));
  if (snap.exists() && snap.data().password) {
    return { password: snap.data().password };
  }
  return { password: null };
}

export async function setTripPassword(tripId: string, password: string) {
  await setDoc(doc(db, "tripAccess", tripId), { password });
}
