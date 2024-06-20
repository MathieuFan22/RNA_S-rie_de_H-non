import React, { useState } from 'react';
import './App.css';
import FiftyValues from './Fifty Values/500Values';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import HenonSequences from './HenonSequence';
import calculateXY from './Fifty Values/get500Values';
import Apprentissage from './Prédiction/Apprentissage';
import Architecture from './Architecture/Architecture';

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdowns, setDropdowns] = useState({
    architecture: false,
    prediction: false,
    series: false  // State for series dropdown
  });

  const datas = calculateXY(0, 0, 500);
  const data = (datas.map(point => (point[0]))).slice(1);

  const toPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns(prevDropdowns => ({
      ...prevDropdowns,
      [dropdown]: !prevDropdowns[dropdown]
    }));
  };

  return (
    <div className='app-container'>
      <div className='sidebar'>
        <h4>Hénon</h4>
        {/* Series Dropdown */}
        <div className='dropdown' onClick={() => toggleDropdown('series')}>
          <h4>Series</h4> <FontAwesomeIcon icon={dropdowns.series ? faCaretUp : faCaretDown} />
        </div>
        <div className={`dropdown-content ${dropdowns.series ? 'visible' : ''}`}>
          <button type="button" onClick={() => toPage(0)}>500 Values</button>
          <button type="button" onClick={() => toPage(1)}>Série temporelle</button>
        </div>

    
   
        

        {/* Prediction Dropdown */}
        <div className='dropdown' onClick={() => toggleDropdown('prediction')}>
          <h4>Prédiction</h4> <FontAwesomeIcon icon={dropdowns.prediction ? faCaretUp : faCaretDown} />
        </div>
        <div className={`dropdown-content ${dropdowns.prediction ? 'visible' : ''}`}>
        <button type="button" onClick={() => toPage(2)}>Prédiction</button>
        </div>
        


      </div>
      <div className='content'>
        {currentPage === 0 && <FiftyValues />}
        {currentPage === 1 && <HenonSequences data={data} />}
        {currentPage === 2 && <Architecture data={data} />}
      </div>
    </div>
  );
};

export default App;
