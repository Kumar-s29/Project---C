import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const FullView = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const docRef = doc(db, "notices", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNotice(docSnap.data());
        } else {
          console.log("No such notice!");
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
      }
    };

    fetchNotice();
  }, [id]);

  if (!notice) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900">
        Loading notice...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">
          {notice.title}
        </h1>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          Category: <span className="font-medium">{notice.category}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-200 text-lg mb-6 whitespace-pre-wrap">
          {notice.description}
        </p>

        {notice.fileURL && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 text-center">
              Attached PDF Preview
            </h2>
            <div className="w-full h-[500px] border dark:border-gray-700 rounded-lg overflow-hidden shadow">
              <iframe
                src={notice.fileURL}
                title="PDF Preview"
                width="100%"
                height="100%"
                className="rounded"
              ></iframe>
            </div>

            <div className="mt-4 text-center">
              <a
                href={notice.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 dark:text-blue-400 underline"
              >
                Download/View Full PDF
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullView;
