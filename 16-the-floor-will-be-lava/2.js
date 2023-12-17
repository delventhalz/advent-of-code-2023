/**
 * --- Advent of Code 2023 ---
 *
 * Day 16: The Floor Will Be Lava
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/16#part2
 */

import { eachOnPath, greatest } from '../lib/index.js';


// Returns a laser function which can be called on each step of the
// laser's progression to return the next step.
const getLaser = (previous, visited) => {
  let last = previous;

  return (tile, [x, y]) => {
    const diffX = x - last[0];
    const diffY = y - last[1];
    last = [x, y];

    const key = [x, y, diffX, diffY].join();

    if (visited.has(key)) {
      return null;
    }

    // Avoid looping the laser
    visited.add(key);

    switch (tile) {
      case '.':
        return [x + diffX, y + diffY];
      case '/':
        if (diffX === 1) return [x, y - 1];
        if (diffY === 1) return [x - 1, y];
        if (diffX === -1) return [x, y + 1];
        if (diffY === -1) return [x + 1, y];
        throw new Error('Failed to /');
      case '\\':
        if (diffX === 1) return [x, y + 1];
        if (diffY === 1) return [x + 1, y];
        if (diffX === -1) return [x, y - 1];
        if (diffY === -1) return [x - 1, y];
        throw new Error('Failed to \\');
      case '|':
        if (diffY !== 0) return [x + diffX, y + diffY];
        if (diffX !== 0) return null;
        throw new Error('Failed to |');
      case '-':
        if (diffX !== 0) return [x + diffX, y + diffY];
        if (diffY !== 0) return null;
        throw new Error('Failed to -');
      default:
        throw new Error(`No handler: ${tile}`);
    }
  }
};

// The callbacks for eachOnPath are a little awkwardly bifurcated. This function
// adds the visited coordinates to a set and also creates new iterations on splitters
const getVisitor = (previous, visited) => {
  let last = previous;

  return (tile, coords, matrix) => {
    visited.add(coords.join());
    const [x, y] = coords;

    const diffX = coords[0] - last[0];
    const diffY = coords[1] - last[1];
    last = coords;

    if (tile === '|' && diffX !== 0) {
      eachOnPath(matrix, [x, y + 1], getVisitor(coords, visited), getLaser(coords, visited));
      eachOnPath(matrix, [x, y - 1], getVisitor(coords, visited), getLaser(coords, visited));
    }

    if (tile === '-' && diffY !== 0) {
      eachOnPath(matrix, [x + 1, y], getVisitor(coords, visited), getLaser(coords, visited));
      eachOnPath(matrix, [x - 1, y], getVisitor(coords, visited), getLaser(coords, visited));
    }
  };
};

const getEnergiesFrom = (matrix, start, previous) => {
  const visited = new Set();
  eachOnPath(matrix, start, getVisitor(previous, visited), getLaser(previous, visited));

  // We are awkwardly tracking both energized tiles and laser loops in the same set
  return [...visited].filter(key => key.split(',').length === 2).length;
};

export default function main({ matrix }) {
  const energies = [];

  // Run for every X entrance and every Y entrance
  for (let x = 0; x < matrix[0].length; x += 1) {
    const fromTop = getEnergiesFrom(matrix, [x, 0], [x, -1]);
    const fromBottom = getEnergiesFrom(matrix, [x, matrix[0].length - 1], [x, matrix[0].length]);
    energies.push(fromTop, fromBottom);
  }

  for (let y = 0; y < matrix.length; y += 1) {
    const fromLeft = getEnergiesFrom(matrix, [0, y], [-1, y]);
    const fromRight = getEnergiesFrom(matrix, [matrix.length - 1, y], [matrix.length, y]);
    energies.push(fromLeft, fromRight);
  }

  return greatest(energies);
}
