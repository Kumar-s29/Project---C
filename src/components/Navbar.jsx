import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-sky-500/50 text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          VIIT-tice Board
        </Link>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 font-semibold">
          <li>
            <Link to="/" className="hover:text-white">Home</Link>
          </li>
          <li>
            <Link to="/notices" className="hover:text-white">Upload Notice</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-white">Login</Link>
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-sky-400 rounded-lg shadow-lg">
          <ul className="flex flex-col space-y-2 px-4 py-2 font-semibold">
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/notices"
                onClick={() => setIsOpen(false)}
                className="hover:text-white"
              >
                Upload Notice
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-white"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
