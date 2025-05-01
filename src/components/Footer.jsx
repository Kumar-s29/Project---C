import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Import your CSS file for styles
import {
  FaInstagram,
  FaLinkedin,
  FaMailBulk,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-sky-400 dark:bg-gray-900 text-black dark:text-white py-8 mt-15 font-outfit border-4 border-transparent animate-snake-light">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h1 className="text-2xl font-bold mb-2">VIIT - eNOTICE BOARD</h1>
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
                className="hover:text-red-500 dark:hover:text-red-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/all-notices"
                className="hover:text-red-300 dark:hover:text-red-400"
              >
                Explore Notice
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-red-300 dark:hover:text-red-400"
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
            <a
              href="https://www.instagram.com/vignan_viit_vizag?igsh=MTdiamdheWhoaDUwag=="
              className="hover:text-red-400"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/school/vignanvizag/"
              className="hover:text-red-400"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://youtube.com/@vignanvizagstudio?si=Ie0qwPBW0Lysqa8m"
              className="hover:text-red-400"
            >
              <FaYoutube />
            </a>
            <a href="mailto:vignaniit@yahoo.com" className="hover:text-red-400">
              <FaMailBulk />
            </a>
          </div>
          <p className="text-sm mt-3">Vignan's Intitute of Information Technology(A),</p>
          <p>Duvvada, Visakhapatnam-49</p>
        </div>
      </div>

      <div className="text-center text-sm text-black/60 dark:text-gray-400 mt-10">
        © {new Date().getFullYear()} VIIT - eNotice Board. All rights reserved.
        Project By @Team Graduates
      </div>
    </footer>
  );
};

export default Footer;
