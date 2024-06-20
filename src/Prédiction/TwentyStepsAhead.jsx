import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function TwentyStepsAhead({ data, w }) {
    const datas = data.slice(100, 150); 
    
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions20Step, setPredictions20Step] = useState([]);

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

    const chartData = {
        labels: Array.from({ length: datas.slice(40).length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Valeurs prédites',
                data: predictions20Step.slice(10),
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Valeurs existantes',
                data: datas.slice(20),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate20}>Prédiction à vingt pas en avant</button>
            </div>

            {predictions20Step.length > 0 && (
                <div>
                    <h2>Prédiction à vingt pas en avant:</h2>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
}

export default TwentyStepsAhead;
