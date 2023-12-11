/**
 * --- Advent of Code 2023 ---
 *
 * Day 11: Cosmic Expansion
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/11#part2
 */

import { sum, eachMatrix } from '../lib/index.js';


const isEmptyColumn = (matrix, x) => {
  for (let y = 0; y < matrix.length; y += 1) {
    if (matrix[y][x] !== '.') {
      return false;
    }
  }
  return true;
};

const isEmptyRow = (matrix, y) => {
  for (let x = 0; x < matrix[y].length; x += 1) {
    if (matrix[y][x] !== '.') {
      return false;
    }
  }
  return true;
};


export default function main({ matrix }) {
  const galaxies = [];

  eachMatrix(matrix, (tile, coords) => {
    if (tile === '#') {
      galaxies.push([...coords, ...coords]); // Two copies of coords
    }
  });

  let xExpansion = 0;

  for (let x = 0; x < matrix.length; x += 1) {
    if (isEmptyColumn(matrix, x)) {
      xExpansion += 999_999; // Off by one!
    } else {
      for (const galaxy of galaxies) {
        if (galaxy[0] === x) {
          galaxy[2] = x + xExpansion;
        }
      }
    }
  }

  let yExpansion = 0;

  for (let y = 0; y < matrix.length; y += 1) {
    if (isEmptyRow(matrix, y)) {
      yExpansion += 999_999;
    } else {
      for (const galaxy of galaxies) {
        if (galaxy[1] === y) {
          galaxy[3] = y + yExpansion;
        }
      }
    }
  }

  const distances = [];

  for (let a = 0; a < galaxies.length; a += 1) {
    for (let b = a + 1; b < galaxies.length; b += 1) {
      const [_aX, _aY, aBigX, aBigY] = galaxies[a];
      const [_bX, _bY, bBigX, bBigY] = galaxies[b];
      const dist = Math.abs(aBigX - bBigX) + Math.abs(aBigY - bBigY);
      distances.push(dist);
    }
  }

  return sum(distances);
}
