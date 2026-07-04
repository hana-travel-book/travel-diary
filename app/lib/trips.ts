export interface CustomTrip {
  id: string;
  title: string;
  dateRangeLabel: string;
  isCurrent: boolean;
}

const STORAGE_KEY = "travelDiaryCustomTrips";

export function getCustomTrips(): CustomTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
