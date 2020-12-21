const { greatest, least } = require('./math.js');

const count = (arr, match = Boolean) => {
  const matchFn = typeof match === 'function'
    ? match
    : (item => item === match);


  return arr.filter(matchFn).length;
};

const getIndexes = (arr) => Object.keys(arr).map(Number);
const getGreatestIndex = (arr) => greatest(getIndexes(arr));
const getLeastIndex = (arr) => least(getIndexes(arr));

const shiftArray = (negativeArray, amount = null) => {
  if (amount === null) {
    const leastIndex = getLeastIndex(negativeArray);
    if (leastIndex >= 0) {
      return negativeArray;
    }

    amount = -leastIndex;
  }

  const shifted = [];
  for (const [i, val] of Object.entries(negativeArray)) {
    shifted[Number(i) + amount] = val;
  }

  return shifted;
};

const shiftMatrix = (negativeMatrix) => {
  const shifted = shiftArray(negativeMatrix);
  const leastXIndex = least(shifted.map(getLeastIndex));
  return shifted.map(row => shiftArray(row, -leastXIndex));
};

const fillMatrix = (sparseMatrix) => {
  const filled = [];
  const greatestXIndex = greatest(sparseMatrix.map(getGreatestIndex));

  for (let y = 0; y < sparseMatrix.length; y++) {
    filled[y] = [];

    for (let x = 0; x <= greatestXIndex; x++) {
      filled[y][x] = sparseMatrix[y][x];
    }
  }

  return filled;
};

const coordsOf = (matrix, item) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === item) {
        return [x, y];
      }
    }
  }

  return [-1, -1];
};

const eachMatrix = (matrix, eachFn) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      eachFn(matrix[y][x], [x, y], matrix);
    }
  }
};

const mapMatrix = (matrix, mapFn) => {
  const mapped = [];

  for (let y = 0; y < matrix.length; y++) {
    mapped[y] = [];

    for (let x = 0; x < matrix[y].length; x++) {
      mapped[y][x] = mapFn(matrix[y][x], [x, y], matrix);
    }
  }

  return mapped;
};

const rotateMatrix = (matrix) => {
  const width = matrix[0].length;
  const rotated = matrix[0].map(() => []);

  eachMatrix(matrix, (item, [x, y]) => {
    rotated[x][width - y - 1] = item;
  });

  return rotated;
};

const flipMatrix = (matrix) => {
  const width = matrix[0].length;
  const flipped = matrix[0].map(() => []);

  eachMatrix(matrix, (item, [x, y]) => {
    flipped[y][width - x - 1] = item;
  });

  return flipped;
};

const matrixToString = (matrix) => matrix
  .map(row => row.join(''))
  .join('\n');


module.exports = {
  count,
  getIndexes,
  getGreatestIndex,
  getLeastIndex,
  shiftArray,
  shiftMatrix,
  fillMatrix,
  coordsOf,
  eachMatrix,
  mapMatrix,
  rotateMatrix,
  flipMatrix,
  matrixToString
};
