# 📢 College Notice Board Web Application

A modern web application built for college students and administrators to upload, manage, and view official notices. This project supports category-based filtering, real-time Firestore integration, and role-based access (admin & users).

---

## 🚀 Features

- ✅ User-friendly UI with clean card-based layout  
- ✅ Filter notices by category (Exams, Events, Academic, etc.)  
- ✅ Upload notice with attachments (Admin only)  
- ✅ Firebase Firestore for database   
- ✅ Real-time data updates  
- ✅ Mobile responsive design  
- ✅ Notification popup on successful submission  
- ✅ Pagination for easy browsing  
- ✅ View full notice details via dynamic route  

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Firebase Firestore, Firebase Storage  
- **Routing**: React Router DOM  
- **Authentication**: Firebase Auth 

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kumar-s29/Project---C
   cd Project---C
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a project on [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore and Firebase Storage
   - Copy your Firebase config and paste it inside a `firebase.js` file in `/src`

   ```js
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getStorage } from "firebase/storage";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "SENDER_ID",
     appId: "APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```

4. **Run the app**
   ```bash
   npm run dev  # for Vite
   # OR
   npm start    # for CRA (Create React App)
   ```

---

## 🧪 Sample Admin Flow

1. Go to `/upload-notice`
2. Fill in the notice title, description, select category
3. Submit the notice
4. Users can view it on the homepage with filter and pagination support

---

## 🙌 Contributors

- 👨‍💻 [Swayamvarapu Kumara Swamy](https://github.com/Kumar-s29)
- 👨‍💻 [Srimanthula Sai Thanmai](https://github.com/Thanmai44)
- 👨‍💻 [Sasanapuri Reshma](https://github.com/)
- 👨‍💻 [Challapalli Sai Sudhanv](https://github.com/saisudhanv)
- 👨‍💻 [Thandra Jaideep](https://github.com/Jaideepthandra)
---
