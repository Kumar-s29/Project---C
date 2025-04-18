import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

// Firebase config using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

// Request FCM token
const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.log("No token available. Request permission to generate one.");
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
};

// Foreground message handler
onMessage(messaging, (payload) => {
  console.log("Message received in foreground:", payload);
  const { title, body, icon } = payload.notification;
  new Notification(title, { body, icon });
});

export {
  app,
  auth,
  db,
  storage,
  messaging,
  analytics,
  requestForToken,
  getToken,
  onMessage,
};
