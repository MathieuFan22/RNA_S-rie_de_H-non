I have this :
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

  useEffect(() => {
    const calculateCovariance = async () => {

      const matrixX = // the data returned by the buildsequence;
      const matrixXt = transposeMatrix(matrixX);
      const resultMatrix = multiplyMatrix(matrixX, matrixXt);
      setResultMatrix(resultMatrix);
      setLoading(false);
    };

    calculateCovariance();
  }, [data]);

  const eigenValue_calculator = () => {
    setEigShowed(true)
    if (resultMatrix) {
      const { values } = eigs(resultMatrix);
      setEigenValues(values);

    }
    console.log("eig cal");
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

The data from the parameter should be use in the buildSequence and the return of the buildSequence should be the matrixX
const m = 3; // Dimension d'incorporation
const t = 100; // Délai de mesure

// Fonction pour construire les séquences x^(i)
const buildSequence = (index) => {
    const sequence = [];
    for (let j = 0; j < m; j++) {
        sequence.push(data[index + j * t]);
    }
    return sequence;
};

SO change all the code to make it work