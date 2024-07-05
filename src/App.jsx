import React, { useState } from 'react';
import './App.css';
import FiftyValues from './Fifty Values/500Values';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCircleInfo, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import HenonSequences from './Architecture/HenonSequence';
import calculateXY from './Fifty Values/get500Values';
import Architecture from './Architecture/Architecture';
import Landing from './Landing';

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdowns, setDropdowns] = useState({
    architecture: false,
    prediction: false,
    series: false
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
          <button type="button" onClick={() => toPage(1)}>500 Valeurs</button>
          <button type="button" onClick={() => toPage(2)}>Séquences</button>
        </div>


        {/* Prediction Dropdown */}
        <div className='dropdown' onClick={() => toggleDropdown('prediction')}>
          <h4>Prédiction</h4> <FontAwesomeIcon icon={dropdowns.prediction ? faCaretUp : faCaretDown} />
        </div>
        <div className={`dropdown-content ${dropdowns.prediction ? 'visible' : ''}`}>
          <button type="button" onClick={() => toPage(3)}>Prédiction</button>
        </div>

        <span className='close'><FontAwesomeIcon icon={faInfoCircle} /> Alt+f4 pour quitter</span>



      </div>
      <div className='content'>
        {currentPage === 0 && <Landing toPage={toPage}/>}
        {currentPage === 1 && <FiftyValues />}
        {currentPage === 2 && <HenonSequences data={data} />}
        {currentPage === 3 && <Architecture data={data} />}
      </div>
    </div>
  );
};

export default App;
