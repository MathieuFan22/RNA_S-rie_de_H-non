import React, { useState } from 'react';
import './App.css';
import WeightUpdate from './Prédiction/WeightUpdate';


const App2 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const toPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className='app-container'>
      <div className='sidebar'>
        <button type="button" onClick={() => toPage(0)}>500 Values</button>
       
      </div>
      <div className='content'>
        {currentPage === 0 && <WeightUpdate />}
       
      </div>
    </div>
  );
};

export default App2;

