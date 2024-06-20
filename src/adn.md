I have the code below, change it to take in account that I have 20 prototypes to loop in it (After the weight update with the first prototype do a loop that take the new weight with the second prototype so the protype should be a matrix like this const prototype = [[0.5, 1, 1.2, 0, 1], [1.5, 0.2, 1.2, 0.3, 0.5], ... , [.....]]; //20 arrays )

import '../App.css';

function WeightUpdate() {
    const prototype = [0, 1, 1, 0, 1, 0]; // This is just an array if I have just one prototype
    const step = 0.1;
    const desiredOutput = [0.5];
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
    
    const layers = [5, 2, 1];
    const w = initializeWeights(layers);

    const V = [[...prototype], [], []];
    const delta = [[], []];
    const h = [[], [], []];

    const sigmoid = (x) => 1 / (1 + Math.exp(-x));

    const sigmoidDerivative = (x) => Math.exp(-x) / ((1 + Math.exp(-x)) ** 2);

    const calculateActivation = (weights, inputs) => {
        let sum = weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
        return sum;
    };

    const forwardPropagation = () => {
        console.log("Begin: Vers l'avant");
        for (let m = 0; m < w.length; m++) {
            console.log(`Pour m=${m + 2}`);
            for (let i = 0; i < w[m][0].length; i++) {
                const weights = w[m].map(row => row[i]);
                const activation = calculateActivation(weights, V[m]);
                h[m].push(activation);
                V[m + 1].push(sigmoid(activation));
                console.log(sigmoid(activation));
            }
            console.log('\n');
        }
        console.log("End: Vers l'avant");
        console.log(V);
    };

    const calculateOutputLayerDelta = () => {
        console.log("Begin: Delta sortie");
        for (let i = 0; i < w[1][0].length; i++) {
            let deltaValue = sigmoidDerivative(h[1][i]) * (desiredOutput[i] - V[2][i]);
            delta[1].push(deltaValue);
        }
        console.log(delta[1]);
        console.log("End: Delta sortie");
    };

    const calculateHiddenLayerDelta = () => {
        console.log("Begin: Delta caché");
        let tmp = [];
        for (let i = 0; i < w[1].length; i++) {
            tmp.push(w[1][i].map((e, index) => e * delta[1][index]));
            tmp[i] = tmp[i].reduce((a, b) => a + b);
            let deltaValue = sigmoidDerivative(h[0][i]) * tmp[i];
            delta[0].push(deltaValue);
        }
        console.log(delta[0]);
        console.log("End: Delta caché");
    };

    const updateWeights = () => {
        for (let m = 0; m < w.length; m++) {
            for (let i = 0; i < w[m].length; i++) {
                for (let j = 0; j < w[m][i].length; j++) {
                    w[m][i][j] = w[m][i][j] + step * delta[m][j] * V[m][i];
                }
            }
        }
    };

    const train = () => {
        forwardPropagation();
        console.log('\n\n');
        console.log('\n\n');
        calculateOutputLayerDelta();
        console.log('\n\n');
        console.log('\n\n');
        calculateHiddenLayerDelta();
        console.log('\n\n');
        console.log('\n\n');
        updateWeights();
        console.log('Updated weights:', w);
        console.log('V', V);
    };

    return (
        <div className='fifty'>
            <button type="button" onClick={train}>Jereo</button>
            <h1>Test</h1>
        </div>
    );
}

export default WeightUpdate;


/*/*/*/*/*/*/
I have this one step ahead prediction
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function OneStepAhead({ data, w }) {
    const datas = data.slice(100, 115);
    
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions1Step, setPredictions1Step] = useState([]);

    const propagate1 = () => {
        const numPrototypes = datas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p++) {
            const initialInputs = datas.slice(p, p + 5);
            const V = [initialInputs, [], []];

            for (let layer = 0; layer < w.length; layer++) {
                for (let neuronIndex = 0; neuronIndex < w[layer][0].length; neuronIndex++) {
                    const wForNeuron = w[layer].map(row => row[neuronIndex]);
                    const activation = calculateActivation(wForNeuron, V[layer]);
                    V[layer + 1].push(layer === w.length - 1 ? activation : sigmoid(activation));
                }
            }

            newPredictions.push(V[V.length - 1][0]); // Push the predicted output
        }

        setPredictions1Step(newPredictions);
    };

    const chartData = {
        labels: Array.from({ length: datas.slice(5).length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Predictions',
                data: predictions1Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Actual Data',
                data: datas.slice(5),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate1}>Prédiction à un pas en avant</button>
            </div>

            {predictions1Step.length > 0 && (
                <div>
                    <h2>Prédiction à un pas en avant:</h2>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
}

export default OneStepAhead;
Now I want to create another jsx component of three steps ahead
With the one step ahead one protoype give one predicted value
But with the three steps ahead one prototype give three predicted values (so a prototype should be an array : finalPrototypes = [[initialPrototype1, subPrototype11, subPrototype12], [initialPrototype2, subPrototype21, subPrototype22], [initialPrototype3, subPrototype31, subPrototype32], [initialPrototype4, subPrototype41, subPrototype42], .... ])
FOr example , with one step:
firstPrototype = [u1, u2, u3, u4, u5] // The predicted value is predictedU6
secondPrototype = [u2, u3, u4, u5, u6] // The predicted value is predictedU7

With three steps ahead :
prototypes = [
    [[u1,u2,u3,u4,u5],[],[]], // WHen We have a new predictedValue : predictedU6, it became be the first element of the next subPrototype and the last element will be poped because we should have a prototype of 5 elements (the first subPrototype here is [predictedU6, u1, u2, u3, u4] )
    [[u4,u5,u6,u7,u8],[],[]],
    [[u7,u8,u9,u10,u11],[],[]],
    [[u10,u11,u12,u13,u14],[],[]],
    ...
   
]
The first prototype:
firstPrototype = [u1, u2, u3, u4, u5] // The predicted value is predictedU6
subPrototype11 = [predictedU6, u1, u2, u3, u4] // The predicted value is predictedU7
subPrototype12 = [predictedU7, predictedU6, u1, u2, u3] // The predicted value is predictedU8

secondPrototype = [u4, u5, u6, u7, u8]  // The predicted value is predictedU9
subPrototype12 = [predictedU9, u4, u5, u6, u7]  // The predicted value is predictedU10
subPrototype22 = [predictedU10, predictedU9, u4, u5, u6]  // The predicted value is predictedU11

thirdPrototype = [u7, u8, u9, u10, u11]  // The predicted value is predictedU12
subPrototype31 = [predictedU12, u7, u8, u9, u10]  // The predicted value is predictedU13
subPrototype32 = [predictedU13, predictedU12, u7, u8, u9]  // The predicted value is predictedU14

fourthPrototype = [u10, u11, u12, u13, u14]  // The predicted value is predictedU15
subPrototype31 = [predictedU15, u10, u11, u12, u13]  // The predicted value is predictedU16
subPrototype32 = [predictedU16, predictedU15, u10, u11, u12]  // The predicted value is predictedU17

And so on...

You can change this const datas = data.slice(100, 115); but the goal is always to display 10 predicted and 10 existing values
NB: Make it dynamic and flexible (don't forget to update the code for the chart)

Now, do the same thing with 10 steps ahead:
A prototype should have 10 arrays (the initial prototype and 9 subPrototype) to give 10 predicted value
SO the first prototype will be like this :
firstPrototype = [u1, u2, u3, u4, u5] // The predicted value is predictedU6
subPrototype11 = [predictedU6, u1, u2, u3, u4] // The predicted value is predictedU7
subPrototype12 = [predictedU7, predictedU6, u1, u2, u3] // The predicted value is predictedU8
subPrototype13 = [predictedU8,predictedU7, predictedU6, u1, u2] // The predicted value is predictedU9
subPrototype14 = [predictedU9,predictedU8,predictedU7, predictedU6, u1] // The predicted value is predictedU10
subPrototype15 = [predictedU10,predictedU9,predictedU8,predictedU7, predictedU6] // The predicted value is predictedU11
subPrototype16 = [predictedU11,predictedU10,predictedU9,predictedU8, predictedU7] // The predicted value is predictedU12
subPrototype17 = [predictedU12, predictedU11,predictedU10,predictedU9,predictedU8] // The predicted value is predictedU13
subPrototype18 = [predictedU13, predictedU12, predictedU11,predictedU10,predictedU9] // The predicted value is predictedU14
subPrototype19 = [predictedU14, predictedU13, predictedU12, predictedU11,predictedU10] // The predicted value is predictedU15