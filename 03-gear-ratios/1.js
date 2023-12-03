'use strict';

/**
 * --- Advent of Code 2023 ---
 *
 * Day 3: Gear Ratios
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/3
 */

const { eachMatrix, eachSurrounding, sum } = require('../lib');


const isDigit = char => /[0-9]/.test(char);
const isSymbol = char => char !== '.' && !isDigit(char);

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
  const schematic = inputs.map(line => line.split(''));
  const parts = [];

  eachMatrix(schematic, (char, coords) => {
    if (isSymbol(char)) {
      eachSurrounding(schematic, coords, (adj, adjCoords) => {
        if (isDigit(adj)) {
          parts.push(extractPartNumber(schematic, adjCoords));
        }
      });
    }
  });

  return sum(parts);
};

// Your puzzle answer was 526404.
