/**
 * --- Advent of Code 2023 ---
 *
 * Day 11: Cosmic Expansion
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/11
 */

// import {  } from 'lodash-es';
import { sum, eachMatrix, matrixToString } from '../lib/index.js';

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

const expand = (universe) => {
  const expanded = [];

  for (let y = 0; y < universe.length; y += 1) {
    expanded.push(universe[y]);
    if (isEmptyRow(universe, y)) {
      expanded.push(Array(universe[y].length).fill('.'));
    }
  }

  for (let x = 0; x < universe[0].length; x += 1) {
    if(isEmptyColumn(universe, x)) {
      for (let y = 0; y < expanded.length; y += 1) {
        expanded[y][x] = [expanded[y][x], '.'];
      }
    }
  }

  return expanded.map(row => row.flat());
};

export default function main({ matrix }) {
  const expanded = expand(matrix);

  const galaxies = [];

  eachMatrix(expanded, (tile, coords) => {
    if (tile === '#') {
      galaxies.push(coords);
    }
  });

  const distances = [];

  for (let a = 0; a < galaxies.length; a += 1) {
    for (let b = a + 1; b < galaxies.length; b += 1) {
      const [aX, aY] = galaxies[a];
      const [bX, bY] = galaxies[b];
      const dist = Math.abs(aX - bX) + Math.abs(aY - bY);
      distances.push(dist);
    }
  }

  return sum(distances);
}
