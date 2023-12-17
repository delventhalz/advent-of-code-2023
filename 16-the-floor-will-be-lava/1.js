/**
 * --- Advent of Code 2023 ---
 *
 * Day 16: The Floor Will Be Lava
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/16
 */

import { eachOnPath } from '../lib/index.js';


// Returns a laser function which can be called on each step of the
// laser's progression to return the next step.
const getLaser = (previous, visited) => {
  let last = previous;

  return (tile, [x, y]) => {
    const diffX = x - last[0];
    const diffY = y - last[1];
    last = [x, y];

    const key = [x, y, diffX, diffY].join();

    // Avoid looping the laser
    if (visited.has(key)) {
      return null;
    }

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
        if (diffX !== 0) return null; // Visitor will split
        throw new Error('Failed to |');
      case '-':
        if (diffX !== 0) return [x + diffX, y + diffY];
        if (diffY !== 0) return null; // Visitor will split
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


export default function main({ matrix }) {
  const visited = new Set();

  eachOnPath(matrix, [0, 0], getVisitor([-1, 0], visited), getLaser([-1, 0], visited));

  // We are awkwardly tracking both energized tiles and laser loops in the same set
  return [...visited].filter(key => key.split(',').length === 2).length;
}
