import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function OneStepAhead({ data, w }) {
    const tenDatas = data.slice(100, 115);
    
    const sigmoid = (x) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

    const calculateActivation = (weights, inputs) => {
        return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
    };

    const [predictions1Step, setPredictions1Step] = useState([]);

    const propagate1 = () => {
        const numPrototypes = tenDatas.length - 5;
        const newPredictions = [];

        for (let p = 0; p < numPrototypes; p++) {
            const initialInputs = tenDatas.slice(p, p + 5);
            const V = [initialInputs, [], []];

            for (let layer = 0; layer < w.length; layer++) {
                for (let neuronIndex = 0; neuronIndex < w[layer][0].length; neuronIndex++) {
                    const wForNeuron = w[layer].map(row => row[neuronIndex]);
                    const activation = calculateActivation(wForNeuron, V[layer]);
                    V[layer + 1].push(layer === w.length - 1 ? activation : sigmoid(activation));
                }
            }

            newPredictions.push(V[V.length - 1][0]); // Ajouter la valeur prédite
        }

        setPredictions1Step(newPredictions);
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }, 100);
    };

    const chartData = {
        labels: Array.from({ length: tenDatas.slice(5).length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Valeurs prédites',
                data: predictions1Step,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'Valeurs existantes',
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
