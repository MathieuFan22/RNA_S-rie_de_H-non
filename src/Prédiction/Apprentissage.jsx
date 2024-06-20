/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../App.css';
import OneStepAhead from './OneStepPrediction';
import ThreeStepsAhead from './ThreeStepsPrediction';
import TenStepsAhead from './TenStepsPrediction';
import TwentyStepsAhead from './twentyStepsAhead';

function Apprentissage({ data: data, inputUnit: inputUnit, hiddenUnit: hiddenUnit }) {
    const [nmseValues, setNmseValues] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [hideButton, setHideButton] = useState(false);
    const [lastWeight, setLastWeight] = useState([]);
    const [oneStepPrediction, setOneStepPrediction] = useState(false);
    const [threeStepPrediction, setThreeStepPrediction] = useState(false);
    const [tenStepPrediction, setTenStepPrediction] = useState(false);
    const [twentyStepPrediction, setTwentyStepPrediction] = useState(false);
    const step = 0.2;

    // Prepare prototypes and desired outputs from data
    const prototypes = [];
    const desiredOutputs = [];

    for (let i = 0; i < data.length - inputUnit; i++) {
        prototypes.push(data.slice(i, i + inputUnit));
        desiredOutputs.push([data[i + inputUnit]]);
    }

    // Function to generate random weights
    function getRandomWeight(min, max) {
        return Math.random() * (max - min) + min;
    }

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

    const layers = [inputUnit, 1, 1];
    const w = initializeWeights(layers);

    // Sigmoid activation function
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    // Derivative of the sigmoid function
    const sigmoidDerivative = (x) => 1 - Math.pow(sigmoid(x), 2)

    // Calculate the weighted sum of inputs
    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    // Perform forward propagation through the neural network
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

    // Calculate delta for the output layer
    const calculateOutputLayerDelta = (w, V, h, desiredOutput) => {
        const delta = [];
        for (let i = 0; i < w[1][0].length; i++) {
            delta.push(sigmoidDerivative(h[1][i]) * (desiredOutput[i] - V[2][i]));
        }
        return delta;
    };

    // Calculate delta for the hidden layer
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

    // Update weights based on delta and learning rate
    const updateWeights = (w, V, delta) => {
        for (let m = 0; m < w.length; m++) {
            for (let i = 0; i < w[m].length; i++) {
                for (let j = 0; j < w[m][i].length; j++) {
                    w[m][i][j] = w[m][i][j] + step * delta[m][j] * V[m][i];
                }
            }
        }
    };

    // Train the neural network with a given prototype and desired output
    const trainWithPrototype = (w, prototype, desiredOutput) => {
        const V = [[...prototype], [], []];
        const h = [[], [], []];

        forwardPropagation(w, V, h);

        const outputDelta = calculateOutputLayerDelta(w, V, h, desiredOutput);
        const hiddenDelta = calculateHiddenLayerDelta(w, V, h, outputDelta);

        updateWeights(w, V, [hiddenDelta, outputDelta]);
        // console.log(V[2]);
        return V[2]; // Return the output of the network
    };

    // Calculate Normalized Mean Squared Error (NMSE)
    const calculateNMSE = (desired, predicted) => {
        const mean = desired.reduce((sum, val) => sum + val, 0) / desired.length;
        const mse = desired.reduce((sum, val, idx) => sum + Math.pow(val - predicted[idx], 2), 0) / desired.length;
        const variance = desired.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / desired.length;
        return mse / variance;
    };

    // Train the network for all configurations and store NMSE values
    const train = () => {
        const nmseResults = [];

        for (let epoch = 1; epoch <= 40; epoch++) {
            const networkOutputs = [];
            for (let i = 0; i < prototypes.length; i++) {
                const networkOutput = trainWithPrototype(w, prototypes[i], desiredOutputs[i]);
                networkOutputs.push(networkOutput[0]);
            }

            const desiredValues = desiredOutputs.map(output => output[0]);
            const nmse = calculateNMSE(desiredValues, networkOutputs);

            nmseResults.push(nmse);
            console.log(`Epoque : ${epoch}`);
            console.log('Updated weights:', w);
            console.log('NMSE:', nmse);
            console.log('\n\n');
        }

        setNmseValues(nmseResults);
        setShowChart(true);
        setHideButton(true)
        setLastWeight(w)
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }, 100);
        showPrediction()
    };

    const showPrediction = () => {
        setOneStepPrediction(true)
        setThreeStepPrediction(true)
        setTenStepPrediction(true)
        setTwentyStepPrediction(true)
    };

    // Data and options for Chart.js Line chart
    const dataForChart = {
        labels: Array.from({ length: 40 }, (_, index) => index + 1),
        datasets: [
            {
                label: 'NMSE',
                data: nmseValues,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: 'rgba(75,192,192,1)',
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Epoques',
            },
          },
          y: {
            // beginAtZero: true, // Ensure the y-axis begins at zero
            title: {
              display: true,
              text: 'NMSE',
            },
          },
        },
      };


    return (
        <div className=''>
            {!hideButton && <button type="button" onClick={train}>Afficher le graphe d'apprentissage</button>}
            {showChart &&
                <div className="sdfsdf">
                    <Line data={dataForChart} options={options} className='chartjs' />
                    {/* <div className="centred">
                        <button type="button" onClick={showOneStepPrediction}>Prédiction</button>
                    </div> */}
                    {oneStepPrediction && <OneStepAhead data={data} w={lastWeight} />}
                    {threeStepPrediction && <ThreeStepsAhead data={data} w={lastWeight} />}
                    {tenStepPrediction && <TenStepsAhead data={data} w={lastWeight} />}
                    {twentyStepPrediction && <TwentyStepsAhead data={data} w={lastWeight} />}

                </div>

            }
        </div>
    );
}

export default Apprentissage;