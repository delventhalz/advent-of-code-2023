'use strict';

// --- Day 1 ---

// const {  } = require('lodash');
const { parseIfNumber, sum } = require('../lib');


module.exports = (_, rawInputs) => {
  const numbers = rawInputs
    .split('\n')
    .map(input => [
      input.split('').find(n => typeof parseIfNumber(n) === 'number'),
      input.split('').reverse().find(n => typeof parseIfNumber(n) === 'number'),
    ].join(''))
    .map(Number);

  return sum(numbers);
};
