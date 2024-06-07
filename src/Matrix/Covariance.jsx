import React, { useState, useEffect } from 'react';
import { eigs } from 'mathjs';
import '../App.css';
import { multiplyMatrix, transposeMatrix } from './matrixOperation';



const Covariance = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [resultMatrix, setResultMatrix] = useState(null);
  const [eigenValues, setEigenValues] = useState(null);
  const [eigShowed, setEigShowed] = useState(false);

  useEffect(() => {
    const calculateCovariance = async () => {

      const matrixX = [data];
      const matrixXt = transposeMatrix(matrixX);
      const resultMatrix = multiplyMatrix(matrixXt, matrixX);
      setResultMatrix(resultMatrix);
      setLoading(false);
    };

    calculateCovariance();
  }, [data]);

  const eigenValue_calculator = () => {
    setEigShowed(true)
    if (resultMatrix) {
      const { values } = eigs(resultMatrix);
      setEigenValues(values.toFixed(2));

    }
    console.log("eig cal");
  };

  if (loading) {
    return (
      <div>
          <div>En cours de traitement ...</div>
          <div>Le calcul et l'affichage du matrice XtX peut prendredu temps</div>
      </div>
    );
  }

  return (
    <div>
      <h1>X<sup>t</sup> X</h1>
      <button type="button" onClick={eigenValue_calculator}>Calculer les valeurs propres</button>
      {/* {!eigShowed && <button type="button" onClick={toErrorCalculator}>Calcul d'erreur</button>} */}
      {!eigShowed && <table cellPadding="5">
        <tbody>
          {resultMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>}
      {eigenValues && (
        <div>
          <h2>Valeurs Propres :</h2>
          <ul>
            {eigenValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Covariance;