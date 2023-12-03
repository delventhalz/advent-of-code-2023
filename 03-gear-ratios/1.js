/**
 * --- Advent of Code 2023 ---
 *
 * Day 3: Gear Ratios
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/3
 */

import { eachMatrix, eachSurrounding, sum } from '../lib/index.js';


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


export default function main({ matrix }) {
  const parts = [];

  eachMatrix(matrix, (char, coords) => {
    if (isSymbol(char)) {
      eachSurrounding(matrix, coords, (adj, adjCoords) => {
        if (isDigit(adj)) {
          parts.push(extractPartNumber(matrix, adjCoords));
        }
      });
    }
  });

  return sum(parts);
}

// Your puzzle answer was 526404.
