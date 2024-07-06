import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
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
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentFile, setCurrentFile] = useState(null);

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

  const handleResponseChange = (response) => {
    setCurrentResponse(response);
    setResponses(prevResponses => ({
      ...prevResponses,
      [questions[currentQuestionIndex].QuestionID]: response
    }));
  };

  const handleFileChange = (file) => {
    setCurrentFile(file);
    handleResponseChange(file.name);
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = currentResponse;

    if (currentQuestion.Required && !response) {
      alert('Please answer the required question before proceeding.');
      return;
    }

    if (response) {
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
      <button onClick={handleNextQuestion}>Next</button>
    </div>
  );
};

export default SurveyForm;
