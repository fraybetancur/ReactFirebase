import React, { useState } from 'react';
import SurveyForm from './components/SurveyForm';
import ExcelUploader from './components/ExcelUploader';
import MenuDrawer, { MenuButtonWrapper } from './components/MenuDrawer';

const App = () => {
  const [currentPage, setCurrentPage] = useState('survey');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <MenuButtonWrapper toggleDrawer={() => {}} />
      <MenuDrawer isOpen={true} toggleDrawer={() => {}} onMenuClick={handlePageChange} />
      {currentPage === 'survey' && <SurveyForm />}
      {currentPage === 'upload' && <ExcelUploader />}
    </div>
  );
};

export default App;
