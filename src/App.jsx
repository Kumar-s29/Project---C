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
import ProtectedRoute from "./components/ProtectedRoute";
import AuthGuard from "./components/AuthGuard";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import ImportantUpdates from "./components/ImportantUpdates";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const protectedRoutes = ["/upload-notice", "/admin-dashboard"];
    if (!isAdmin && protectedRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [location, isAdmin, navigate]);
  usePushNotification();
  return (
    <>
      <Navbar />
      <AuthGuard />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notices" element={<UploadNotice />} />
        <Route path="/all-notices" element={<AllNotices />} />
        <Route
          path="/upload-notice"
          element={
            <ProtectedRoute>
              <UploadNotice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/notice/:id" element={<FullView />} />{" "}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
