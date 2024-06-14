import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { create, all } from 'mathjs';

// Configuration de mathjs
const math = create(all);

// Fonction pour calculer la covariance
const covariance = (matrix) => {
  const n = matrix.length;
  const m = matrix[0].length;

  // Calculer la moyenne de chaque colonne
  const mean = Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      mean[j] += matrix[i][j];
    }
  }
  for (let j = 0; j < m; j++) {
    mean[j] /= n;
  }

  // Centrer les données
  const centered = matrix.map(row => row.map((val, i) => val - mean[i]));

  // Calculer la matrice de covariance
  const covMatrix = Array(m).fill(null).map(() => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += centered[k][i] * centered[k][j];
      }
      const covValue = sum / (n - 1);
      covMatrix[i][j] = covValue;
      covMatrix[j][i] = covValue; // Matrice symétrique
    }
  }

  return covMatrix;
};

const HenonMap = ({ a, b, x0, y0, n }) => {
  const [errors, setErrors] = useState([]);
  const [eigenValues, setEigenValues] = useState([]);
  const [eigShowed, setEigShowed] = useState(false);

  useEffect(() => {
    // Génération de la série de Hénon
    const henonMap = (a, b, x0, y0, n) => {
      const x = Array(n).fill(0);
      const y = Array(n).fill(0);
      x[0] = x0;
      y[0] = y0;
      for (let i = 1; i < n; i++) {
        x[i] = 1 - a * x[i - 1] ** 2 + y[i - 1];
        y[i] = b * x[i - 1];
      }
      return x;
    };

    // Générer la série
    const u = henonMap(a, b, x0, y0, n);

    // Construire la matrice des séquences
    const t = 1;
    const n_t = 15;
    const m = n - n_t * t;

    const X = [];
    for (let i = 0; i < m; i++) {
      X.push(u.slice(i, i + (n_t + 1) * t).filter((_, index) => index % t === 0));
    }

    // Calculer la matrice de covariance
    const covMatrix = covariance(X);

    // Calculer les valeurs propres et les trier par ordre décroissant
    const eigenvalues = math.eigs(covMatrix).values;
    eigenvalues.sort((a, b) => b - a);

    // Formater les valeurs propres à 8 chiffres après la virgule
    const formattedEigenvalues = eigenvalues.map(value => Number(value.toFixed(8)));

    // Calculer les erreurs E_l = sqrt(lambda_(l+1))
    const errors = formattedEigenvalues.slice(1).map(eigenvalue => Math.sqrt(eigenvalue));
    setErrors(errors);
    setEigenValues(formattedEigenvalues);
  }, [a, b, x0, y0, n]);

  // Fonction pour afficher les valeurs propres
  const showEigenvalues = () => {
    setEigShowed(true);
  };

  // Préparer les données pour le graphique
  const data = {
    labels: errors.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Erreurs $E_l$',
        data: errors,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Erreurs $$</h2>
      <Line className='chartjs'  data={data} />
      <button onClick={showEigenvalues}>Afficher valeurs propres</button>
      {eigShowed && (
        <div>
          <h3>Valeurs propres :</h3>
          <ul>
            {eigenValues.map((value, index) => (
              <li key={index}>
                <span>[{index}] </span>
                {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HenonMap;
