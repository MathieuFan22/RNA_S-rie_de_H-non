import React, { useState } from 'react';
import './App.css';
import FiftyValues from './Fifty Values/500Values';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import HenonSequences from './HenonSequence';
import calculateXY from './Fifty Values/get500Values';
import Covariance from './Matrix/Covariance';
import HenonMap from './HenonMap';
import WeightUpdate from './Prédiction/WeightUpdate';
import NeuralNetworkPredictor from './NeuralNetworkPredictor';

const App = () => {
  const [currentPage, setCurrentPage] = useState(3);
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

        {/* Architecture Dropdown */}
        <div className='dropdown' onClick={() => toggleDropdown('architecture')}>
          <h4>Architecture</h4> <FontAwesomeIcon icon={dropdowns.architecture ? faCaretUp : faCaretDown} />
        </div>
        <div className={`dropdown-content ${dropdowns.architecture ? 'visible' : ''}`}>
          <button type="button" onClick={() => toPage(2)}>Unité de la couche d'entrée</button>
          <button type="button" onClick={() => toPage(3)}>Unité de la couche de sortie</button>
        </div>
       
        

        {/* Prediction Dropdown */}
        <div className='dropdown' onClick={() => toggleDropdown('prediction')}>
          <h4>Prédiction</h4> <FontAwesomeIcon icon={dropdowns.prediction ? faCaretUp : faCaretDown} />
        </div>
        <div className={`dropdown-content ${dropdowns.prediction ? 'visible' : ''}`}>
          <button type="button" onClick={() => toPage(4)}>Erreur</button>
        </div>
        


      </div>
      <div className='content'>
        {currentPage === 0 && <FiftyValues />}
        {currentPage === 1 && <HenonSequences data={data} />}
        {currentPage === 2 && <Covariance data={data} />}
        {currentPage === 3 && <WeightUpdate data={data} p={4} />}
        {currentPage === 4 && <NeuralNetworkPredictor data={data} />}
        {/* {currentPage === 4 && <HenonMap a={1.4} b={0.3} x0={0} y0={0} n={500} />} */}
      </div>
    </div>
  );
};

export default App;
