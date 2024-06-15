import React, { useState, useEffect } from 'react';

// Fonction pour préparer les données
const prepareData = (data, windowSize) => {
    let features = [];
    let targets = [];
    for (let i = 0; i < data.length - windowSize; i++) {
        features.push(data.slice(i, i + windowSize));
        targets.push(data[i + windowSize]);
    }
    return { features, targets };
};

// Classe pour le réseau de neurones
class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;

        // Initialisation des poids
        this.weights1 = this.initializeWeights(inputSize, hiddenSize);
        this.weights2 = this.initializeWeights(hiddenSize, outputSize);
    }

    initializeWeights(inputSize, outputSize) {
        let weights = [];
        for (let i = 0; i < inputSize; i++) {
            let row = [];
            for (let j = 0; j < outputSize; j++) {
                row.push(Math.random() * 2 - 1); // Poids aléatoires entre -1 et 1
            }
            weights.push(row);
        }
        return weights;
    }

    // Fonction d'activation (sigmoïde)
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Dérivée de la fonction sigmoïde
    sigmoidDerivative(x) {
        return x * (1 - x);
    }

    // Propagation avant
    forward(input) {
        this.input = input;
        this.hidden = this.sigmoid(this.dot(input, this.weights1));
        this.output = this.sigmoid(this.dot(this.hidden, this.weights2));
        return this.output;
    }

    // Rétropropagation
    backward(target) {
        let outputError = target - this.output;
        let outputDelta = outputError * this.sigmoidDerivative(this.output);

        let hiddenError = this.dot(outputDelta, this.transpose(this.weights2));
        let hiddenDelta = hiddenError * this.sigmoidDerivative(this.hidden);

        // Mise à jour des poids
        this.weights2 = this.add(this.weights2, this.outer(this.hidden, outputDelta));
        this.weights1 = this.add(this.weights1, this.outer(this.input, hiddenDelta));
    }

    // Fonction d'entraînement
    train(features, targets, epochs = 10000, learningRate = 0.1) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            let error = 0;
            for (let i = 0; i < features.length; i++) {
                let output = this.forward(features[i]);
                this.backward(targets[i]);
                error += Math.pow(targets[i] - output, 2);
            }
            if (epoch % 1000 === 0) {
                console.log(`Epoch ${epoch} Error: ${error / features.length}`);
            }
        }
    }

    // Fonction d'addition de matrices
    add(a, b) {
        return a.map((row, i) => row.map((val, j) => val + b[i][j]));
    }

    // Produit scalaire
    dot(a, b) {
        let result = [];
        for (let i = 0; i < a.length; i++) {
            let sum = 0;
            for (let j = 0; j < b.length; j++) {
                sum += a[i][j] * b[j];
            }
            result.push(sum);
        }
        return result;
    }

    // Transposée de matrice
    transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    // Produit extérieur
    outer(a, b) {
        let result = [];
        for (let i = 0; i < a.length; i++) {
            let row = [];
            for (let j = 0; j < b.length; j++) {
                row.push(a[i] * b[j]);
            }
            result.push(row);
        }
        return result;
    }
}

const NeuralNetworkPredictor = ({ data }) => {
    const [trained, setTrained] = useState(false);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        const runNeuralNetwork = async () => {
            const windowSize = 5; // Taille de la fenêtre d'entrée
            const { features, targets } = prepareData(data, windowSize);

            const inputSize = windowSize; // Taille de l'entrée
            const hiddenSize = 4; // Taille de la couche cachée
            const outputSize = 1; // Taille de la sortie

            let nn = new NeuralNetwork(inputSize, hiddenSize, outputSize);
            nn.train(features, targets);

            // Prédiction avec le dernier ensemble de données
            const lastInput = features[features.length - 1];
            const prediction = nn.forward(lastInput);

            setPrediction(prediction);
            setTrained(true);
        };

        runNeuralNetwork();
    }, [data]);

    return (
        <div>
            {trained ? (
                <p>Prédiction de la prochaine valeur : {prediction.toFixed(6)}</p>
            ) : (
                <p>Entraînement du réseau de neurones en cours...</p>
            )}
        </div>
    );
};

export default NeuralNetworkPredictor;
