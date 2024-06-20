import '../App.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import calculateXY from './get500Values';
import Graph from './Graph';

function FiftyValues() {
    const [showGraph, setshowGraph] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Voir la représentaion graphique");
    const toGraph = () => {
        setshowGraph(prev => !prev)
        setButtonLabel(showGraph? "Voir la représentaion graphique" : "Voir les 500 valeurs")
    };
    const data = calculateXY(0, 0, 500)
    return (
        <div className='fifty'>
            <button onClick={toGraph} className='graph-button'>{buttonLabel}</button>
            { !showGraph && data.map(([xVal, yVal], index) => {
                if (index === 0) {
                    return (
                        <div className='list' key={index} >
                            <div>Pour n = 0</div>
                            <div>
                                x(0) = 0
                            </div>
                            <div>
                                y(0) = 0
                            </div>
                        </div>
                    );
                }

                return (
                    <div className='list' key={index} >
                        <div>Pour n = {index}</div>
                        <div>
                            x({index}) = {xVal}
                        </div>
                        <div>
                            y({index}) ={yVal}
                        </div>
                    </div>
                );
            })}
            {showGraph && <Graph data={data} />}
            <div className="scrollButtons">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><FontAwesomeIcon icon={faCaretUp}/></button>
                <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}><FontAwesomeIcon icon={faCaretDown}/></button>
            </div>
        </div>
    );
}

export default FiftyValues;
