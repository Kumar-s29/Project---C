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
  const [expiredNotices, setExpiredNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null); // Add this line
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
  
      const now = new Date();
      const expiredNotices = fetched.filter(notice => 
        notice.expiryDate && new Date(notice.expiryDate) < now
      );
      
      // Store expired notices in state (sorted by creation date, newest first)
      setExpiredNotices(expiredNotices.sort((a, b) => 
        new Date(b.createdAt?.toDate?.()) - new Date(a.createdAt?.toDate?.())
      ));

      // Remove this section that was deleting expired notices
      // await Promise.all(expiredNotices.map(notice => 
      //   deleteDoc(doc(db, "notices", notice.id))
      // ));
  
      // Filter active notices and sort by creation date
      const activeNotices = fetched
        .filter(notice => !notice.expiryDate || new Date(notice.expiryDate) >= now)
        .sort((a, b) => 
          new Date(b.createdAt?.toDate?.()) - new Date(a.createdAt?.toDate?.())
        );
  
      const counts = activeNotices.reduce((acc, notice) => {
        acc[notice.category] = (acc[notice.category] || 0) + 1;
        return acc;
      }, {});
  
      setNotices(activeNotices);
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

  // Add these state variables at the top with other useState declarations
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [newExpiryTime, setNewExpiryTime] = useState("");

  // Update the handleEdit function
  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setNewTitle(notice.title);
    setNewCategory(notice.category);
    setNewDescription(notice.description || "");
    
    // Set expiry date and time if they exist
    if (notice.expiryDate) {
      const expiryDateTime = new Date(notice.expiryDate);
      setNewExpiryDate(expiryDateTime.toISOString().split('T')[0]);
      setNewExpiryTime(expiryDateTime.toTimeString().slice(0, 5));
    }
  };

  // Update the handleUpdate function
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newTitle || !newCategory || !newDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      let expiryDateTime = null;
      
      if (newExpiryDate) {
        // If expiry date is set but no time, default to 23:59
        const time = newExpiryTime || '23:59';
        expiryDateTime = new Date(`${newExpiryDate}T${time}`).toISOString();
      }

      const updatedNotice = {
        title: newTitle,
        category: newCategory,
        description: newDescription,
        createdAt: selectedNotice.createdAt,
        expiryDate: expiryDateTime,
        fileURL: selectedNotice.fileURL || "",
        department: selectedNotice.department || "",
        priority: selectedNotice.priority || "normal",
        status: selectedNotice.status || "active",
        attachments: selectedNotice.attachments || [],
        lastModified: new Date()
      };

      await setDoc(doc(db, "notices", selectedNotice.id), updatedNotice);
      alert("Notice updated successfully!");

      setSelectedNotice(null);
      setNewTitle("");
      setNewCategory("");
      setNewDescription("");
      setNewExpiryDate("");
      setNewExpiryTime("");
      fetchNotices();
    } catch (error) {
      console.error("Error updating notice:", error);
      alert(`Failed to update notice: ${error.message}`);
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
        <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 shadow rounded-lg">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Title</th>
                <th className="py-3 px-4 min-w-[120px]">Category</th>
                <th className="py-3 px-4 min-w-[180px]">Created Date</th>
                <th className="py-3 px-4 min-w-[180px]">Created Time</th>
                <th className="py-3 px-4 min-w-[120px]">Expiry Date</th>
                <th className="py-3 px-4 min-w-[120px]">Expiry Time</th>
                <th className="py-3 px-4 min-w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
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
                      {n.createdAt?.toDate?.().toLocaleDateString() || "--"}
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                      {n.createdAt?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) || "--"}
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                      {n.expiryDate ? new Date(n.expiryDate).toLocaleDateString() : "--"}
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                      {n.expiryDate ? new Date(n.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "--"}
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => setViewingNotice(n)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                      >
                        View
                      </button>
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

        {/* Expired Notices Table */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Expired Notices
          </h2>
          <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 shadow rounded-lg">
            <table className="min-w-full text-left whitespace-nowrap">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="py-3 px-4 min-w-[200px]">Title</th>
                  <th className="py-3 px-4 min-w-[120px]">Category</th>
                  <th className="py-3 px-4 min-w-[180px]">Created Date</th>
                  <th className="py-3 px-4 min-w-[180px]">Created Time</th>
                  <th className="py-3 px-4 min-w-[120px]">Expiry Date</th>
                  <th className="py-3 px-4 min-w-[120px]">Expiry Time</th>
                  <th className="py-3 px-4 min-w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-600 dark:text-gray-300">
                      Loading...
                    </td>
                  </tr>
                ) : expiredNotices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-600 dark:text-gray-300">
                      No expired notices
                    </td>
                  </tr>
                ) : (
                  expiredNotices.map((n) => (
                    <tr key={n.id} className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{n.title}</td>
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{n.category}</td>
                      <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                        {n.createdAt?.toDate?.().toLocaleDateString() || "--"}
                      </td>
                      <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                        {n.createdAt?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) || "--"}
                      </td>
                      <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                        {n.expiryDate ? new Date(n.expiryDate).toLocaleDateString() : "--"}
                      </td>
                      <td className="py-2 px-4 text-gray-600 dark:text-gray-300">
                        {n.expiryDate ? new Date(n.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "--"}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => setViewingNotice(n)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded mr-2"
                        >
                          View
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
        </div>

        {/* Remove the old Edit Form section and add this new Edit Notice Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  Edit Notice
                </h2>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

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
                    className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white h-32"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={newExpiryDate}
                      onChange={(e) => setNewExpiryDate(e.target.value)}
                      className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Expiry Time
                    </label>
                    <input
                      type="time"
                      value={newExpiryTime}
                      onChange={(e) => setNewExpiryTime(e.target.value)}
                      className="w-full p-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedNotice(null)}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* View Notice Modal */}
                {viewingNotice && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Notice Details
                        </h2>
                        <button
                          onClick={() => setViewingNotice(null)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h3>
                          <p className="text-lg text-gray-900 dark:text-white">{viewingNotice.title}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                          <p className="text-lg text-gray-900 dark:text-white">{viewingNotice.category}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                          <p className="text-lg text-gray-900 dark:text-white whitespace-pre-wrap">
                            {viewingNotice.description}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date & Time</h3>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {viewingNotice.createdAt?.toDate?.().toLocaleDateString()}{' '}
                              {viewingNotice.createdAt?.toDate?.().toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                hour12: true 
                              })}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date & Time</h3>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {viewingNotice.expiryDate ? (
                                <>
                                  {new Date(viewingNotice.expiryDate).toLocaleDateString()}{' '}
                                  {new Date(viewingNotice.expiryDate).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </>
                              ) : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => setViewingNotice(null)}
                          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-md"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        };

        export default AdminDashboard;
