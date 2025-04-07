import React, { useState } from "react";
import { Link } from "react-router-dom";

// Sample notices data (you already have this part)
const notices = [
  {
    id: 1,
    title: "Mid Exams Rescheduled",
    category: "Exams",
    description: "Mid exams for 2nd year students are rescheduled to next week.",
  },
  {
    id: 2,
    title: "Guest Lecture on AI",
    category: "Events",
    description: "An expert talk on Artificial Intelligence will be conducted on Friday.",
  },
  {
    id: 3,
    title: "Campus Drive by Infosys",
    category: "Placements",
    description: "Infosys is conducting a campus recruitment drive on March 5th.",
  },
];

const categories = ["All", "Exams", "Events", "General"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNotices =
    selectedCategory === "All"
      ? notices
      : notices.filter((notice) => notice.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-400"
              } hover:bg-blue-500 hover:text-white transition duration-200`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices Section */}
        {filteredNotices.length === 0 ? (
          <p className="text-center text-gray-600">No notices available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="mb-2 text-sm text-gray-500">{notice.category}</div>
                <h2 className="text-xl font-semibold text-gray-800">{notice.title}</h2>
                <p className="text-gray-600 mt-2 mb-4">
                  {notice.description.length > 100
                    ? notice.description.slice(0, 100) + "..."
                    : notice.description}
                </p>
                <Link
                  to={`/notice/${notice.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
                >
                  View Notice
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
