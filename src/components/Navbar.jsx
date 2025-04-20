import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, X, Moon, Sun } from "lucide-react";
import viitlogo from "../assets/viitlogo.png";

const Navbar = () => {
  const { isAdmin, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // mobile menu

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-sky-400 dark:bg-gray-900 text-black dark:text-white px-4 py-3 font-outfit">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold flex">
          <img src={viitlogo} className="w-10 mx-5" alt="VIIT Logo" />
          <div className="mt-2">
            <Link to="/">VIIT - eNOTICE BOARD</Link>
          </div>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-4 font-outfit">
          <Link to="/">Home</Link>

          {isAdmin && (
            <>
              <Link
                to="/upload-notice"
                className="bg-white text-blue-600 px-3 py-1 rounded-xl"
              >
                Upload Notice
              </Link>
              <Link
                to="/admin-dashboard"
                className="bg-white text-blue-600 px-3 py-1 rounded-xl"
              >
                Admin Dashboard
              </Link>
            </>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white dark:bg-black text-black dark:text-yellow-300 px-3 py-1 rounded-xl"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded-xl"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-2">
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/upload-notice"
                className="bg-white text-blue-600 px-3 py-1 rounded-xl"
                onClick={toggleMenu}
              >
                Upload Notice
              </Link>
              <Link
                to="/admin-dashboard"
                className="bg-white text-blue-600 px-3 py-1 rounded-xl"
                onClick={toggleMenu}
              >
                Admin Dashboard
              </Link>
            </>
          )}

          <button
            onClick={() => {
              setDarkMode(!darkMode);
              toggleMenu();
            }}
            className="bg-white dark:bg-black text-black dark:text-yellow-300 px-3 py-1 rounded-xl flex items-center justify-center"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAdmin ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded-xl"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
