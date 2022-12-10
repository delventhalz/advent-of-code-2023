'use strict';

// --- Day 10 ---

// const {  } = require('lodash');
// const {  } = require('../lib');

const CYCLES = [20, 60, 100, 140, 180, 220];

module.exports = (inputs) => {
  let x = 1;
  let sum = 0;
  let cycle = 1;

  for (const command of inputs) {
    cycle += 1;
    console.log(cycle, x);
    if (CYCLES.includes(cycle)) {
      sum += cycle * x;
    }

    if (command.startsWith('addx')) {
      const [_, amount] = command.split(' ');
      x += Number(amount);

      cycle += 1;
    console.log(cycle, x);
      if (CYCLES.includes(cycle)) {
        sum += cycle * x;
      }
    }
  }

  return sum;
};
