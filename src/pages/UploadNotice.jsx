import React, { useState } from "react";
import { db, storage } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadNotice = () => {
  const [notice, setNotice] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice({ ...notice, [name]: value });
  };

  const handleFileChange = (e) => {
    setNotice({ ...notice, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let fileURL = null;

    try {
      if (notice.file) {
        const fileRef = ref(
          storage,
          `notices/${Date.now()}_${notice.file.name}`
        );
        const snapshot = await uploadBytes(fileRef, notice.file);
        fileURL = await getDownloadURL(snapshot.ref);
        console.log("File uploaded to:", fileURL);
      }
    } catch (uploadError) {
      console.error("Error uploading file:", uploadError);
      alert("File upload failed. Please try again.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "notices"), {
        title: notice.title,
        category: notice.category,
        description: notice.description,
        fileURL: fileURL || null,
        createdAt: serverTimestamp(),
      });

      alert("Notice uploaded successfully!");
      setNotice({
        title: "",
        category: "",
        description: "",
        fileURL: fileURL || null,
      });

      document.querySelector('input[type="file"]').value = "";
    } catch (error) {
      console.error("Error uploading notice:", error);
      alert("Failed to upload notice. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
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
              <option value="General">General</option>
            </select>
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

          <div>
            <label className="block mb-1 font-medium">
              Upload File (PDF optional)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2"
            />
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
