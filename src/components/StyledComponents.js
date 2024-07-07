import styled from 'styled-components';
import { lighten } from 'polished';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* Evitar cualquier desplazamiento */
    width: 100%;
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: ${({ $height }) => $height || '98vh'};
  width: ${({ $width }) => $width || '100vw'};
  overflow: hidden;
  min-height: ${({ $minHeight }) => $minHeight || '600px'};
  min-width: ${({ $minWidth }) => $minWidth || '320px'};
  background-color: #FAFAFA; /* Fondo claro para resaltar separación */
  padding: 10px; /* Espaciado interno */
  box-sizing: border-box; /* Incluir padding en el tamaño del contenedor */
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center; /* Centrar contenido verticalmente */
  justify-content: space-between; /* Asegurar que el contenido se distribuya */
  background-color: #0078d4;
  color: #ffffff;
  height: 40px; /* Altura fija */
  padding: 0 10px; /* Espaciado interno */
  text-align: center;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
  border: 1px solid rgba(226, 226, 226, 1); /* Agregar borde */
  margin-bottom: 10px; /* Espaciado externo */
  box-sizing: border-box; /* Incluir padding en el tamaño del contenedor */
`;


export const MenuButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px; /* Tamaño del icono */
  cursor: pointer;
  margin-right: auto; /* Alinear a la izquierda */
  &:hover {
    color: ${lighten(0.2, '#ffffff')}; /* Aclarar color en hover */
  }
`;

export const Title = styled.h1`
  flex: 1; /* Ocupa el espacio restante */
  margin: 0;
  font-size: 16px; /* Tamaño de fuente ajustado */
  text-align: center;
`;

export const SearchContainer = styled.div`
  height: 40px;
  width: 100%;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background-color: #ffffff;
  border: 1px solid rgba(226, 226, 226, 1); /* Agregar borde */
  margin-bottom: 10px; /* Espaciado externo */
`;

export const BodyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(226, 226, 226, 1); /* Agregar borde */
  background-color: #ffffff;
  margin-bottom: 10px; /* Espaciado externo */
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  background-color: #ffffff;
  flex-shrink: 0;
  gap: 20px; /* Añadir espacio entre los botones */
  border: 1px solid rgba(226, 226, 226, 1); /* Agregar borde */
`;

export const Button = styled.button`
  background-color: #F5A626;
  color: white;
  border: none;
  padding: 15px 40px; /* Ajustar padding para mayor ancho */
  border-radius: 30px; /* Hacer los botones redondeados */
  cursor: pointer;
  font-size: 1rem;
  min-width: 150px; /* Establecer un ancho mínimo */
  &:hover {
    background-color: ${lighten(0.2, '#F5A626')}; /* Hacer el color 20% más claro */
  }
`;

export const BackButton = styled(Button)`
  background-color: #eee;
  color: #333;
  &:hover {
    background-color: ${lighten(0.2, '#eee')}; /* Hacer el color 20% más claro */
  }
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(226, 226, 226, 1); /* Agregar borde */
  margin-bottom: 10px; /* Espaciado externo */
`;
