import React, { useState } from 'react';
import './App.css';
import FiftyValues from './Fifty Values/500Values';
import Graph from './Fifty Values/Graph';
import HenonSequences from './HenonSequence';
import calculateXY from './Fifty Values/get500Values';
import Covariance from './Matrix/Covariance';


const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const datas = calculateXY(0,0,500)
  // const data= [1, -0.4, 1.076, -0.7408864, 0.55432228, 0.34755161]
  const data= (datas.map(point => (point[0]))).slice(1)
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
    <div className='app-container'>
      <div className='sidebar'>
        <button type="button" onClick={() => toPage(0)}>500 Values</button>
        <button type="button" onClick={() => toPage(1)}>Graph</button>
        <button type="button" onClick={() => toPage(2)}>Série temporelle</button>
        <button type="button" onClick={() => toPage(3)}>Matrice de covariance</button>

        {/* <button type="button" onClick={() => {toPage(2); afficherMatriceConsole()}}>Série temp</button>
        <button type="button" onClick={() => toPage(3)}>Covariance</button>
        <button type="button" onClick={() => toPage(4)}>Valeurs</button> */}
      </div>
      <div className='content'>
        {currentPage === 0 && <FiftyValues />}
        {currentPage === 1 && < Graph/>}
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

