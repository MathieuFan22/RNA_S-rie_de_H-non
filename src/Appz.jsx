// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

const step = 0.1;
const epochs = 1000; // Number of iterations for training

const getRandomWeight = (min, max) => Math.random() * (max - min) + min;

const initializeWeights = (layers) => {
  const weights = [];
  for (let i = 0; i < layers.length - 1; i++) {
    const layerWeights = [];
    for (let j = 0; j < layers[i]; j++) {
      const neuronWeights = [];
      for (let k = 0; k < layers[i + 1]; k++) {
        neuronWeights.push(Number(getRandomWeight(0.5, 0.99).toFixed(2)));
      }
      layerWeights.push(neuronWeights);
    }
    weights.push(layerWeights);
  }
  return weights;
};

const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = (x) => sigmoid(x) * (1 - sigmoid(x));

const calculateActivation = (weights, inputs) => {
  return weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
};

const forwardPropagation = (weights, inputs) => {
  const activations = [inputs];
  const preActivations = [];

  for (let layer = 0; layer < weights.length; layer++) {
    const currentInputs = activations[activations.length - 1];
    const preActivation = weights[layer].map(neuronWeights => calculateActivation(neuronWeights, currentInputs));
    const activation = preActivation.map(sigmoid);

    preActivations.push(preActivation);
    activations.push(activation);

    // Debugging logs
    console.log(`Layer ${layer + 1} preActivations:`, preActivation);
    console.log(`Layer ${layer + 1} activations:`, activation);
  }

  return { activations, preActivations };
};

const calculateOutputLayerDelta = (output, desiredOutput, preActivations) => {
  return output.map((o, i) => {
    const delta = sigmoidDerivative(preActivations[i]) * (desiredOutput[i] - o);
    if (isNaN(delta)) {
      console.error(`NaN delta found in output layer. Output: ${o}, Desired: ${desiredOutput[i]}, PreActivation: ${preActivations[i]}`);
    }
    return delta;
  });
};

const calculateHiddenLayerDelta = (deltas, weights, preActivations) => {
  return preActivations.map((preAct, i) => {
    const error = deltas.reduce((sum, delta, j) => sum + delta * weights[j][i], 0);
    const delta = sigmoidDerivative(preAct) * error;
    if (isNaN(delta)) {
      console.error(`NaN delta found in hidden layer. Error: ${error}, PreActivation: ${preAct}`);
    }
    return delta;
  });
};

const updateWeights = (weights, activations, deltas) => {
  for (let layer = 0; layer < weights.length; layer++) {
    const layerActivations = activations[layer];
    const layerDeltas = deltas[layer];

    for (let neuron = 0; neuron < weights[layer].length; neuron++) {
      for (let weightIndex = 0; weightIndex < weights[layer][neuron].length; weightIndex++) {
        weights[layer][neuron][weightIndex] += step * layerDeltas[neuron] * layerActivations[weightIndex];
      }
    }
  }
};

const calculateXY = (initialX, initialY, iterations) => {
  let xValues = [initialX];
  let yValues = [initialY];
  const a = 1.4;
  const b = 0.3;

  for (let n = 0; n < iterations; n++) {
    let xNext = yValues[n] + 1 - a * xValues[n] ** 2;
    let yNext = b * xValues[n];

    xValues.push(parseFloat(xNext.toFixed(8)));
    yValues.push(parseFloat(yNext.toFixed(8)));
  }

  return { xValues, yValues };
};

const App = () => {
  const [data, setData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [weights, setWeights] = useState(initializeWeights([5, 4, 1]));
  const [isTrained, setIsTrained] = useState(false);

  useEffect(() => {
    const { xValues } = calculateXY(0, 0, 500);
    setData(xValues.slice(1));
  }, []);

  const trainNetwork = () => {
    const prototypes = [];
    const desiredOutputs = [];

    for (let i = 0; i < data.length - 5; i++) {
      prototypes.push(data.slice(i, i + 5));
      desiredOutputs.push([data[i + 5]]);
    }

    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < prototypes.length; i++) {
        const { activations, preActivations } = forwardPropagation(weights, prototypes[i]);
        const output = activations[activations.length - 1];

        const outputDelta = calculateOutputLayerDelta(output, desiredOutputs[i], preActivations[preActivations.length - 1]);
        const hiddenDelta = calculateHiddenLayerDelta(outputDelta, weights[weights.length - 1], preActivations[preActivations.length - 2]);

        updateWeights(weights, activations, [hiddenDelta, outputDelta]);
      }
    }

    setWeights(weights);
    setIsTrained(true); // Mark training as complete
  };

  const predictNextValues = () => {
    let currentInput = data.slice(data.length - 5);
    const nextPredictions = [];

    for (let i = 0; i < 10; i++) {
      const { activations } = forwardPropagation(weights, currentInput);
      const nextValue = activations[activations.length - 1][0];

      if (isNaN(nextValue)) {
        console.error("Predicted value is NaN. Stopping prediction.");
        break;
      }

      nextPredictions.push(nextValue);
      currentInput = [...currentInput.slice(1), nextValue];
    }

    setPredictions(nextPredictions);
  };

  return (
    <div className="App">
      <h1>Prédiction de la Série de Hénon</h1>
      <button onClick={trainNetwork}>Entraîner le réseau</button>
      {isTrained && <button onClick={predictNextValues}>Prédire les prochaines valeurs</button>}
      <h2>Prédictions :</h2>
      <ul>
        {predictions.map((pred, index) => (
          <li key={index}>{pred.toFixed(8)}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
