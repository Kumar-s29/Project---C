import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const protectedRoutes = ["/admin-dashboard", "/upload-notice"];
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isProtected = protectedRoutes.includes(location.pathname);
      if (!user && isProtected) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);

  return null;
};

export default AuthGuard;
