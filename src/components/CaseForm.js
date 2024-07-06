import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const CaseForm = ({ onCaseAdded }) => {
  const [caseName, setCaseName] = useState('');
  const [caseAttachment, setCaseAttachment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (caseName && caseAttachment) {
      try {
        const storageRef = ref(storage, `attachments/${caseAttachment.name}`);
        await uploadBytes(storageRef, caseAttachment);
        const attachmentUrl = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'cases'), {
          name: caseName,
          attachmentUrl: attachmentUrl,
          createdAt: serverTimestamp()
        });

        setCaseName('');
        setCaseAttachment(null);
        alert('Caso guardado exitosamente');
        onCaseAdded();
      } catch (error) {
        console.error('Error al agregar documento: ', error);
        alert('Error al guardar el caso: ' + error.message);
      }
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={caseName}
        onChange={(e) => setCaseName(e.target.value)}
        placeholder="Nombre del Caso"
        required
      />
      <input
        type="file"
        onChange={(e) => setCaseAttachment(e.target.files[0])}
        accept="image/*,.pdf"
        required
      />
      <button type="submit">Guardar Caso</button>
    </form>
  );
};

export default CaseForm;
