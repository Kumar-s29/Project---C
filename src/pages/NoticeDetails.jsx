import React, { useState } from "react";

const UploadNotice = () => {
  const [notice, setNotice] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice({ ...notice, [name]: value });
  };

  const handleFileChange = (e) => {
    setNotice({ ...notice, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Notice submitted:", notice);
    // TODO: Send data to backend
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Upload Notice
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={notice.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter notice title"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Category
            </label>
            <select
              name="category"
              value={notice.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Category --</option>
              <option value="Exams">Exams</option>
              <option value="Events">Events</option>
              <option value="Placements">Placements</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={notice.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter notice description"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Upload File (optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Notice
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNotice;
