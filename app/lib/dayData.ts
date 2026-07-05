import type { TaskItem } from "../data/trip";

const TASKS_KEY = "travelDiaryTasks";
const EXPENSES_KEY = "travelDiaryExpenses";

type TaskStore = Record<number, TaskItem[]>;

function readTaskStore(): TaskStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeTaskStore(store: TaskStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(store));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

// 取得某天的任務清單；如果本機還沒有存過，就用預設資料當作起始值
export function getTasksForDay(day: number, fallback: TaskItem[]): TaskItem[] {
  const store = readTaskStore();
  if (store[day]) return store[day];
  return fallback;
}

export function saveTasksForDay(day: number, tasks: TaskItem[]) {
  const store = readTaskStore();
  store[day] = tasks;
  writeTaskStore(store);
}

type ExpenseStore = Record<number, number>;

function readExpenseStore(): ExpenseStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeExpenseStore(store: ExpenseStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(store));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

export function getExpenseForDay(day: number, fallback: number): number {
  const store = readExpenseStore();
  return store[day] ?? fallback;
}

export function saveExpenseForDay(day: number, amount: number) {
  const store = readExpenseStore();
  store[day] = amount;
  writeExpenseStore(store);
}