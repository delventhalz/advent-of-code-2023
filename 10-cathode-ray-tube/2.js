'use strict';

// --- Part Two ---

const { chunk } = require('lodash');
const { matrixToString } = require('../lib');

module.exports = (inputs) => {
  let x = 1;
  let cycle = 0;

  const pixels = [];

  if (Math.abs(cycle - x) < 2) {
    pixels.push('#');
  } else {
    pixels.push('.');
  }

  for (const command of inputs) {
    cycle = (cycle + 1) % 40;
    if (Math.abs(cycle - x) < 2) {
      pixels.push('#');
    } else {
      pixels.push('.');
    }

    if (command.startsWith('addx')) {
      const [_, amount] = command.split(' ');
      x += Number(amount);

      cycle = (cycle + 1) % 40;
      if (Math.abs(cycle - x) < 2) {
        pixels.push('#');
      } else {
        pixels.push('.');
      }
    }
  }

  const display = chunk(pixels, 40);

  return matrixToString(display);
};
