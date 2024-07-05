import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function TwentyStepsAhead({ data, w }) {
    const datas = data.slice(100, 130);

    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions20Step, setPredictions20Step] = useState([]);
    const [showValues, setShowValues] = useState(false);
    const valuesContainerRef = useRef(null);

    const propagate20 = () => {
        const numPrototypes = datas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p += 20) {
            let prototypes = [[datas.slice(p, p + 5), ...Array(19).fill([])]];
            let currentPredictions = [];

            for (let step = 0; step < 20; step++) {
                const V = prototypes[step];
                for (let layer = 0; layer < w.length; layer++) {
                    for (let neuronIndex = 0; neuronIndex < w[layer][0].length; neuronIndex++) {
                        const wForNeuron = w[layer].map(row => row[neuronIndex]);
                        const activation = calculateActivation(wForNeuron, V[layer]);
                        V[layer + 1].push(layer === w.length - 1 ? activation : sigmoid(activation));
                    }
                }
                const predictedValue = V[V.length - 1][0];
                currentPredictions.push(predictedValue);

                if (step < 19) {
                    prototypes.push([[], ...Array(19).fill([])]);
                    prototypes[step + 1][0] = [predictedValue, ...prototypes[step][0].slice(0, 4)];
                }
            }

            newPredictions.push(...currentPredictions);
        }

        setPredictions20Step(newPredictions.slice(0, 20));
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
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
        labels: Array.from({ length: 10 }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Valeurs prédites',
                data: predictions20Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Valeurs existantes',
                data: datas.slice(5),
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
                <button onClick={propagate20}>Prédiction à vingt pas en avant</button>
            </div>

            {predictions20Step.length > 0 && (
                <div>
                    <h2>Prédiction à 20 pas en avant:</h2>
                    <Line data={chartData} />

                    <div className='centred'>
                        <div onClick={toggleValuesVisibility} className='display-dropdown'>
                            <FontAwesomeIcon icon={showValues ? faChevronDown : faChevronUp} size='1.5x' />
                            <span > Afficher les valeurs et ses erreurs </span>
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
                                    {datas.slice(5, 15).map((value, index) => (
                                        <li key={index}>x({index + 106}) : {value}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3>Valeurs prédites</h3>
                                <ul>
                                    {predictions20Step.slice(0, 10).map((value, index) => (
                                        <li key={index}>{value.toFixed(8)}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3>Différences</h3>
                                <ul>
                                    {datas.slice(5, 15).map((value, index) => (
                                        <li key={index}>{Math.abs(Math.abs(value) - Math.abs(predictions20Step[index])).toFixed(8)}</li>
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

export default TwentyStepsAhead;