import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoticeDetails from "./pages/NoticeDetails";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
 
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notices" element={<NoticeDetails />} />
        <Route path="/upload-notice" element={<NoticeDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
