import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../App.css';

function WeightUpdate({ data }) {
    const [nmseValues, setNmseValues] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const step = 0.1;

    // Prepare prototypes and desired outputs from data
    const prototypes = [];
    const desiredOutputs = [];

    for (let i = 0; i < data.length - 5; i++) {
        prototypes.push(data.slice(i, i + 5));
        desiredOutputs.push([data[i + 5]]);
    }

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

    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const sigmoidDerivative = (x) => Math.exp(-x) / ((1 + Math.exp(-x)) ** 2);

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

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

    const calculateOutputLayerDelta = (w, V, h, desiredOutput) => {
        const delta = [];
        for (let i = 0; i < w[1][0].length; i++) {
            delta.push(sigmoidDerivative(h[1][i]) * (desiredOutput[i] - V[2][i]));
        }
        return delta;
    };

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

    const updateWeights = (w, V, delta) => {
        for (let m = 0; m < w.length; m++) {
            for (let i = 0; i < w[m].length; i++) {
                for (let j = 0; j < w[m][i].length; j++) {
                    w[m][i][j] = w[m][i][j] + step * delta[m][j] * V[m][i];
                }
            }
        }
    };

    const trainWithPrototype = (w, prototype, desiredOutput) => {
        const V = [[...prototype], [], []];
        const h = [[], [], []];

        forwardPropagation(w, V, h);

        const outputDelta = calculateOutputLayerDelta(w, V, h, desiredOutput);
        const hiddenDelta = calculateHiddenLayerDelta(w, V, h, outputDelta);

        updateWeights(w, V, [hiddenDelta, outputDelta]);

        return V[2]; // Return the output of the network
    };

    const calculateNMSE = (desired, predicted) => {
        const mean = desired.reduce((sum, val) => sum + val, 0) / desired.length;
        const mse = desired.reduce((sum, val, idx) => sum + Math.pow(val - predicted[idx], 2), 0) / desired.length;
        const variance = desired.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / desired.length;
        return mse / variance;
    };

    const train = () => {
        const nmseResults = [];

        for (let hiddenUnits = 1; hiddenUnits <= 5; hiddenUnits++) {
            const layers = [5, hiddenUnits, 1];
            let w = initializeWeights(layers);

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
    };

    const logResults = (networkOutputs) => {
        for (let i = 0; i < networkOutputs.length; i++) {
            console.log(`x${i + 6} = ${networkOutputs[i]}`);
        }
    };

    const dataForChart = {
        labels: [1, 2, 3, 4, 5],
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
                        value === Math.min(...nmseValues) ? 'red' : 'black'
                    ),
                },
            },
        },
    };

    return (
        <div className='fifty'>
            <button type="button" onClick={train}>Train and Show NMSE Graph</button>
            {showChart && <Line data={dataForChart} options={options} />}
        </div>
    );
}

export default WeightUpdate;
