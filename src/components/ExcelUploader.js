import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ExcelUploader = () => {
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const [progress, setProgress] = useState(0); // Estado para manejar el progreso de la carga

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    setIsLoading(true); // Inicia la carga
    setProgress(0); // Resetea el progreso

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Procesar las preguntas de la hoja 'Survey'
      const surveySheet = workbook.Sheets['Survey'];
      const surveyData = XLSX.utils.sheet_to_json(surveySheet);

      const surveyCollection = collection(db, 'Survey');
      let count = 0;
      for (const row of surveyData) {
        const survey = {
          QuestionID: row.QuestionID,
          QuestionIndex: parseInt(row.QuestionIndex, 10),
          QuestionText: row.QuestionText,
          Required: row.Required.toLowerCase() === 'yes',
          ResponseType: row.ResponseType
        };
        await setDoc(doc(surveyCollection, row.QuestionID), survey);
        count++;
        setProgress((count / surveyData.length) * 50); // Actualiza el progreso para la mitad de la carga
      }

      // Procesar las opciones de respuesta de la hoja 'Choices'
      const choicesSheet = workbook.Sheets['Choices'];
      const choicesData = XLSX.utils.sheet_to_json(choicesSheet);

      const choicesCollection = collection(db, 'Choices');
      count = 0;
      for (const row of choicesData) {
        const choice = {
          QuestionID: row.QuestionID,
          OptionID: row.OptionID,
          OptionText: row.OptionText,
          OptionIndex: parseInt(row.OptionIndex, 10)
        };
        await setDoc(doc(choicesCollection, `${row.QuestionID}_${row.OptionID}`), choice);
        count++;
        setProgress(50 + (count / choicesData.length) * 50); // Actualiza el progreso para la segunda mitad de la carga
      }

      alert('Data imported successfully');
      setIsLoading(false); // Finaliza la carga
      setProgress(100); // Progreso completo
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {isLoading && (
        <div>
          <p>Loading...</p>
          <progress value={progress} max="100">{progress}%</progress> {/* Barra de carga */}
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
