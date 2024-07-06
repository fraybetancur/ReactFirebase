import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const SurveyForm = () => {
  const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas
  const [choices, setChoices] = useState([]); // Estado para almacenar las opciones de respuesta
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Estado para rastrear el índice de la pregunta actual
  const [responses, setResponses] = useState([]); // Estado para almacenar las respuestas de los usuarios
  const [currentResponse, setCurrentResponse] = useState(''); // Estado para el campo de respuesta actual

  // useEffect para cargar las preguntas desde Firestore al montar el componente
  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, 'Survey'), orderBy('QuestionIndex')); // Consulta para obtener todas las preguntas de la colección Survey, ordenadas por QuestionIndex
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapea los documentos a un formato de objeto
      setQuestions(questionsData); // Establece el estado de las preguntas
    };

    fetchQuestions();
  }, []);

  // useEffect para cargar las opciones de respuesta cada vez que cambia la pregunta actual
  useEffect(() => {
    if (questions.length > 0) {
      const fetchChoices = async () => {
        const q = query(collection(db, 'Choices'), where('QuestionID', '==', questions[currentQuestionIndex].QuestionID)); // Consulta para obtener las opciones de respuesta de la pregunta actual
        const querySnapshot = await getDocs(q);
        const choicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapea los documentos a un formato de objeto
        setChoices(choicesData); // Establece el estado de las opciones de respuesta
      };

      fetchChoices();
    }
  }, [questions, currentQuestionIndex]);

  // Función para manejar el cambio de respuesta del usuario
  const handleResponseChange = (response) => {
    setCurrentResponse(response);
    setResponses(prevResponses => ({
      ...prevResponses,
      [questions[currentQuestionIndex].QuestionID]: response
    }));
  };

  // Función para manejar el avance a la siguiente pregunta
  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = currentResponse;

    if (response) {
      // Guardar la respuesta en la colección Responses
      await addDoc(collection(db, 'Responses'), {
        CaseID: "some_case_id",
        ParentCaseID: "some_parent_case_id",
        CaseDetails: "some_case_details",
        QuestionID: currentQuestion.QuestionID,
        Index: currentQuestionIndex,
        ResponseID: "some_response_id",
        Response: response,
        createdAt: serverTimestamp()
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1); // Avanza a la siguiente pregunta si no es la última
      } else {
        alert('Survey completed!'); // Muestra un mensaje cuando se completan todas las preguntas
        console.log(responses); // Imprime las respuestas en la consola (puedes manejar esto de otra manera)
      }

      setCurrentResponse(''); // Restablecer el campo de respuesta actual
      setChoices([]); // Limpia las opciones de la pregunta anterior
    } else {
      alert('Please answer the question before proceeding.');
    }
  };

  const currentQuestion = questions[currentQuestionIndex]; // Obtiene la pregunta actual

  if (!currentQuestion) return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtienen las preguntas

  return (
    <div>
      <h2>
        {currentQuestion.Required ? '*' : ''}{currentQuestion.QuestionText} {/* Muestra un asterisco si la pregunta es requerida */}
      </h2>
      {currentQuestion.ResponseType === 'Opción Múltiple' && ( // Muestra las opciones de respuesta si el tipo de respuesta es "Opción Múltiple"
        choices.map(choice => (
          <div key={choice.OptionID}>
            <input
              type="radio"
              name={currentQuestion.QuestionID}
              value={choice.OptionText}
              checked={currentResponse === choice.OptionText}
              onChange={() => handleResponseChange(choice.OptionText)}
            />
            <label>{choice.OptionText}</label>
          </div>
        ))
      )}
      {currentQuestion.ResponseType === 'Texto' && ( // Muestra un campo de texto si el tipo de respuesta es "Texto"
        <input
          type="text"
          value={currentResponse}
          onChange={e => handleResponseChange(e.target.value)}
        />
      )}
      <button onClick={handleNextQuestion}>Next</button> {/* Botón para avanzar a la siguiente pregunta */}
    </div>
  );
};

export default SurveyForm;
