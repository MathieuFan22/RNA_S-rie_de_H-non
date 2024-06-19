import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function OneStepPrediction({ data, w }) {


    // /** ***/
    // const datas = [0.2, 0.4, 0.1, 0.1, 0.5];
    // const weights = [
    //     [
    //         [0.1, 0.1],
    //         [0.2, 0.2]
    //     ],
    //     [
    //         [0.1],
    //         [0.3]
    //     ]
    // ];

    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    // Function to calculate the weighted sum of inputs
    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions1Step, setPredictions1Step] = useState([]);
    const [predictions3Step, setPredictions3Step] = useState([]);

    const propagate1 = () => {
        const numPrototypes = data.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p++) {
            const V = [[data[p], data[p + 1], data[p + 2], data[p + 3], data[p + 4]], [], []];

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

    // const propagate3 = () => {
    //     const numPrototypes = datas.length - 4;
    //     const newPredictions = [];

    //     for (let p = 0; p < numPrototypes; p++) {
    //         let V = [[datas[p], datas[p + 1]], [], []];

    //         for (let layer = 0; layer < weights.length; layer++) {
    //             for (let neuronIndex = 0; neuronIndex < weights[layer][0].length; neuronIndex++) {
    //                 const weightsForNeuron = weights[layer].map(row => row[neuronIndex]);
    //                 const activation = calculateActivation(weightsForNeuron, V[layer]);
    //                 V[layer + 1].push(layer === weights.length - 1 ? activation : sigmoid(activation));
    //             }
    //         }

    //         newPredictions.push(V[V.length - 1][0]);
    //         V = [[newPredictions[newPredictions.length - 1], datas[p + 2]], [], []];

    //         for (let layer = 0; layer < weights.length; layer++) {
    //             for (let neuronIndex = 0; neuronIndex < weights[layer][0].length; neuronIndex++) {
    //                 const weightsForNeuron = weights[layer].map(row => row[neuronIndex]);
    //                 const activation = calculateActivation(weightsForNeuron, V[layer]);
    //                 V[layer + 1].push(layer === weights.length - 1 ? activation : sigmoid(activation));
    //             }
    //         }

    //         newPredictions.push(V[V.length - 1][0]);
    //         V = [[newPredictions[newPredictions.length - 2], newPredictions[newPredictions.length - 1]], [], []];

    //         for (let layer = 0; layer < weights.length; layer++) {
    //             for (let neuronIndex = 0; neuronIndex < weights[layer][0].length; neuronIndex++) {
    //                 const weightsForNeuron = weights[layer].map(row => row[neuronIndex]);
    //                 const activation = calculateActivation(weightsForNeuron, V[layer]);
    //                 V[layer + 1].push(layer === weights.length - 1 ? activation : sigmoid(activation));
    //             }
    //         }

    //         newPredictions.push(V[V.length - 1][0]);
    //     }

    //     setPredictions3Step(newPredictions);
    // };

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate1}>One Step Prediction</button>
                {/* <button onClick={propagate3}>Three Step Prediction</button> */}
            </div>

            {predictions1Step.length > 0 && (
                <div>
                    <h2>Prédiction à un pas en avant:</h2>
                    <ul>
                        {predictions1Step.map((prediction, index) => (
                            <li key={index}>{`u(${index + 1}): ${prediction}`}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* {predictions3Step.length > 0 && (
                <div>
                    <h2>Prédiction à trois pas en avant:</h2>
                    <ul>
                        {predictions3Step.map((prediction, index) => (
                            <li key={index}>{`u(${index + 1}): ${prediction}`}</li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
}

export default OneStepPrediction;
