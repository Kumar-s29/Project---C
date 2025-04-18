import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const FullView = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const docRef = doc(db, "notices", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNotice(docSnap.data());
        } else {
          setNotice(false);
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
        setNotice(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 font-outfit">
        Loading notice...
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-900 font-outfit">
        Notice not found or has been deleted.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 text-center font-outfit">
          {notice.title}
        </h1>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center font-outfit">
          Category: <span className="font-medium">{notice.category}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-200 text-lg mb-6 whitespace-pre-wrap font-outfit">
          {notice.description}
        </p>

        <div className="mt-10 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 dark:text-blue-400 hover:underline font-outfit"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullView;
