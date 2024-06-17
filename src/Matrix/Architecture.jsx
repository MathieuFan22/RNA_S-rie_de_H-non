// Covariance.js
import React, { useState, useEffect } from 'react';
import { eigs } from 'mathjs';
import '../App.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { covarianceMatrix } from './matrixOperation';
import WeightUpdate from '../Prédiction/WeightUpdate';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Architecture = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [sequences, setSequences] = useState([]);
  const [covMatrix, setCovMatrix] = useState([]);
  const [errorsData, setErrorsData] = useState(null);
  const [errorShowed, setErrorShowed] = useState(false);
  const [significantDiffIndex, setSignificantDiffIndex] = useState(null);
  const [showHiddenUnits, setshowHiddenUnits] = useState(false);

  const m = 9; // Dimension d'incorporation
  const t = 1; // Délai de mesure

  const buildSequence = (index) => {
    const sequence = [];
    for (let j = 0; j < m; j++) {
      const dataIndex = index + j * t;
      if (dataIndex < data.length) {
        sequence.push(data[dataIndex]);
      } else {
        break;
      }
    }
    return sequence;
  };

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

  useEffect(() => {
    const calculateCovariance = async () => {
      const seq = buildAllSequences();
      setSequences(seq);
      const covMat = covarianceMatrix(seq);
      setCovMatrix(covMat);
      setLoading(false);
    };

    calculateCovariance();
  }, [data]);

  const coor = errorsData ? errorsData.map((_, index) => index) : [];
  const backgroundColors = [];
  const borderColors = [];
  const labelColors = [];
  const pointSize = [];

  const errors_calculator = () => {
    setErrorShowed(true);
    if (covMatrix) {
      const { values } = eigs(covMatrix);
      const roundedValues = values
        .map(e => e ** 0.5)
        .map(e => Number(e.toFixed(5)))
        .sort((a, b) => b - a);
      setErrorsData(roundedValues);

      for (let i = 0; i < roundedValues.length - 1; i++) {
        const diff = roundedValues[i] - roundedValues[i + 1];
        if (diff < 0.005 && diff > -0.005) {
          console.log(diff, i);
          setSignificantDiffIndex(i);
          break;
        }
      }
    }
  };

  if (errorsData) {
    for (let i = 0; i < errorsData.length - 1; i++) {
      const diff = errorsData[i] - errorsData[i + 1];
      if (diff > 0.005 || diff < -0.005) {
        backgroundColors.push('rgba(75,192,192,0.4)');
        borderColors.push('rgba(0,255,0,1)');
        pointSize.push(3);
        labelColors.push('rgba(255, 255, 255, 0.2)');
      } else {
        backgroundColors.push('rgb(0,255,0)');
        borderColors.push('rgb(0,255,0)');
        labelColors.push('green');
        pointSize.push(6);
      }
    }
    backgroundColors.push('rgba(75,192,192,0.4)');
    borderColors.push('rgba(75,192,192,1)');
  }

  const dataForChart = {
    labels: coor,
    datasets: [
      {
        label: 'Erreur = ',
        data: errorsData || [],
        fill: false,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(75,192,192,0.4)',
        pointRadius: pointSize
      },
    ],
  };

  const optionsForChart = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(220, 220, 220, 0.1)',
        },
        ticks: {
          color: labelColors,
        },
      },
      y: {
        grid: {
          color: 'rgba(220, 220, 220, 0.1)',
        },
      },
    },
  };

  const showHiddenUnitsGraph = () => {
    setshowHiddenUnits(true)
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100);
  }


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
      {!errorShowed && <h1>Matrice de covariance</h1>}
      {!errorShowed && <button type="button" onClick={errors_calculator}>Calculer les erreurs d'approximation moyenne</button>}
      {!errorShowed && (
        <table cellPadding="5">
          <tbody>
            {covMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {errorsData && errorShowed && (
        <div>
          <h2>Unités de couche d'entrée</h2>
          <Line data={dataForChart} options={optionsForChart} className='chartjs' />
          <h4>Le Nombre d'unités de la couche d'entrée est {significantDiffIndex} </h4>
          <div className='centred'>
            <button type="button" onClick={showHiddenUnitsGraph}>Nombre d'unités cachées</button>
          </div>
          {showHiddenUnits &&
            <div className="centred">
              <div className="line"></div>
              <h2>Unités de couche d'entrée</h2>
              <WeightUpdate data={data} p={significantDiffIndex} />
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default Architecture;


{/* <ul>
  {errorsData.map((value, index) => (
    <li key={index}>
      <span>[{index}] </span>
      {value}
    </li>
  ))}
</ul> */}