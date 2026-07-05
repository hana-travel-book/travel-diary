import { trip } from "../data/trip";

// 計算今天是旅程的第幾天
export function getCurrentDayNumber(): number {
  const start = new Date(`${trip.start}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.min(Math.max(diff, 1), trip.totalDays);
}

// 判斷今天是不是真的在旅程日期範圍內
export function isWithinTrip(): boolean {
  const start = new Date(`${trip.start}T00:00:00`);
  const end = new Date(`${trip.end}T23:59:59`);
  const now = new Date();
  return now >= start && now <= end;
}

// 目前時間轉成 HH:MM 字串，方便跟 timeline 的 time 比較
export function getCurrentTimeString(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
