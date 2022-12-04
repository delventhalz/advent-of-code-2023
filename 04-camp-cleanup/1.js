'use strict';

// --- Day 4 ---

// const {  } = require('lodash');
const { between, count } = require('../lib');


module.exports = (inputs) => {
  const pairs = inputs.map(pair => pair.map(elf => elf.split('-').map(Number)));

  return count(pairs, ([a, b]) => {
    if (between(a[0], b[0], b[1] + 1) && between(a[1], b[0], b[1] + 1)) {
      return true;
    }

    if (between(b[0], a[0], a[1] + 1) && between(b[1], a[0], a[1] + 1)) {
      return true;
    }

    return false
  });
};
