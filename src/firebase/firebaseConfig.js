import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

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

// Function to request notification permission and get FCM token
const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.log("No registration token available. Request permission.");
    }
  } catch (error) {
    console.error("Error fetching FCM token:", error);
  }
};

// Listen for notifications when the app is in the foreground
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);

  if (Notification.permission === "granted") {
    const { title, body, icon } = payload.notification;
    new Notification(title, { body, icon });
  } else {
    console.warn("Notification permission not granted.");
  }
});

// Export Firebase services
export { app, auth, db, storage, messaging, analytics, requestForToken };
