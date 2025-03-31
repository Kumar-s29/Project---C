importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAArcgf9A2A-6sVtcsfAgpV9eJprpHox14",
  authDomain: "project-c-6fb8b.firebaseapp.com",
  projectId: "project-c-6fb8b",
  storageBucket: "project-c-6fb8b.firebasestorage.app",
  messagingSenderId: "88591876986",
  appId: "1:88591876986:web:4528fdbb43e267b6288cc3",
  measurementId: "G-RSPKBHGKWQ",
});

const messaging = firebase.messaging();

// ✅ Handle background push notifications properly
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const { title, body, icon } = payload.notification;

  self.registration.showNotification(title, { body, icon });
});
