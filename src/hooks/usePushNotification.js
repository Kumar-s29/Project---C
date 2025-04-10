// hooks/usePushNotification.js
import { useEffect } from "react";
import { messaging, getToken, onMessage } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const usePushNotification = () => {
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, { vapidKey: VAPID_KEY })
            .then(async (token) => {
              if (token) {
                console.log("✅ FCM Token:", token);

                // 🔥 Store FCM token in Firestore
                try {
                  await setDoc(doc(db, "fcmTokens", token), {
                    token,
                    createdAt: new Date(),
                  });
                  console.log("✅ Token saved to Firestore");
                } catch (err) {
                  console.error("❌ Error saving token to Firestore:", err);
                }
              }
            })
            .catch((err) => {
              console.error("❌ Error getting FCM token:", err);
            });
        }
      });

      // Handle foreground notifications
      onMessage(messaging, (payload) => {
        console.log("🔔 Message received in foreground:", payload);
        const { title, body } = payload.notification;
        alert(`📢 ${title}: ${body}`);
      });
    }
  }, []);
};

export default usePushNotification;
