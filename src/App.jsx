import { Routes, Route } from "react-router-dom";
import usePushNotification from "./hooks/usePushNotification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UploadNotice from "./pages/UploadNotice";
import FullView from "./pages/FullView";
import AdminDashboard from "./pages/AdminDashboard";

import "./index.css";
import AllNotices from "./pages/AllNotices";

function App() {
  usePushNotification();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notices" element={<UploadNotice />} />
        <Route path="/all-notices" element={<AllNotices />} />
        <Route path="/upload-notice" element={<UploadNotice />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/notice/:id" element={<FullView />} />{" "}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
