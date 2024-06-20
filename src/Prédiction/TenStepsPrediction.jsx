import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function TenStepsAhead({ data, w }) {
    const datas = data.slice(100, 140);  
    
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions10Step, setPredictions10Step] = useState([]);

    const propagate10 = () => {
        const numPrototypes = datas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p++) {
            let prototypes = [[datas.slice(p, p + 5), ...Array(9).fill([])]];
            let currentPredictions = [];

            for (let step = 0; step < 10; step++) {
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

                if (step < 9) {
                    prototypes.push([[], ...Array(9).fill([])]);
                    prototypes[step + 1][0] = [predictedValue, ...prototypes[step][0].slice(0, 4)];
                }
            }

            newPredictions.push(...currentPredictions);
        }

        setPredictions10Step(newPredictions.slice(1, 11)); 
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }, 100);
    };

    const chartData = {
        labels: Array.from({ length: 10 }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Valeurs prédites',
                data: predictions10Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Valeurs existantes',
                data: datas.slice(10, 20), 
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className='centred'>
                <button onClick={propagate10}>Prédiction à dix pas en avant</button>
            </div>

            {predictions10Step.length > 0 && (
                <div>
                    <h2>Prédiction à dix pas en avant:</h2>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
}

export default TenStepsAhead;
