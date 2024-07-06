import React, { useState } from 'react';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleCaseAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h1>Gestión de Casos</h1>
      <CaseForm onCaseAdded={handleCaseAdded} />
      <CaseList key={refresh} />
    </div>
  );
};

export default App;
