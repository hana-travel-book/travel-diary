export interface CustomTrip {
  id: string;
  title: string;
  dateRangeLabel: string;
  endDateISO: string;
  isCurrent: boolean;
}

const STORAGE_KEY = "travelDiaryCustomTrips";

export function getCustomTrips(): CustomTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const trips = raw ? JSON.parse(raw) : [];
    // 相容舊資料：如果之前建立的旅程沒有 endDateISO，補上一個空字串
    return trips.map((t: CustomTrip) => ({ ...t, endDateISO: t.endDateISO ?? "" }));
  } catch {
    return [];
  }
}

function writeCustomTrips(trips: CustomTrip[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

export function addCustomTrip(trip: Omit<CustomTrip, "id" | "isCurrent">): CustomTrip {
  const newTrip: CustomTrip = {
    id: `custom-${Date.now()}`,
    title: trip.title,
    dateRangeLabel: trip.dateRangeLabel,
    endDateISO: trip.endDateISO,
    isCurrent: false,
  };
  const trips = getCustomTrips();
  writeCustomTrips([...trips, newTrip]);
  return newTrip;
}

export function removeCustomTrip(id: string) {
  const trips = getCustomTrips().filter((t) => t.id !== id);
  writeCustomTrips(trips);
}

// 判斷某趟旅程是否已經超過「結束日期 + 7 天」，超過就是唯讀模式
export function isTripReadOnly(endDateISO: string): boolean {
  if (!endDateISO) return false;
  const end = new Date(`${endDateISO}T00:00:00`);
  const lockDate = new Date(end);
  lockDate.setDate(end.getDate() + 7);
  const now = new Date();
  return now > lockDate;
}
