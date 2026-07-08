import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { TaskItem } from "../data/trip";

function taskDocId(tripId: string, day: number) {
  return `${tripId}_${day}`;
}

// 即時訂閱某一天的任務清單；尚未有雲端資料或連線失敗時，回傳 fallback
export function subscribeToTasks(
  tripId: string,
  day: number,
  fallback: TaskItem[],
  callback: (items: TaskItem[]) => void
) {
  const ref = doc(db, "tripTasks", taskDocId(tripId, day));
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback((data.items as TaskItem[]) ?? fallback);
      } else {
        callback(fallback);
      }
    },
    () => {
      callback(fallback);
    }
  );
}

export async function saveTasksSynced(
  tripId: string,
  day: number,
  items: TaskItem[]
) {
  const ref = doc(db, "tripTasks", taskDocId(tripId, day));
  // Firestore 不接受 undefined 值，先用 JSON 序列化清除掉再寫入
  const sanitizedItems = JSON.parse(JSON.stringify(items));
  await setDoc(ref, {
    tripId,
    day,
    items: sanitizedItems,
    updatedAt: Date.now(),
  });
}