// src/components/NoticeCard.jsx
import React from "react";

const NoticeCard = ({ notice }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 hover:shadow-xl transition">
      <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
      <p className="text-sm mb-2 text-gray-500">{notice.category}</p>
      <p className="text-sm mb-4 line-clamp-3">{notice.description}</p>
      {/* {notice.fileURL && ( */}
      {/* <a */}
      {/* href={notice.fileURL} */}
      {/* target="_blank" */}
      {/* rel="noopener noreferrer" */}
      {/* className="text-blue-500 text-sm underline" */}
      {/* > */}
      {/* View Attachment */}
      {/* </a> */}
      {/* )} */}
    </div>
  );
};

export default NoticeCard;
