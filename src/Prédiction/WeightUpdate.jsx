import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../App.css';
import { index } from 'mathjs';

function WeightUpdate({ data: data, p:p }) {
    const [nmseValues, setNmseValues] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const step = 0.1;

    // Prepare prototypes and desired outputs from data
    const prototypes = [];
    const desiredOutputs = [];

    for (let i = 0; i < data.length - p; i++) {
        prototypes.push(data.slice(i, i + p));
        desiredOutputs.push([data[i + p]]);
    }

    // Function to generate random weights
    function getRandomWeight(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Initialize weights for a given layer configuration
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

    // Store weights for different hidden unit configurations
    const allWeightsPerUnits = [];
    for (let hiddenUnits = 1; hiddenUnits <= p; hiddenUnits++) {
        const layers = [p, hiddenUnits, 1];
        allWeightsPerUnits.push(initializeWeights(layers));
    }

    // Sigmoid activation function
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));

    // Derivative of the sigmoid function
    const sigmoidDerivative = (x) => Math.exp(-x) / ((1 + Math.exp(-x)) ** 2);

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

        for (let hiddenUnits = 1; hiddenUnits <= p; hiddenUnits++) {
            const w = allWeightsPerUnits[hiddenUnits - 1]; // Retrieve pre-initialized weights
            const networkOutputs = [];

            for (let i = 0; i < prototypes.length; i++) {
                const networkOutput = trainWithPrototype(w, prototypes[i], desiredOutputs[i]);
                networkOutputs.push(networkOutput[0]);
            }

            const desiredValues = desiredOutputs.map(output => output[0]);
            const nmse = calculateNMSE(desiredValues, networkOutputs);

            nmseResults.push(nmse);
            console.log(`Hidden Units: ${hiddenUnits}`);
            console.log('Updated weights:', w);
            console.log('NMSE:', nmse);
            console.log('\n\n');
        }

        setNmseValues(nmseResults);
        setShowChart(true);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }, 100);
    };

    // Log results to console
    const logResults = (networkOutputs) => {
        for (let i = 0; i < networkOutputs.length; i++) {
            console.log(`x${i + 6} = ${networkOutputs[i]}`);
        }
    };

    // Data and options for Chart.js Line chart
    const dataForChart = {
        labels: Array.from({length: p}, (_, index)=> index + 1),
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
        scales: {
            x: {
                ticks: {
                    color: nmseValues.map((value) => 
                        value === Math.min(...nmseValues) ? 'red' : 'rgba(240,240,240, 0.3)'
                    ),
                },
            },
        },
    };
    
    return (
        <div className='centred'>
            <button type="button" onClick={train}>Calculer les NMSE</button>
            {showChart && <Line data={dataForChart} options={options} className='chartjs'/>}
        </div>
    );
}

export default WeightUpdate;
