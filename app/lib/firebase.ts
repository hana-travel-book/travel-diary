import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function createDb() {
  const alreadyInitialized = getApps().length > 0;
  const app = alreadyInitialized ? getApp() : initializeApp(firebaseConfig);

  if (alreadyInitialized) {
    return getFirestore(app);
  }

  // Safari 對 Firestore 預設的串流連線方式有相容性問題，
  // 改用長輪詢模式避免連線被瀏覽器的安全機制擋下
  return initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
}

export const db = createDb();
