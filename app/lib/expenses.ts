export type PaymentMethod = "cash" | "card";

export interface ExpenseItem {
  id: string;
  day: number;
  amount: number;
  note: string;
  method: PaymentMethod;
  addedAt: number;
}

const STORAGE_KEY = "travelDiaryExpenses";

type ExpenseStore = Record<number, ExpenseItem[]>;

function readStore(): ExpenseStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ExpenseStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

export function getAllExpenses(): ExpenseStore {
  return readStore();
}

export function getExpensesForDay(day: number): ExpenseItem[] {
  return readStore()[day] ?? [];
}

export function getDayTotal(day: number): number {
  return getExpensesForDay(day).reduce((sum, e) => sum + e.amount, 0);
}

export function getTripTotal(): number {
  const store = readStore();
  return Object.values(store)
    .flat()
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getTripTotalByMethod(): Record<PaymentMethod, number> {
  const store = readStore();
  const all = Object.values(store).flat();
  return {
    cash: all.filter((e) => e.method === "cash").reduce((sum, e) => sum + e.amount, 0),
    card: all.filter((e) => e.method === "card").reduce((sum, e) => sum + e.amount, 0),
  };
}

export function addExpense(expense: ExpenseItem) {
  const store = readStore();
  const list = store[expense.day] ?? [];
  store[expense.day] = [...list, expense];
  writeStore(store);
}

export function removeExpense(day: number, id: string) {
  const store = readStore();
  store[day] = (store[day] ?? []).filter((e) => e.id !== id);
  writeStore(store);
}
