'use strict';

// --- Day 2 ---

// const {  } = require('lodash');
const { sum } = require('../lib');

const normalize = ([a, b]) => {
  if (b === 'X') {
    if (a === 'A') return ['A', 'C'];
    if (a === 'B') return ['B', 'A'];
    if (a === 'C') return ['C', 'B'];
  }
  if (b === 'Y') {
    return [a, a];
  }
  if (b === 'Z') {
    if (a === 'A') return ['A', 'B'];
    if (a === 'B') return ['B', 'C'];
    if (a === 'C') return ['C', 'A'];
  }
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
    .map(d => [d[0], d[2]])
    .map(normalize)
    .map(score));
};
