import React, { useState, useEffect } from 'react';
import '../App.css';
import { Chart } from 'react-chartjs-2';
import { eigs } from 'mathjs';


const Covariance = ({data}) => {
  const [covMatrix, setCovMatrix] = useState([]);
  const [errorData, setErrorData] = useState([]);

  const m = 3; // Dimension d'incorporation
const t = 100; // Délai de mesure

// Fonction pour construire les séquences x^(i)
const buildSequence = (index) => {
  const sequence = [];
  for (let j = 0; j < m; j++) {
    const dataIndex = index + j * t;
    if (dataIndex < data.length) {
      sequence.push(data[dataIndex]);
    } else {
      break; // Sortir si l'index dépasse la longueur des données
    }
  }
  return sequence;
};

// Construire toutes les séquences x^(i)
const buildAllSequences = () => {
  const sequences = [];
  for (let i = 0; i <= data.length - (m - 1) * t; i++) {
    const sequence = buildSequence(i);
    if (sequence.length === m) {
      sequences.push(sequence);
    }
  }
  return sequences;
};

// Fonction pour calculer la matrice de covariance
const covarianceMatrix = (matrix) => {
  const numCols = matrix[0].length;
  const numRows = matrix.length;
  const means = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]).reduce((sum, val) => sum + val, 0) / numRows);
  const centeredMatrix = matrix.map(row => row.map((val, colIndex) => val - means[colIndex]));
  const transposeMatrix = math.transpose(centeredMatrix);
  const covMatrix = math.multiply(transposeMatrix, centeredMatrix).map(row => row.map(val => val / (numRows - 1)));
  return covMatrix;
};


  useEffect(() => {
    const sequences = buildAllSequences();
    const covMat = covarianceMatrix(sequences);

    // Calculer les valeurs propres de la matrice de covariance
    const { values } = eigs(covMat);

    // Trier les valeurs propres par ordre décroissant
    const sortedEigenvalues = values.sort((a, b) => b - a);

    // Calculer les erreurs d'approximation moyenne El
    const errors = sortedEigenvalues.map((value, index) => ({
      l: index,
      El: Math.sqrt(value)
    }));

    // Stocker les données d'erreur pour l'affichage du graphique
    setErrorData(errors);

    // Mettre à jour la matrice de covariance dans l'état
    setCovMatrix(covMat);
  }, []);

  // Préparer les données pour le graphique
  const chartData = {
    labels: errorData.map(entry => entry.l),
    datasets: [
      {
        label: 'Erreur d\'approximation moyenne (El)',
        data: errorData.map(entry => entry.El.toFixed(2)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
      },
    ],
  };

  return (
    <div className="App">
      <h1>Matrice de Covariance</h1>
      <table>
        <tbody>
          {covMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => (
                <td key={colIndex}>{value.toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Erreur d'approximation moyenne (El)</h1>
      <div className="chart-container">
        <Chart type="line" data={chartData} />
      </div>
    </div>
  );
};

export default Covariance;
