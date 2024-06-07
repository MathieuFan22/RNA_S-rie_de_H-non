export const transposeMatrix = matrix => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };
  
  export const multiplyMatrix = (matrixA, matrixB) => {
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
  