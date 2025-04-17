import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-sky-900 dark:bg-gray-900 text-black dark:text-white py-8 mt-15 font-outfit">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h1 className="text-2xl font-bold mb-2">PROJECT C</h1>
          <p className="text-sm text-black/70 dark:text-gray-400">
            Stay updated with the latest notices, events, and announcements.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-blue-300 dark:hover:text-blue-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/upload-notice"
                className="hover:text-blue-300 dark:hover:text-blue-400"
              >
                Upload Notice
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-blue-300 dark:hover:text-blue-400"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect with us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-400">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-black/60 dark:text-gray-400 mt-10">
        © {new Date().getFullYear()} VIIT-tice Board. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
