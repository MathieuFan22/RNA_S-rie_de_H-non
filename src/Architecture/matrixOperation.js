

export const transposeMatrix = matrix => {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

export const meanMatrix = matrix => {
  const mean = Array(matrix[0].length).fill(0);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      mean[j] += matrix[i][j];
    }
  }
  return mean.map(m => m / matrix.length);
};

export const variance = (vector, mean) => {
  return vector.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (vector.length - 1);
};

export const covariance = (vectorX, meanX, vectorY, meanY) => {
  return vectorX.reduce((acc, val, i) => acc + (val - meanX) * (vectorY[i] - meanY), 0) / (vectorX.length - 1);
};

export const covarianceMatrix = matrix => {
  const mean = meanMatrix(matrix);
  const n = matrix[0].length;
  const covMatrix = Array(n).fill(0).map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        covMatrix[i][j] = variance(matrix.map(row => row[i]), mean[i]);
      } else {
        covMatrix[i][j] = covariance(matrix.map(row => row[i]), mean[i], matrix.map(row => row[j]), mean[j]);
      }
    }
  }
  return covMatrix;
};

