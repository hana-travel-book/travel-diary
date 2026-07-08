import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { TimelineItem } from "../data/trip";

function timelineDocId(tripId: string, day: number) {
  return `${tripId}_${day}`;
}

// 即時訂閱某一天的時間軸；連線失敗或尚未有雲端資料時，回傳 fallback（寫死在 trip.ts 裡的預設值）
export function subscribeToTimeline(
  tripId: string,
  day: number,
  fallback: TimelineItem[],
  callback: (items: TimelineItem[]) => void
) {
  const ref = doc(db, "tripTimelines", timelineDocId(tripId, day));
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback((data.items as TimelineItem[]) ?? fallback);
      } else {
        callback(fallback);
      }
    },
    () => {
      // 讀取失敗（離線 / 權限問題）時，維持顯示目前畫面上的內容，不強制蓋掉
      callback(fallback);
    }
  );
}

export async function saveTimelineForDay(
  tripId: string,
  day: number,
  items: TimelineItem[]
) {
  const ref = doc(db, "tripTimelines", timelineDocId(tripId, day));
  // Firestore 不接受 undefined 值，先用 JSON 序列化清除掉再寫入
  const sanitizedItems = JSON.parse(JSON.stringify(items));
  await setDoc(ref, {
    tripId,
    day,
    items: sanitizedItems,
    updatedAt: Date.now(),
  });
}
