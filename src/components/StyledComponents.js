import styled from 'styled-components';

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative; /* Añadir esta línea */
`;


export const HeaderContainer = styled.div`
  background-color: #f8f9fa;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
`;

export const BodyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
`;

export const QuestionContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

export const OptionContainer = styled.div`
  margin-bottom: 10px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
`;

export const Button = styled.button`
  background-color: #6200ea;
  color: white;
  border: none;
  padding: 15px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #3700b3;
  }
`;

export const BackButton = styled(Button)`
  background-color: #ccc;
  &:hover {
    background-color: #999;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

export const ButtonContainerFixed = styled.div`
  position: absolute;
  bottom: 20px; /* Espacio desde el fondo */
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;
