import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import NoticeCard from "../components/NoticeCard";
import { motion } from "framer-motion";
import ImportantUpdates from "../components/ImportantUpdates";
import viit from "../assets/viit.png";

const Home = () => {
  const [latestNotices, setLatestNotices] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "notices"),
      orderBy("createdAt", "desc"),
      limit(3)
    );
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-outfit">
      {/* Important Updates Marquee */}
      <ImportantUpdates />

      {/* Hero Section with image background */}
      <section
        className="relative w-full min-h-screen bg-center bg-cover flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${viit})` }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0 z-0"></div>

        <motion.div
          className="relative z-10 text-center px-4 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-outfit">
            VIIT Campus Notices in One Place
          </h1>
          <p className="text-lg mb-6 text-gray-200 font-outfit">
            Stay updated with the latest news, events, exams, and placements.
          </p>
          <Link to="/all-notices">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-outfit">
              Explore Notices
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Latest Notices */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 font-outfit">
            Latest Notices
          </h2>

          {latestNotices.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 font-outfit">
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
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition font-outfit">
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
