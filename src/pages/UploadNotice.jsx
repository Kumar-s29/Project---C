import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../index.css"; // Import your CSS file for styles

const UploadNotice = () => {
  const [notice, setNotice] = useState({
    title: "",
    category: "",
    description: "",
    expiryDate: "",
    expiryTime: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice({ ...notice, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let expiryDateTime = null;

      if (notice.expiryDate) {
        // If expiry date is set but no time, default to 23:59
        const time = notice.expiryTime || "23:59";
        expiryDateTime = new Date(`${notice.expiryDate}T${time}`).toISOString();
      }

      await addDoc(collection(db, "notices"), {
        title: notice.title,
        category: notice.category,
        description: notice.description,
        createdAt: serverTimestamp(),
        expiryDate: expiryDateTime,
        status: "active",
      });

      alert("Notice uploaded successfully!");

      setNotice({
        title: "",
        category: "",
        description: "",
        expiryDate: "",
        expiryTime: "",
      });
    } catch (error) {
      console.error("Error uploading notice:", error);
      alert("Failed to upload notice. Try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-10 font-outfit">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center">
          Upload Notice
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={notice.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
              placeholder="Enter notice title"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={notice.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
            >
              <option value="">-- Select Category --</option>
              <option value="Exams">Exams</option>
              <option value="Events">Events</option>
              <option value="Placements">Placements</option>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiryDate"
                value={notice.expiryDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Expiry Time (Optional)
              </label>
              <input
                type="time"
                name="expiryTime"
                value={notice.expiryTime}
                onChange={handleChange}
                disabled={!notice.expiryDate}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {notice.expiryDate && !notice.expiryTime && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  If no time is set, notice will expire at 11:59 PM
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={notice.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
              placeholder="Enter notice description"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {loading ? "Uploading..." : "Submit Notice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNotice;
