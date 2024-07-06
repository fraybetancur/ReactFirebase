import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, storage } from '../firebase'; // Asegúrate de que storage esté configurado en firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import TextInput from './Controls/TextInput';
import DateInput from './Controls/DateInput';
import Checkbox from './Controls/Checkbox';
import RadioGroup from './Controls/RadioGroup';
import FileInput from './Controls/FileInput';
import SearchableDropdown from './Controls/SearchableDropdown';
import Rating from './Controls/Rating';
import MapInput from './Controls/MapInput';
import SignatureInput from './Controls/SignatureInput';

const SurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [surveyUUID] = useState(uuidv4()); // UUID único para la encuesta

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, 'Survey'), orderBy('QuestionIndex'));
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(questionsData);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const fetchChoices = async () => {
        const q = query(collection(db, 'Choices'), where('QuestionID', '==', questions[currentQuestionIndex].QuestionID));
        const querySnapshot = await getDocs(q);
        const choicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChoices(choicesData);
      };

      fetchChoices();
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && responses[currentQuestion.QuestionID]) {
      setCurrentResponse(responses[currentQuestion.QuestionID]);
    } else {
      setCurrentResponse('');
    }
  }, [currentQuestionIndex, questions, responses]);

  const handleResponseChange = (response) => {
    setCurrentResponse(response);
    setResponses(prevResponses => ({
      ...prevResponses,
      [questions[currentQuestionIndex].QuestionID]: response
    }));
  };

  const handleFileChange = async (file) => {
    setCurrentFile(file);
    const fileRef = ref(storage, `files/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    handleResponseChange(fileURL);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = currentResponse;

    if (currentQuestion.Required && !response) {
      alert('Please answer the required question before proceeding.');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Survey completed!');
      console.log(responses);
    }

    setCurrentResponse('');
    setChoices([]);
    setCurrentFile(null);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitSurvey = async () => {
    for (const [questionID, response] of Object.entries(responses)) {
      await setDoc(doc(collection(db, 'Responses'), `${surveyUUID};${questionID}`), {
        SurveyID: surveyUUID,
        QuestionID: questionID,
        Response: response,
        createdAt: serverTimestamp()
      });
    }
    alert('All responses submitted!');
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {currentQuestion.Required ? '*' : ''}{currentQuestion.QuestionText}
      </h2>
      {currentQuestion.ResponseType === 'Texto' && (
        <TextInput value={currentResponse} onChange={handleResponseChange} />
      )}
      {currentQuestion.ResponseType === 'Fecha' && (
        <DateInput value={currentResponse} onChange={handleResponseChange} />
      )}
      {currentQuestion.ResponseType === 'Check' && (
        <Checkbox
          checked={currentResponse === 'Yes'}
          onChange={() => handleResponseChange(currentResponse === 'Yes' ? '' : 'Yes')}
          label={currentQuestion.QuestionText}
        />
      )}
      {currentQuestion.ResponseType === 'Opción Única' && (
        <RadioGroup
          name={currentQuestion.QuestionID}
          options={choices.map(choice => ({ value: choice.OptionText, label: choice.OptionText }))}
          value={currentResponse}
          onChange={handleResponseChange}
        />
      )}
      {currentQuestion.ResponseType === 'Opción Múltiple' && (
        <div>
          {choices.map(choice => (
            <Checkbox
              key={choice.OptionID}
              checked={currentResponse.includes(choice.OptionText)}
              onChange={() => {
                const updatedResponse = currentResponse.includes(choice.OptionText)
                  ? currentResponse.filter(item => item !== choice.OptionText)
                  : [...currentResponse, choice.OptionText];
                handleResponseChange(updatedResponse);
              }}
              label={choice.OptionText}
            />
          ))}
        </div>
      )}
      {currentQuestion.ResponseType === 'Cuadro de búsqueda' && (
        <SearchableDropdown
          options={choices.map(choice => ({ value: choice.OptionText, label: choice.OptionText }))}
          value={currentResponse}
          onChange={handleResponseChange}
        />
      )}
      {currentQuestion.ResponseType === 'Clasificación' && (
        <Rating value={currentResponse} onChange={handleResponseChange} />
      )}
      {currentQuestion.ResponseType === 'Mapa' && (
        <MapInput value={currentResponse} onChange={handleResponseChange} />
      )}
      {currentQuestion.ResponseType === 'Entrada de lápiz' && (
        <SignatureInput value={currentResponse} onChange={handleResponseChange} />
      )}
      {['Cargar imagen', 'Audio', 'Cámara', 'Datos adjuntos', 'Visor de PDF'].includes(currentQuestion.ResponseType) && (
        <FileInput
          accept={currentQuestion.ResponseType === 'Cargar imagen' ? 'image/*' :
                  currentQuestion.ResponseType === 'Audio' ? 'audio/*' :
                  currentQuestion.ResponseType === 'Cámara' ? 'video/*' :
                  currentQuestion.ResponseType === 'Visor de PDF' ? 'application/pdf' : ''}
          onChange={handleFileChange}
        />
      )}
      <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Back</button>
      <button onClick={handleNextQuestion} disabled={currentQuestionIndex >= questions.length - 1}>Next</button>
      {currentQuestionIndex === questions.length - 1 && (
        <button onClick={handleSubmitSurvey}>Submit</button>
      )}
    </div>
  );
};

export default SurveyForm;
