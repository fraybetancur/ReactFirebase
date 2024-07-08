import React, { useState, useEffect } from 'react';
import SurveyForm from './components/SurveyForm';
import ExcelUploader from './components/ExcelUploader';
import MenuDrawer, { MenuButtonWrapper } from './components/MenuDrawer';

const App = () => {
  const [currentPage, setCurrentPage] = useState('survey');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prueba, setPrueba] = useState(true); // Definir prueba como una variable de estado

  const handlePageChange = (page) => {
    console.log(`Changing page to: ${page}`);
    setCurrentPage(page);
    console.log('Current page:', page);
    setPrueba(false); // Cerrar el menú
    console.log('Menu open (prueba):', prueba);
  };

  const toggleDrawer = (open) => {
    console.log(`Toggling drawer to: ${open}`);
    setIsMenuOpen(open);
    setPrueba(open);
    console.log('Menu open (isMenuOpen):', open);
    console.log('Menu open (prueba):', prueba);
  };

  useEffect(() => {
    console.log('isMenuOpen changed:', isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    console.log('prueba changed:', prueba);
  }, [prueba]);

  return (
    <div>
      <MenuButtonWrapper toggleDrawer={toggleDrawer} />
      <MenuDrawer isOpen={prueba} toggleDrawer={toggleDrawer} onMenuClick={handlePageChange} />
      {currentPage === 'survey' && <SurveyForm />}
      {currentPage === 'upload' && <ExcelUploader />}
    </div>
  );
};

export default App;
