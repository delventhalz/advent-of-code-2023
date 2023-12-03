'use strict';

/**
 * --- Advent of Code 2023 ---
 *
 * Day 1: Trebuchet?!
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/1
 */

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

// Your puzzle answer was 53334.
