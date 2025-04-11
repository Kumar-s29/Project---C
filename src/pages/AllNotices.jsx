import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query } from "firebase/firestore";
import { debounce } from "lodash";

const categories = ["All", "Exams", "Events", "General", "Placements"];
const noticesPerPage = 6;

const AllNotices = () => {
  const [notices, setNotices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch notices from Firestore
  useEffect(() => {
    const q = query(collection(db, "notices"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotices = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotices(fetchedNotices);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Debounce search input
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setDebouncedSearchTerm(value), 400),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Filter, search, and sort notices
  const filteredNotices = notices
    .filter((notice) => {
      const matchesCategory =
        selectedCategory === "All" || notice.category === selectedCategory;
      const matchesSearch =
        notice.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        notice.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt?.seconds - a.createdAt?.seconds;
        case "oldest":
          return a.createdAt?.seconds - b.createdAt?.seconds;
        case "titleAZ":
          return a.title.localeCompare(b.title);
        case "titleZA":
          return b.title.localeCompare(a.title);
        case "descAZ":
          return a.description.localeCompare(b.description);
        case "descZA":
          return b.description.localeCompare(a.description);
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);
  const startIndex = (currentPage - 1) * noticesPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + noticesPerPage);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-blue-600 border-blue-400 dark:text-blue-400 dark:border-blue-500"
                } hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded px-2 py-1 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="titleAZ">Title A-Z</option>
              <option value="titleZA">Title Z-A</option>
              <option value="descAZ">Description A-Z</option>
              <option value="descZA">Description Z-A</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search by title or description"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-full"
          />
        </div>

        {/* Notices */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : paginatedNotices.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No notices found.
          </p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow dark:shadow-gray-700 hover:shadow-lg transition"
                >
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>{notice.category}</span>
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {notice.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">
                    {notice.description?.length > 100
                      ? notice.description.slice(0, 100) + "..."
                      : notice.description}
                  </p>

                  {notice.fileURL && (
                    <a
                      href={notice.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 dark:text-green-400 underline block mb-2"
                    >
                      📎 View Attachment
                    </a>
                  )}

                  <Link to={`/notice/${notice.id}`}>
                    <button className="text-sm text-blue-600 dark:text-blue-400 underline">
                      View Full
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {/* <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-800 dark:text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default AllNotices;
