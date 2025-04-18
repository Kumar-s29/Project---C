importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

// Initialize Firebase with your config
firebase.initializeApp({
  apiKey: "AIzaSyAArcgf9A2A-6sVtcsfAgpV9eJprpHox14",
  authDomain: "project-c-6fb8b.firebaseapp.com",
  projectId: "project-c-6fb8b",
  storageBucket: "project-c-6fb8b.appspot.com",
  messagingSenderId: "88591876986",
  appId: "1:88591876986:web:4528fdbb43e267b6288cc3",
  measurementId: "G-RSPKBHGKWQ",
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const { title, body, icon, click_action } = payload.notification;

  const options = {
    body,
    icon,
    data: { click_action },
    requireInteraction: true,
  };

  self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  const clickAction = event.notification.data.click_action;
  if (clickAction) {
    event.notification.close();
    clients.openWindow(clickAction);
  }
});
