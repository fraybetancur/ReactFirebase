import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ExcelUploader = () => {
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    setIsLoading(true); // Inicia la carga

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Procesar las preguntas de la hoja 'Survey'
      const surveySheet = workbook.Sheets['Survey'];
      const surveyData = XLSX.utils.sheet_to_json(surveySheet);

      const surveyCollection = collection(db, 'Survey');
      for (const row of surveyData) {
        const survey = {
          QuestionID: row.QuestionID,
          QuestionIndex: parseInt(row.QuestionIndex, 10),
          QuestionText: row.QuestionText,
          Required: row.Required.toLowerCase() === 'yes',
          ResponseType: row.ResponseType
        };
        await addDoc(surveyCollection, survey);
      }

      // Procesar las opciones de respuesta de la hoja 'Choices'
      const choicesSheet = workbook.Sheets['Choices'];
      const choicesData = XLSX.utils.sheet_to_json(choicesSheet);

      const choicesCollection = collection(db, 'Choices');
      for (const row of choicesData) {
        const choice = {
          QuestionID: row.QuestionID,
          OptionID: row.OptionID,
          OptionText: row.OptionText,
          OptionIndex: parseInt(row.OptionIndex, 10)
        };
        await addDoc(choicesCollection, choice);
      }

      alert('Data imported successfully');
      setIsLoading(false); // Finaliza la carga
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {isLoading && <p>Loading...</p>} {/* Indicador de carga */}
    </div>
  );
};

export default ExcelUploader;
