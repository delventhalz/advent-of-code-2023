const { greatest, least } = require('./math.js');

const count = (arr, match) => {
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

const filterMatrix = (matrix, filterFn) => {
  const filtered = [];

  eachMatrix(matrix, (item, coords) => {
    if (filterFn(item, coords, matrix)) {
      filtered.push(item);
    }
  });

  return filtered;
};

module.exports = {
  count,
  getIndexes,
  getGreatestIndex,
  getLeastIndex,
  shiftArray,
  shiftMatrix,
  fillMatrix,
  eachMatrix,
  mapMatrix,
  filterMatrix
}
