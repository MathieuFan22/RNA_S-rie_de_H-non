import React, { useState, useEffect } from 'react';
import { eigs } from 'mathjs';
import '../App.css';
import { multiplyMatrix, transposeMatrix } from './matrixOperation';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);



const Covariance = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [resultMatrix, setResultMatrix] = useState(null);
  const [eigenValues, setEigenValues] = useState(null);
  const [eigShowed, setEigShowed] = useState(false);

  const transposeMatrix = matrix => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };
  
  const multiplyMatrix = (matrixA, matrixB) => {
    const result = Array(matrixA.length)
      .fill(0)
      .map(() => Array(matrixB[0].length).fill(0));
  
    for (let i = 0; i < matrixA.length; i++) {
      for (let j = 0; j < matrixB[0].length; j++) {
        for (let k = 0; k < matrixA[0].length; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
    return result;
  };

  const m = 10; // Dimension d'incorporation
  const t = 1; // Délai de mesure

  // Fonction pour construire les séquences x^(i)
  const buildSequence = (index) => {
    const sequence = [];
    for (let j = 0; j < m; j++) {
      sequence.push(data[index + j * t]);
    }
    return sequence;
  };

  useEffect(() => {
    const calculateCovariance = async () => {
      // Construire matrixX en utilisant buildSequence
      const matrixX = [];
      for (let i = 0; i < data.length - (m - 1) * t; i++) {
        matrixX.push(buildSequence(i));
      }

      const matrixXt = transposeMatrix(matrixX);
      const resultMatrix = multiplyMatrix(matrixX, matrixXt);
      setResultMatrix(resultMatrix);
      setLoading(false);
    };

    calculateCovariance();
  }, [data]);

  const eigenValue_calculator = () => {
    setEigShowed(true);
    if (resultMatrix) {
      const { values } = eigs(resultMatrix);
        const roundedValues = values
        .map(value => Number(value.toFixed(8)))
        .map(value => value ** (1/2))
        .filter(value => value !== 0)
        .sort((a, b) => b - a);
      setEigenValues(roundedValues);
    }
    co
    nsole.log("eig cal");
  };
  const dataForChart = {
    labels: eigenValues ? eigenValues.map((_, index) => `Value ${index + 1}`) : [],
    datasets: [
      {
        label: 'Eigenvalues',
        data: eigenValues || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const optionsForChart = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(220, 220, 220, 0.1)' 
        }
      },
      y: {
        grid: {
          color: 'rgba(220, 220, 220, 0.1)' 
        }
      }
    }
  };

  if (loading) {
    return (
      <div>
        <div>En cours de traitement ...</div>
        <div>Le calcul et l'affichage du matrice XtX peut prendre du temps</div>
      </div>
    );
  }

  return (
    <div>
      <h1>XX<sup>t</sup></h1>
      {!eigShowed && <button type="button" onClick={eigenValue_calculator}>Calculer les valeurs propres</button>}
      {!eigShowed && (
        <table cellPadding="5">
          <tbody>
            {resultMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {eigenValues && eigShowed && (
        <div>
          <Line data={dataForChart} options={optionsForChart} className="small-graph" />
          <div>
            <h2>Erreurs (√Valeurs propres) :</h2>
            <ul>
              {eigenValues.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Covariance;