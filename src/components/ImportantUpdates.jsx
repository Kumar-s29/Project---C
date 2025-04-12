import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const ImportantUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchImportantUpdates = async () => {
      const q = query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(5));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpdates(data);
    };

    fetchImportantUpdates();
  }, []);

  return (
    <div className="bg-yellow-100 dark:bg-green-900 py-2 px-4 overflow-hidden">
      <div className="relative w-full">
        <div className="flex animate-marquee whitespace-nowrap text-sm font-semibold text-yellow-900 dark:text-yellow-100">
          {updates.concat(updates).map((u, index) => (
            <span key={index} className="inline-block mr-20">
              🔔 {u.title} - {u.category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportantUpdates;
