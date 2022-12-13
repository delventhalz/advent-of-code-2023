'use strict';

// --- Day 13 ---

const { chunk } = require('lodash');
const { sum } = require('../lib');
const inputs = require('./input.json');

const isInOrder = (left, right) => {
  if (left === undefined) {
    return -1;
  }
  if (right === undefined) {
    return 1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    if (left === right) {
      return 0;
    }
    return left < right ? -1 : 1;
  }

  if (typeof left === 'number') {
    left = [left];
  }
  if (typeof right === 'number') {
    right = [right];
  }

  const limit = Math.max(left.length, right.length);

  for (let i = 0; i < limit; i += 1) {
    const result = isInOrder(left[i], right[i]);

    if (result !== 0) {
      return result;
    }
  }

  return 0;
}

module.exports = () => {
  const orderedIndexes = [];

  chunk(inputs, 2).forEach(([left, right], i) => {
    const result = isInOrder(left, right);

    if (result < 0) {
      orderedIndexes.push(i + 1);
    }
  })

  return sum(orderedIndexes);
};
