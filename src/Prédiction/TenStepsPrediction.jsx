import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function TenStepsAhead({ data, w }) {
    const tenDatas = data.slice(100, 115);

    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions10Step, setPredictions10Step] = useState([]);

    const propagate10 = () => {
        const numPrototypes = tenDatas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p++) {
            let initialInputs = tenDatas.slice(p, p + 5);
            const V = [initialInputs, [], []];

            let predictedValues = [];

            for (let step = 0; step < 10; step++) {
                for (let layer = 0; layer < w.length; layer++) {
                    for (let neuronIndex = 0; neuronIndex < w[layer][0].length; neuronIndex++) {
                        const wForNeuron = w[layer].map(row => row[neuronIndex]);
                        const activation = calculateActivation(wForNeuron, V[layer]);
                        V[layer + 1].push(layer === w.length - 1 ? activation : sigmoid(activation));
                    }
                }

                const predictedValue = V[V.length - 1][0];
                predictedValues.push(predictedValue);

                if (step < 9) { // Update the inputs for the next step
                    initialInputs = [predictedValue, ...initialInputs.slice(0, 4)];
                    V[0] = initialInputs;
                    V[1] = [];
                    V[2] = [];
                }
            }

            newPredictions.push(predictedValues[9]); // Push the tenth step prediction
        }

        setPredictions10Step(newPredictions);
    };

    const chartData = {
        labels: Array.from({ length: tenDatas.slice(5).length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Predictions',
                data: predictions10Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Actual Data',
                data: tenDatas.slice(5),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate10}>Ten Steps Prediction</button>
            </div>

            {predictions10Step.length > 0 && (
                <div>
                    <h2>Ten Steps Ahead Predictions:</h2>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
}

export default TenStepsAhead;
