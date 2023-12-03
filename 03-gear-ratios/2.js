'use strict';

/**
 * --- Advent of Code 2023 ---
 *
 * Day 3: Gear Ratios
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/3#part2
 */

const { eachMatrix, eachSurrounding, sum } = require('../lib');

const isDigit = char => /[0-9]/.test(char);
const isGear = char => char === '*';

const extractPartNumber = (schematics, [x, y]) => {
  let number = '';
  let pos = x;

  while (isDigit(schematics[y][pos])) {
    pos -= 1;
  }

  // pos will end up one too small
  pos += 1;

  while (isDigit(schematics[y][pos])) {
    number += schematics[y][pos];
    schematics[y][pos] = 'X'; // Prevent counting numbers twice
    pos += 1;
  }

  return Number(number);
};

module.exports = (inputs) => {
  const schematics = inputs.map(line => line.split(''));
  const ratios = [];

  eachMatrix(schematics, (char, coords) => {
    if (isGear(char)) {
      const parts = [];

      eachSurrounding(schematics, coords, (adj, adjCoords) => {
        if (isDigit(adj)) {
          parts.push(extractPartNumber(schematics, adjCoords));
        }
      });

      if (parts.length === 2) {
        ratios.push(parts[0] * parts[1]);
      }
    }
  });

  return sum(ratios);
};

// Your puzzle answer was 84399773.
