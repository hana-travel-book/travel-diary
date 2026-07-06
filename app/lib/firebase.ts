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

  // Safari 的 Intelligent Tracking Prevention（智慧型追蹤預防）
  // 會擋掉 Firestore 預設的串流連線，強制改用長輪詢模式來繞過這個限制
  return initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
}

export const db = createDb();
