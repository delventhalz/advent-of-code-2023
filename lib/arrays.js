const { least } = require('./math.js');

const count = (arr, match) => {
  const matchFn = typeof match === 'function'
    ? match
    : (item => item === match);


  return arr.filter(matchFn).length;
};

const getLeastIndex = (arr) => least(Object.keys(arr).map(Number));

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

  for (let y = 0; y < sparseMatrix.length; y++) {
    filled[y] = [];
    const currentRow = sparseMatrix[y];
    if (!currentRow) continue;

    for (let x = 0; x < currentRow.length; x++) {
      filled[y][x] = currentRow[x];
    }
  }

  return filled;
};


module.exports = {
  count,
  getLeastIndex,
  shiftArray,
  shiftMatrix,
  fillMatrix
}
