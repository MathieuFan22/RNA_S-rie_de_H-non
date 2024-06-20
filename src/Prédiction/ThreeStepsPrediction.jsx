import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function ThreeStepsAhead({ data, w }) {
    const datas = data.slice(100, 120);
    
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions3Step, setPredictions3Step] = useState([]);

    const propagate3 = () => {
        const numPrototypes = datas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p += 3) {
            let prototypes = [[datas.slice(p, p + 5), [], []]];
            let currentPredictions = [];

            for (let step = 0; step < 3; step++) {
                const V = prototypes[step];
                for (let layer = 0; layer < w.length; layer++) {
                    for (let neuronIndex = 0; neuronIndex < w[layer][0].length; neuronIndex++) {
                        const wForNeuron = w[layer].map(row => row[neuronIndex]);
                        const activation = calculateActivation(wForNeuron, V[layer]);
                        V[layer + 1].push(layer === w.length - 1 ? activation : sigmoid(activation));
                    }temporelle
                }
                const predictedValue = V[V.length - 1][0];
                currentPredictions.push(predictedValue);

                if (step < 2) {
                    prototypes.push([[], [], []]);
                    prototypes[step + 1][0] = [predictedValue, ...prototypes[step][0].slice(0, 4)];
                }
            }

            newPredictions.push(...currentPredictions);
        }

        setPredictions3Step(newPredictions.slice(0, 10)); // Display only 10 predictions
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }, 100);
    };

    const chartData = {
        labels: Array.from({ length: datas.slice(9).length }, (_, i) => i + 1),
        datasets: [
            {
                label: '3-Step Predictions',
                data: predictions3Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Actual Data',
                data: datas.slice(9),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate3}>Prédiction à trois pas en avant</button>
            </div>

            {predictions3Step.length > 0 && (
                <div>
                    <h2>Prédiction à trois pas en avant:</h2>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
}

export default ThreeStepsAhead;
