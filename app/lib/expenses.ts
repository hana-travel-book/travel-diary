export type PaymentMethod = "cash" | "card";

export interface ExpenseItem {
  id: string;
  day: number;
  amount: number;
  note: string;
  method: PaymentMethod;
  addedAt: number;
}

function storageKey(tripId: string) {
  return `travelDiaryExpenses_${tripId}`;
}

type ExpenseStore = Record<number, ExpenseItem[]>;

function isValidExpense(e: unknown): e is ExpenseItem {
  if (!e || typeof e !== "object") return false;
  const item = e as Partial<ExpenseItem>;
  return (
    typeof item.amount === "number" &&
    !Number.isNaN(item.amount) &&
    (item.method === "cash" || item.method === "card")
  );
}

function readStore(tripId: string): ExpenseStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(tripId));
    const parsed = raw ? JSON.parse(raw) : {};
    const cleaned: ExpenseStore = {};
    for (const key of Object.keys(parsed)) {
      const day = Number(key);
      const list = Array.isArray(parsed[key]) ? parsed[key] : [];
      cleaned[day] = list.filter(isValidExpense);
    }
    return cleaned;
  } catch {
    return {};
  }
}

function writeStore(tripId: string, store: ExpenseStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(tripId), JSON.stringify(store));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

export function getAllExpenses(tripId: string): ExpenseStore {
  return readStore(tripId);
}

export function getExpensesForDay(tripId: string, day: number): ExpenseItem[] {
  return readStore(tripId)[day] ?? [];
}

export function getDayTotal(tripId: string, day: number): number {
  return getExpensesForDay(tripId, day).reduce((sum, e) => sum + e.amount, 0);
}

export function getTripTotal(tripId: string): number {
  const store = readStore(tripId);
  return Object.values(store)
    .flat()
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getTripTotalByMethod(tripId: string): Record<PaymentMethod, number> {
  const store = readStore(tripId);
  const all = Object.values(store).flat();
  return {
    cash: all.filter((e) => e.method === "cash").reduce((sum, e) => sum + e.amount, 0),
    card: all.filter((e) => e.method === "card").reduce((sum, e) => sum + e.amount, 0),
  };
}

export function addExpense(tripId: string, expense: ExpenseItem) {
  const store = readStore(tripId);
  const list = store[expense.day] ?? [];
  store[expense.day] = [...list, expense];
  writeStore(tripId, store);
}

export function updateExpense(
  tripId: string,
  day: number,
  id: string,
  updates: Partial<Omit<ExpenseItem, "id" | "day">>
) {
  const store = readStore(tripId);
  const list = store[day] ?? [];
  store[day] = list.map((e) => (e.id === id ? { ...e, ...updates } : e));
  writeStore(tripId, store);
}

export function removeExpense(tripId: string, day: number, id: string) {
  const store = readStore(tripId);
  store[day] = (store[day] ?? []).filter((e) => e.id !== id);
  writeStore(tripId, store);
}
