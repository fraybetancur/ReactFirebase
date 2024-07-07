import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import {
  ScreenContainer,
  HeaderContainer,
  SearchContainer,
  BodyContainer,
  ButtonContainer,
  Button,
  BackButton,
  TextInput,
  FormGroup,
  Title
} from './StyledComponents';
import MenuDrawer, { MenuButtonWrapper } from './MenuDrawer';
import { GlobalStyle } from './StyledComponents';

const SurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [surveyUUID] = useState(uuidv4());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsMenuOpen(open);
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

  const handlers = useSwipeable({
    onSwipedLeft: handleNextQuestion,
    onSwipedRight: handlePreviousQuestion,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

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
    <>
      <GlobalStyle />
      <ScreenContainer {...handlers}>
        <HeaderContainer>
          <MenuButtonWrapper toggleDrawer={toggleDrawer} />
          <Title>{currentQuestion.QuestionText}</Title>
        </HeaderContainer>
        <SearchContainer>
          {/* Añadir lógica de búsqueda si es necesario */}
        </SearchContainer>
        <BodyContainer>
          {currentQuestion.ResponseType === 'Texto' && (
            <TextInput value={currentResponse} onChange={(e) => handleResponseChange(e.target.value)} />
          )}
          {currentQuestion.ResponseType === 'Fecha' && (
            <TextInput type="date" value={currentResponse} onChange={(e) => handleResponseChange(e.target.value)} />
          )}
          {currentQuestion.ResponseType === 'Check' && (
            <FormGroup>
              <input
                type="checkbox"
                checked={currentResponse === 'Yes'}
                onChange={() => handleResponseChange(currentResponse === 'Yes' ? '' : 'Yes')}
              />
              <label>{currentQuestion.QuestionText}</label>
            </FormGroup>
          )}
          {currentQuestion.ResponseType === 'Opción Única' && (
            <FormGroup>
              {choices.map(choice => (
                <label key={choice.id}>
                  <input
                    type="radio"
                    name={currentQuestion.QuestionID}
                    value={choice.OptionText}
                    checked={currentResponse === choice.OptionText}
                    onChange={() => handleResponseChange(choice.OptionText)}
                  />
                  {choice.OptionText}
                </label>
              ))}
            </FormGroup>
          )}
          {currentQuestion.ResponseType === 'Opción Múltiple' && (
            <FormGroup>
              {choices.map(choice => (
                <label key={choice.id}>
                  <input
                    type="checkbox"
                    value={choice.OptionText}
                    checked={currentResponse.includes(choice.OptionText)}
                    onChange={() => {
                      const updatedResponse = currentResponse.includes(choice.OptionText)
                        ? currentResponse.filter(item => item !== choice.OptionText)
                        : [...currentResponse, choice.OptionText];
                      handleResponseChange(updatedResponse);
                    }}
                  />
                  {choice.OptionText}
                </label>
              ))}
            </FormGroup>
          )}
          {currentQuestion.ResponseType === 'Cuadro de búsqueda' && (
            <TextInput value={currentResponse} onChange={(e) => handleResponseChange(e.target.value)} />
          )}
          {currentQuestion.ResponseType === 'Clasificación' && (
            <FormGroup>
              <label>{currentQuestion.QuestionText}</label>
              <TextInput
                type="number"
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                min="1"
                max="5"
              />
            </FormGroup>
          )}
          {currentQuestion.ResponseType === 'Mapa' && (
            <TextInput value={currentResponse} onChange={(e) => handleResponseChange(e.target.value)} />
          )}
          {currentQuestion.ResponseType === 'Entrada de lápiz' && (
            <TextInput value={currentResponse} onChange={(e) => handleResponseChange(e.target.value)} />
          )}
          {['Cargar imagen', 'Audio', 'Cámara', 'Datos adjuntos', 'Visor de PDF'].includes(currentQuestion.ResponseType) && (
            <TextInput
              type="file"
              accept={currentQuestion.ResponseType === 'Cargar imagen' ? 'image/*' :
                      currentQuestion.ResponseType === 'Audio' ? 'audio/*' :
                      currentQuestion.ResponseType === 'Cámara' ? 'video/*' :
                      currentQuestion.ResponseType === 'Visor de PDF' ? 'application/pdf' : ''}
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          )}
        </BodyContainer>
        <ButtonContainer>
          <BackButton onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Back</BackButton>
          {currentQuestionIndex < questions.length - 1 && (
            <Button onClick={handleNextQuestion}>Next</Button>
          )}
          {currentQuestionIndex === questions.length - 1 && (
            <Button onClick={handleSubmitSurvey}>Submit</Button>
          )}
        </ButtonContainer>
        <MenuDrawer isOpen={isMenuOpen} toggleDrawer={toggleDrawer} />
      </ScreenContainer>
    </>
  );
};

export default SurveyForm;
