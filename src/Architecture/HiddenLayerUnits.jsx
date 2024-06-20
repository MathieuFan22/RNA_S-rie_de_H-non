import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../App.css';
import Apprentissage from '../Prédiction/Apprentissage';

function HiddenLayerUnits({ data: data, inputUnit: inputUnit }) {
    const [nmseValues, setNmseValues] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [showTrainButton, setShowTrainButton] = useState(false);
    const [showTrain, setShowTrain] = useState(false);
    const [hiddenUnitIndex, sethiddenUnitIndex] = useState(null);
    const step = 0.2;

    // Préparer les prototypes et les sorties désirées
    const prototypes = [];
    const desiredOutputs = [];

    for (let i = 0; i < data.length - inputUnit; i++) {
        prototypes.push(data.slice(i, i + inputUnit));
        desiredOutputs.push([data[i + inputUnit]]);
    }

    // Générer des poids aléatoires
    function getRandomWeight(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Initialiser les poids pour une confifuration de couche donnée
    function initializeWeights(layers) {
        const weights = [];
        for (let i = 0; i < layers.length - 1; i++) {
            const layerWeights = [];
            for (let j = 0; j < layers[i]; j++) {
                const neuronWeights = [];
                for (let k = 0; k < layers[i + 1]; k++) {
                    neuronWeights.push(Number(getRandomWeight(0.1, 0.3).toFixed(2)));
                }
                layerWeights.push(neuronWeights);
            }
            weights.push(layerWeights);
        }
        return weights;
    }

    // Stocker les poids pour différentes unités cachées
    const allWeightsPerUnits = [];
    for (let hiddenUnits = 1; hiddenUnits <= inputUnit; hiddenUnits++) {
        const layers = [inputUnit, hiddenUnits, 1];
        allWeightsPerUnits.push(initializeWeights(layers));
    }

    // Fonction d'activation (Sigmoïde)
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    // Dérivé de la fonction sigmoïde
    const sigmoidDerivative = (x) => 1 - Math.pow(sigmoid(x), 2)

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    // Propagation vers l'avant à travers le réseau
    const forwardPropagation = (w, V, h) => {
        for (let m = 0; m < w.length; m++) {
            for (let i = 0; i < w[m][0].length; i++) {
                const weights = w[m].map(row => row[i]);
                const activation = calculateActivation(weights, V[m]);
                h[m].push(activation);
                V[m + 1].push(sigmoid(activation));
            }
        }
    };

    // Calcul des Deltas pour la couche de sortie
    const calculateOutputLayerDelta = (w, V, h, desiredOutput) => {
        const delta = [];
        for (let i = 0; i < w[1][0].length; i++) {
            delta.push(sigmoidDerivative(h[1][i]) * (desiredOutput[i] - V[2][i]));
        }
        return delta;
    };
    
    // Calcul des Deltas pour la couche cachée
    const calculateHiddenLayerDelta = (w, V, h, outputDelta) => {
        const delta = [];
        let tmp = [];
        for (let i = 0; i < w[1].length; i++) {
            tmp.push(w[1][i].map((e, index) => e * outputDelta[index]));
            tmp[i] = tmp[i].reduce((a, b) => a + b);
            delta.push(sigmoidDerivative(h[0][i]) * tmp[i]);
        }
        return delta;
    };

    // Mise à jour des poids
    const updateWeights = (w, V, delta) => {
        for (let m = 0; m < w.length; m++) {
            for (let i = 0; i < w[m].length; i++) {
                for (let j = 0; j < w[m][i].length; j++) {
                    w[m][i][j] = w[m][i][j] + step * delta[m][j] * V[m][i];
                }
            }
        }
    };

    // Apprentissage avec tous les prototypes
    const trainWithPrototype = (w, prototype, desiredOutput) => {
        const V = [[...prototype], [], []];
        const h = [[], [], []];

        forwardPropagation(w, V, h);

        const outputDelta = calculateOutputLayerDelta(w, V, h, desiredOutput);
        const hiddenDelta = calculateHiddenLayerDelta(w, V, h, outputDelta);

        updateWeights(w, V, [hiddenDelta, outputDelta]);

        return V[2]; // Retourne la valeur donnée par le réseau
    };


    const calculateNMSE = (desired, predicted) => {
        const mean = desired.reduce((sum, val) => sum + val, 0) / desired.length;
        const mse = desired.reduce((sum, val, idx) => sum + Math.pow(val - predicted[idx], 2), 0) / desired.length;
        const variance = desired.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / desired.length;
        return mse / variance;
    };

    // Apprentissage pour toutes les configurations et stocker les NMSE
    const trainForHiddenUnits = () => {
        const nmseResults = [];

        for (let hiddenUnits = 1; hiddenUnits < inputUnit; hiddenUnits++) {
            const w = allWeightsPerUnits[hiddenUnits - 1]; 
            const networkOutputs = [];

            for (let i = 0; i < prototypes.length; i++) {
                const networkOutput = trainWithPrototype(w, prototypes[i], desiredOutputs[i]);
                networkOutputs.push(networkOutput[0]);
            }

            const desiredValues = desiredOutputs.map(output => output[0]);
            const nmse = calculateNMSE(desiredValues, networkOutputs);

            nmseResults.push(nmse);
            const minNmseValue = Math.min(...nmseResults);
            const minNmseIndex = nmseResults.indexOf(minNmseValue);
            sethiddenUnitIndex(minNmseIndex + 1)
        }

        setNmseValues(nmseResults);
        setShowChart(true);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            setShowTrainButton(true)
        }, 100);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }, 200);
    };

    const train = () => {
    };

    const dataForChart = {
        labels: Array.from({ length: inputUnit - 1 }, (_, index) => index + 1),
        datasets: [
            {
                label: 'NMSE',
                data: nmseValues,
                fill: false,
                backgroundColor: nmseValues.map((value, index) =>
                    value === Math.min(...nmseValues) ? 'red' : 'rgba(75,192,192,0.4)'
                ),
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: nmseValues.map((value, index) =>
                    value === Math.min(...nmseValues) ? 'red' : 'rgba(75,192,192,1)'
                ),
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
              display: false,
            },
          },
        scales: {
            x: {
                ticks: {
                    color: nmseValues.map((value) =>
                        value === Math.min(...nmseValues) ? 'red' : 'rgba(240,240,240, 0.3)'
                    ),
                },
                title: {
                    display: true,
                    text: 'Unités',
                },
                beginAtZero: true,
            },
            y: {
                title: {
                    display: true,
                    text: 'NMSE',
                },
            }
        },
    };

    return (
        <div className='centred'>
            <button type="button" onClick={trainForHiddenUnits}>Calculer les NMSE</button>
            {showChart && 
                <div>
                    <Line data={dataForChart} options={options} className='chartjs' />
                    <h4>Le Nombre d'unités de la couche d'entrée est {hiddenUnitIndex} </h4>
                </div>
            }
            {showTrainButton &&
                <div className="centred">
                    <div className="line"></div>
                    <h2>Représentation graphique de l'apprentissage</h2>
                    <Apprentissage data={data} inputUnit={inputUnit} hiddenUnit={hiddenUnitIndex} />
                </div>
            }

        </div>
    );
}

export default HiddenLayerUnits;
