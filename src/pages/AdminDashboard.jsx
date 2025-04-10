import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

const AdminDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const snapshot = await getDocs(collection(db, "notices"));
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const counts = fetched.reduce((acc, notice) => {
        acc[notice.category] = (acc[notice.category] || 0) + 1;
        return acc;
      }, {});

      setNotices(fetched);
      setCategoryCounts(counts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "notices", id));
      setNotices(notices.filter((n) => n.id !== id));
      fetchNotices();
    } catch (error) {
      console.error("Failed to delete notice:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <div
              key={cat}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-300">{cat}</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {count}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-auto bg-white dark:bg-gray-800 shadow rounded-xl">
          <table className="min-w-full">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Created At</th>
                <th className="py-2 px-4 text-left">File</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-700 dark:text-gray-300"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                notices.map((n) => (
                  <tr
                    key={n.id}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                      {n.title}
                    </td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                      {n.category}
                    </td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                      {n.createdAt?.toDate?.().toLocaleString?.() || "--"}
                    </td>
                    <td className="py-2 px-4">
                      {n.fileURL ? (
                        <a
                          href={n.fileURL}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline text-sm"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300">
                          None
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
