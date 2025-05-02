import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const ImportantUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchImportantUpdates = async () => {
      const q = query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(20));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const now = new Date().getTime();
      const activeNotices = data.filter(notice => !notice.expiryDate || new Date(notice.expiryDate) > now);
      setUpdates(activeNotices.slice(0, 5));
    };

    fetchImportantUpdates();
  }, []);

  return (
    <div className="bg-yellow-100 dark:bg-blue-400 py-2 px-4 overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <div className="flex whitespace-nowrap text-sm font-semibold text-yellow-900 dark:text-yellow-100 font-outfit animate-marquee" style={{ display: 'inline-flex', width: 'fit-content' }}>
          {updates.map((u, index) => (
            <span key={index} className="inline-block mx-10">
              🔔 {u.title} - {u.category}
            </span>
          ))}
          {updates.map((u, index) => (
            <span key={`repeat-${index}`} className="inline-block mx-10">
              🔔 {u.title} - {u.category}
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ImportantUpdates;
