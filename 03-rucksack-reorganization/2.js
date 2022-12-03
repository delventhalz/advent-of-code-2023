'use strict';

// --- Part Two ---

const { chunk } = require('lodash');
const { sum } = require('../lib');


const item = ([first, second, third]) => third.split('').find(c => first.includes(c) && second.includes(c));

const point = char => {
  const code = char.charCodeAt(0)
  if (code < 91) {
    return code - 38;
  }
  return code - 96;
}

module.exports = (inputs) => {

  return sum(chunk(inputs, 3).map(item).map(point));
};
