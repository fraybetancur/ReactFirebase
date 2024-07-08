import React, { useState } from 'react';
import SurveyForm from './SurveyForm';
import ExcelUploader from './ExcelUploader';
import MenuDrawer, { MenuButtonWrapper } from './MenuDrawer';

const MasterComponent = () => {
  const [currentPage, setCurrentPage] = useState('survey');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsDrawerOpen(false);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <div>
      <MenuButtonWrapper toggleDrawer={toggleDrawer} />
      <MenuDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} onMenuClick={handlePageChange} />
      {currentPage === 'survey' && <SurveyForm />}
      {currentPage === 'upload' && <ExcelUploader />}
    </div>
  );
};

export default MasterComponent;
