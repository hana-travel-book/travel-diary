import { trip } from "../data/trip";
import type { ChecklistItem } from "../data/trip";

const STORAGE_KEY = "travelDiaryChecklist";

export function getChecklist(): ChecklistItem[] {
  if (typeof window === "undefined") return trip.checklist;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // 第一次使用，用預設清單當起點
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip.checklist));
    return trip.checklist;
  } catch {
    return trip.checklist;
  }
}

function saveChecklist(items: ChecklistItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

export function toggleChecklistItem(id: string): ChecklistItem[] {
  const items = getChecklist().map((i) =>
    i.id === id ? { ...i, done: !i.done } : i
  );
  saveChecklist(items);
  return items;
}

export function addChecklistItem(label: string): ChecklistItem[] {
  const newItem: ChecklistItem = {
    id: `c-${Date.now()}`,
    label,
    done: false,
  };
  const items = [...getChecklist(), newItem];
  saveChecklist(items);
  return items;
}

export function removeChecklistItem(id: string): ChecklistItem[] {
  const items = getChecklist().filter((i) => i.id !== id);
  saveChecklist(items);
  return items;
}
