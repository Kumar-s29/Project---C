importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

// Initialize Firebase with your config
firebase.initializeApp({
  apiKey: "AIzaSyC4L1RDd0u7NuuxVyiDjtpb9j_zIzmvVD0",
  authDomain: "viit---enotice-board.firebaseapp.com",
  projectId: "viit---enotice-board",
  storageBucket: "viit---enotice-board.firebasestorage.app",
  messagingSenderId: "923236818332",
  appId: "1:923236818332:web:da43c3b3b200f883bc7c59",
  measurementId: "G-XJ61P1T5SN",
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
