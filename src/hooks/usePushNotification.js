import { useEffect } from "react";
import { messaging, getToken, onMessage } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const usePushNotification = () => {
  useEffect(() => {
    const setupFCM = async () => {
      if (!("Notification" in window)) {
        console.warn("🚫 This browser does not support notifications.");
        return;
      }

      const permission = await Notification.requestPermission();
      console.log("📣 Notification permission:", permission);

      if (permission !== "granted") {
        console.warn("⚠️ Notification permission not granted");
        return;
      }

      try {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (token) {
          console.log("✅ FCM Token:", token);

          // Save token to Firestore
          try {
            await setDoc(doc(db, "fcmTokens", token), {
              token,
              createdAt: new Date(),
            });
            console.log("✅ Token saved to Firestore");
          } catch (err) {
            console.error("❌ Firestore write error:", err);
          }
        } else {
          console.warn("⚠️ getToken returned null. Token not available.");
        }
      } catch (err) {
        console.error("❌ getToken error:", err);
      }

      // Foreground message listener
      onMessage(messaging, (payload) => {
        console.log("🔔 Foreground message received:", payload);
        const { title, body } = payload.notification || {};

        if (title && body) {
          // Show a custom UI alert or toast instead of alert()
          alert(`📢 ${title}: ${body}`);
          // You can also implement a custom toast or modal UI here
        }
      });
    };

    setupFCM();
  }, []);
};

export default usePushNotification;
