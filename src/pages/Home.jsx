import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import NoticeCard from "../components/NoticeCard";
import { motion } from "framer-motion";
import ImportantUpdates from "../components/ImportantUpdates";
import viit from "../assets/viit.png";

const Home = () => {
  const [latestNotices, setLatestNotices] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLatestNotices(notices);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Important Updates Marquee */}
      <ImportantUpdates />

      {/* Hero Section with image background */}
      <section className="relative bg-white dark:bg-gray-900 py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={viit} // Replace with your actual image path
            alt="Background"
            className="w-full h-full object-cover opacity-30 dark:opacity-20"
          />
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-10 md:mb-0 md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Campus Notices in One Place
            </h1>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
              Stay updated with the latest news, events, exams, and placements.
            </p>
            <Link to="/all-notices">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                Explore Notices
              </button>
            </Link>
          </div>
          <motion.div
            className="md:w-1/2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={viit} // Replace with your actual image path
              alt="Notices"
              className="w-full rounded-lg shadow-xl transform transition duration-500 hover:scale-105"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Latest Notices */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Latest Notices</h2>

          {latestNotices.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No recent notices available.
            </p>
          ) : (
            <motion.div
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {latestNotices.map((notice) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  key={notice.id}
                >
                  <NoticeCard notice={notice} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link to="/all-notices">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
                View All Notices
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
