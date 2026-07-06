import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "./firebase";

export interface SharedPhoto {
  id: string;
  tripId: string;
  day: number;
  itemTitle: string;
  dataUrl: string;
  addedAt: number;
}

const photosCollection = collection(db, "sharedPhotos");

export function subscribeToPhotos(tripId: string, callback: (photos: SharedPhoto[]) => void) {
  const q = query(photosCollection, where("tripId", "==", tripId), orderBy("addedAt", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const photos: SharedPhoto[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          tripId: data.tripId,
          day: data.day,
          itemTitle: data.itemTitle,
          dataUrl: data.dataUrl,
          addedAt: data.addedAt,
        };
      });
      callback(photos);
    },
    () => {
      // 連線失敗時不中斷 App，直接回傳空陣列，畫面上只會少了共享照片
      callback([]);
    }
  );
}

export async function addSharedPhoto(photo: Omit<SharedPhoto, "id">) {
  await addDoc(photosCollection, photo);
}

export async function deleteSharedPhoto(id: string) {
  await deleteDoc(doc(db, "sharedPhotos", id));
}
