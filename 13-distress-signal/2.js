'use strict';

// --- Part Two ---

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
  const packets = [[[2]], [[6]], ...inputs].sort(isInOrder);

  const startIndex = packets.findIndex(packet => JSON.stringify(packet) === '[[2]]') + 1;
  const endIndex = packets.findIndex(packet => JSON.stringify(packet) === '[[6]]') + 1;

  return startIndex * endIndex;
};
