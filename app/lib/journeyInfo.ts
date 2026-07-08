import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface JourneyInfo {
  title: string;
  city: string;
}

function journeyInfoDocId(tripId: string, day: number) {
  return `${tripId}_${day}`;
}

// 即時訂閱某一天的標題／城市；尚未有雲端資料或連線失敗時，回傳 fallback（trip.ts 裡寫死的預設值）
export function subscribeToJourneyInfo(
  tripId: string,
  day: number,
  fallback: JourneyInfo,
  callback: (info: JourneyInfo) => void
) {
  const ref = doc(db, "journeyInfo", journeyInfoDocId(tripId, day));
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback({
          title: (data.title as string) ?? fallback.title,
          city: (data.city as string) ?? fallback.city,
        });
      } else {
        callback(fallback);
      }
    },
    () => {
      callback(fallback);
    }
  );
}

export async function saveJourneyInfo(
  tripId: string,
  day: number,
  info: JourneyInfo
) {
  const ref = doc(db, "journeyInfo", journeyInfoDocId(tripId, day));
  await setDoc(ref, {
    tripId,
    day,
    title: info.title,
    city: info.city,
    updatedAt: Date.now(),
  });
}