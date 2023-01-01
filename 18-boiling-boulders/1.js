'use strict';

// --- Day 18 ---

// const {  } = require('lodash');
const { count, sum } = require('../lib');

const isAdjacent = ([x1, y1, z1], [x2, y2, z2]) => {
  if (Math.abs(x2 - x1) === 1 && y1 === y2 && z1 === z2) {
    return true;
  }

  if (x1 === x2 && Math.abs(y2 - y1) === 1 && z1 === z2) {
    return true;
  }

  if (x1 === x2 && y1 === y2 && Math.abs(z2 - z1) === 1) {
    return true;
  }

  return false;
};

module.exports = (inputs) => {
  const surfaceAreas = inputs.map((dropA) => {
    return 6 - count(inputs, dropB => isAdjacent(dropA, dropB));
  });

  return sum(surfaceAreas);
};
