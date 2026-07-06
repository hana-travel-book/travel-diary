import type { TaskItem } from "../data/trip";

function storageKey(tripId: string) {
  return `travelDiaryTasks_${tripId}`;
}

type TaskStore = Record<number, TaskItem[]>;

function readTaskStore(tripId: string): TaskStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(tripId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeTaskStore(tripId: string, store: TaskStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(tripId), JSON.stringify(store));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

// 取得某天的任務清單；如果本機還沒有存過，就用預設資料當作起始值
export function getTasksForDay(tripId: string, day: number, fallback: TaskItem[]): TaskItem[] {
  const store = readTaskStore(tripId);
  if (store[day]) return store[day];
  return fallback;
}

export function saveTasksForDay(tripId: string, day: number, tasks: TaskItem[]) {
  const store = readTaskStore(tripId);
  store[day] = tasks;
  writeTaskStore(tripId, store);
}
