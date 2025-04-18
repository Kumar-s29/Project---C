import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const AdminDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setNewTitle(notice.title);
    setNewCategory(notice.category);
    setNewDescription(notice.description || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newTitle || !newCategory || !newDescription) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedNotice = {
      title: newTitle,
      category: newCategory,
      description: newDescription,
      createdAt: selectedNotice.createdAt,
      fileURL: selectedNotice.fileURL || "",
    };

    try {
      await setDoc(doc(db, "notices", selectedNotice.id), updatedNotice);
      alert("Notice updated successfully!");

      setSelectedNotice(null);
      setNewTitle("");
      setNewCategory("");
      setNewDescription("");
      fetchNotices();
    } catch (error) {
      console.error("Error updating notice:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition duration-300 font-outfit">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <div
              key={cat}
              className="bg-indigo-500 text-white dark:bg-indigo-600 p-6 rounded-lg shadow text-center"
            >
              <p className="text-sm">{cat}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>

        {/* Notices Table */}
        <div className="overflow-hidden bg-gray-50 dark:bg-gray-700 shadow rounded-lg">
          <table className="min-w-full text-left">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-600 dark:text-gray-300"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                notices.map((n) => (
                  <tr
                    key={n.id}
                    className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                      {n.title}
                    </td>
                    <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                      {n.category}
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                      {n.createdAt?.toDate?.()?.toLocaleString() || "--"}
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleEdit(n)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
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

        {/* Edit Form */}
        {selectedNotice && (
          <div className="mt-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              Edit Notice
            </h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
