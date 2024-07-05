import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function OneStepAhead({ data, w }) {
    const tenDatas = data.slice(100, 115);

    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions1Step, setPredictions1Step] = useState([]);
    const [showValues, setShowValues] = useState(false);
    const valuesContainerRef = useRef(null);

    const propagate1 = () => {
        const numPrototypes = tenDatas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p++) {
            const initialInputs = tenDatas.slice(p, p + 5);
            const V = [initialInputs, [], []];

            for (let layer = 0; layer < w.length; layer++) {
                for (let neuronIndex = 0; neuronIndex < w[layer][0].length; neuronIndex++) {
                    const wForNeuron = w[layer].map(row => row[neuronIndex]);
                    const activation = calculateActivation(wForNeuron, V[layer]);
                    V[layer + 1].push(layer === w.length - 1 ? activation : sigmoid(activation));
                }
            }

            newPredictions.push(V[V.length - 1][0]);
        }

        setPredictions1Step(newPredictions);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const toggleValuesVisibility = () => {
        if (valuesContainerRef.current) {
            if (showValues) {
                valuesContainerRef.current.style.height = `${valuesContainerRef.current.scrollHeight}px`;
                requestAnimationFrame(() => {
                    valuesContainerRef.current.style.height = '0px';
                });
            } else {
                valuesContainerRef.current.style.height = `${valuesContainerRef.current.scrollHeight}px`;
                requestAnimationFrame(() => {
                    valuesContainerRef.current.style.height = `${valuesContainerRef.current.scrollHeight}px`;
                });
            }

            setShowValues(!showValues);
        }
    };

    const chartData = {
        labels: Array.from({ length: tenDatas.slice(5).length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Valeurs prédites',
                data: predictions1Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Valeurs existantes',
                data: tenDatas.slice(5),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    useEffect(() => {
        if (valuesContainerRef.current) {
            if (showValues) {
                valuesContainerRef.current.style.height = `${valuesContainerRef.current.scrollHeight}px`;
            } else {
                valuesContainerRef.current.style.height = '0px';
            }
        }
    }, [showValues]);

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate1}>Prédiction à un pas en avant</button>
            </div>

            {predictions1Step.length > 0 && (
                <div>
                    <h2>Prédiction à un pas en avant:</h2>
                    <Line data={chartData} />

                    <div className='centred'>
                        <div onClick={toggleValuesVisibility} className='display-dropdown'>
                            <FontAwesomeIcon icon={showValues ? faChevronDown : faChevronUp} size='1.5x' />
                            <span> Afficher les valeurs et ses erreurs </span>
                        </div>
                    </div>

                    <div
                        ref={valuesContainerRef}
                        className={`values-container ${showValues ? 'open' : ''}`}
                    >
                        <div className='values-list'>
                            <div>
                                <h3>Valeurs existantes</h3>
                                <ul>
                                    {tenDatas.slice(5).map((value, index) => (
                                        <li key={index}>x({index + 106}) : {value}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3>Valeurs prédites</h3>
                                <ul>
                                    {predictions1Step.map((value, index) => (
                                        <li key={index}>{value.toFixed(8)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4>Différences</h4>
                                <ul>
                                    {tenDatas.slice(5).map((value, index) => (
                                        <li key={index}>{Math.abs(Math.abs(value) - Math.abs(predictions1Step[index])).toFixed(8)}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OneStepAhead;
