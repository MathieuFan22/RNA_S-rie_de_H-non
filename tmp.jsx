import React, { useState, useRef } from 'react';
import './Test.css';
import FiftyValues from './Fifty Values/500Values';
import Graph from './Fifty Values/Graph';
import HenonSequences from './HenonSequence';
import calculateXY from './Fifty Values/get500Values';
import Covariance from './Matrix/Covariance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const datas = calculateXY(0, 0, 500)
  // const data= [1, -0.4, 1.076, -0.7408864, 0.55432228, 0.34755161]
  const data = (datas.map(point => (point[0]))).slice(1)
  const toPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const [expand, setExpand] = useState("expand");
  const [isVisible, setIsVisible] = useState(true);
  const handleMenuClick = () => {
    console.log("dfdf");
    setExpand((prevExpand) => (prevExpand === "expand" ? "unexpand" : "expand"));
    if (!isVisible) {
     setTimeout(()=> {
      setIsVisible(true)
     }, 200);
    }
    setIsVisible(false)
  }
  return (
    <div className='root'>
      <div id="sidebar" className={expand}>
        <div id="header">
          <div style={{ display: isVisible ? 'block' : 'none' }}>Image</div>
          <div style={{ display: isVisible ? 'block' : 'none' }} id="title">Astrovibe</div>
          <div id='burger-menu' onClick={handleMenuClick}>
            <div className="burger">
            </div>
          </div>
        </div>
        <ul>
          <li className="lia lis" onClick={() => toPage(0)}>
            <FontAwesomeIcon className="icon" icon={faCaretUp} />
            <span className='li-el' style={{ display: isVisible ? 'block' : 'none' }} >500 Values</span>
          </li>
          <li className="lia lis" onClick={() => toPage(1)}>
            <FontAwesomeIcon className="icon" icon={faCaretUp} />
            <span className='li-el' style={{ display: isVisible ? 'block' : 'none' }} >Graph</span>
          </li>
          <li className="lia lis" onClick={() => toPage(2)}>
            <FontAwesomeIcon className="icon" icon={faCaretUp} />
            <span className='li-el' style={{ display: isVisible ? 'block' : 'none' }} >Série temporelle</span>
          </li>
          <li className="lia lis" onClick={() => toPage(3)}>
            <FontAwesomeIcon className="icon" icon={faCaretUp} />
            <span className='li-el' style={{ display: isVisible ? 'block' : 'none' }} >Matrice de covariance</span>
          </li>

        </ul>





      </div>
      <div id="container" className='content'>
        {currentPage === 0 && <FiftyValues />}
        {currentPage === 1 && < Graph />}
        {currentPage === 2 && < HenonSequences data={data} />}
        {currentPage === 3 && < Covariance data={data} />}

        {/*currentPage === 3 && <Covariance data={data}/>}
        {currentPage === 4 && <EigenvalueCalculator data={data} />}
        {currentPage === 4 && <LanczosEigenvalueCalculator />} */}
      </div>
    </div>
  );
};

export default App;

