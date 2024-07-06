import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const CaseList = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const loadCases = async () => {
      const q = query(collection(db, 'cases'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const casesData = querySnapshot.docs.map(doc => doc.data());
      setCases(casesData);
    };

    loadCases();
  }, []);

  return (
    <div>
      {cases.map((caseData, index) => (
        <div key={index}>
          <h2>{caseData.name}</h2>
          <img src={caseData.attachmentUrl} alt={caseData.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />
        </div>
      ))}
    </div>
  );
};

export default CaseList;
