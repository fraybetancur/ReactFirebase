import React from 'react';
import SurveyForm from './components/SurveyForm';
import ExcelUploader from './components/ExcelUploader';
import MenuDrawer from './components/MenuDrawer'; // Asegúrate de importar este componente

const App = () => {
  return (
    <div>
      <MenuDrawer />
      <h1>Dynamic Survey Form</h1>
      <ExcelUploader /> {/* Botón para cargar el archivo Excel */}
      <SurveyForm /> {/* Renderiza el componente del formulario de la encuesta */}
    </div>
  );
};

export default App;
