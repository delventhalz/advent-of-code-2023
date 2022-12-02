'use strict';

// --- Day 2 ---

// const {  } = require('lodash');
const { sum } = require('../lib');

const normalize = (me) => {
  if (me === 'X') return 'A';
  if (me === 'Y') return 'B';
  if (me === 'Z') return 'C';
}

const points = (me) => {
  if (me === 'A') return 1;
  if (me === 'B') return 2;
  if (me === 'C') return 3;
}

const score = ([a, b]) => {
  if (a === b) {
    return 3 + points(b);
  }

  const isLose = (
    (a === 'A' && b === 'C')
      || (a === 'B' && b === 'A')
      || (a === 'C' && b === 'B')
  )

  return points(b) + (isLose ? 0 : 6);
}

module.exports = (inputs) => {


  return sum(inputs
    .map(d => [d[0], normalize(d[2])])
    .map(d => score(d)));
};
