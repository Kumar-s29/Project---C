// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(storedAdmin);
  }, []);

  const loginAsAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem("isAdmin", "true");
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");

    // Prevent back navigation to protected pages
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", function () {
      window.history.pushState(null, null, window.location.href);
    });
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
