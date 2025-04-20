import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getCountFromServer,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion } from "framer-motion";
import ImportantUpdates from "../components/ImportantUpdates";
import viit from "../assets/viit.jpg";

const Home = () => {
  const [latestNotices, setLatestNotices] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({
    exams: 0,
    events: 0,
    placements: 0,
    general: 0,
  });

  useEffect(() => {
    const q = query(
      collection(db, "notices"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const now = new Date().getTime();
      const activeNotices = notices.filter(notice => !notice.expiryDate || new Date(notice.expiryDate) > now);
      setLatestNotices(activeNotices.slice(0, 3));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getCategoryCount = async (category) => {
      const q = query(
        collection(db, "notices"),
        where("category", "==", category)
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    };

    const fetchCategoryCounts = async () => {
      const examsCount = await getCategoryCount("Exams");
      const eventsCount = await getCategoryCount("Events");
      const placementsCount = await getCategoryCount("Placements");
      const generalCount = await getCategoryCount("General");

      setCategoryCounts({
        exams: examsCount,
        events: eventsCount,
        placements: placementsCount,
        general: generalCount,
      });
    };

    fetchCategoryCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-outfit">
      {/* Important Updates Marquee */}
      <ImportantUpdates />

      {/* Hero Section */}
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
           VIIT Notices in One Place
          </h1>
          <p className="text-lg mb-6 text-gray-200">
            Stay updated with the latest news, events, exams, and placements.
          </p>
          <Link to="/all-notices">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
              Explore Notices
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Categories Section with Dynamic Counts */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Browse by Categories
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Find exactly what you're looking for with our organized notice
              categories
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Exams */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <i className="fas fa-book text-white text-xl"></i>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Exams
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Schedules, results & more
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {categoryCounts.exams} notices
                  </span>
                  <i className="fas fa-arrow-right text-gray-500 dark:text-gray-300"></i>
                </div>
              </div>
            </div>

            {/* Events */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <i className="fas fa-calendar-alt text-white text-xl"></i>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Events
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Workshops, seminars & functions
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {categoryCounts.events} notices
                  </span>
                  <i className="fas fa-arrow-right text-gray-500 dark:text-gray-300"></i>
                </div>
              </div>
            </div>

            {/* Placements */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <i className="fas fa-briefcase text-white text-xl"></i>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Placements
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Jobs, internships & drives
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {categoryCounts.placements} notices
                  </span>
                  <i className="fas fa-arrow-right text-gray-500 dark:text-gray-300"></i>
                </div>
              </div>
            </div>

            {/* General */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <i className="fas fa-bullhorn text-white text-xl"></i>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      General
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Announcements & updates
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {categoryCounts.general} notices
                  </span>
                  <i className="fas fa-arrow-right text-gray-500 dark:text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Latest Notices
          </h2>

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
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {notice.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    {notice.description.substring(0, 100)}...
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/notice/${notice.id}`}
                      className="text-blue-500 dark:text-blue-400 hover:text-blue-600"
                    >
                      Read More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

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
