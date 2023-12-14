/**
 * --- Advent of Code 2023 ---
 *
 * Day 13: Point of Incidence
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/13#part2
 */

import { sum, matrixToString } from '../lib/index.js';


const rowToString = (matrix, y, start, stop) => {
  const delta = start < stop ? 1 : -1;

  let string = '';

  for (let x = start; x !== stop; x += delta) {
    string += matrix[y][x];
  }

  return string;
};

const colToString = (matrix, x, start, stop) => {
  const delta = start < stop ? 1 : -1;

  let string = '';

  for (let y = start; y !== stop; y += delta) {
    string += matrix[y][x];
  }

  return string;
};

const countReflectedColumns = (map, skipCol = -1) => {
  for (let x = 1; x < map[0].length; x += 1) {
    if (x === skipCol) {
      continue;
    }

    let didBreak = false;

    for (let y = 0; y < map.length; y += 1) {
      if (x <= map[0].length / 2) {
        if (rowToString(map, y, 0, x) !== rowToString(map, y, x + x - 1, x - 1)) {
          didBreak = true;
          break;
        }
      } else {
        if (rowToString(map, y, x - (map[0].length - x), x) !== rowToString(map, y, map[0].length - 1, x - 1)) {
          didBreak = true;
          break;
        }
      }
    }

    if (!didBreak) {
      return x;
    }
  }

  return 0;
};

const countReflectedRows = (map, skipRow = -1) => {
  for (let y = 1; y < map.length; y += 1) {
    if (y === skipRow) {
      continue;
    }

    let didBreak = false;

    for (let x = 0; x < map[y].length; x += 1) {
      if (y <= map.length / 2) {
        if (colToString(map, x, 0, y) !== colToString(map, x, y + y - 1, y - 1)) {
          didBreak = true;
          break;
        }
      } else {
        if (colToString(map, x, y - (map.length - y), y) !== colToString(map, x, map.length - 1, y - 1)) {
          didBreak = true;
          break;
        }
      }
    }

    if (!didBreak) {
      return y;
    }
  }

  return 0;
};

export default function main({ parsed }) {
  const maps = parsed.map(lines => lines.map(line => line.split('')));

  const scores = maps.map((map, index) => {
    const oldCols = countReflectedColumns(map)
    const oldRows = countReflectedRows(map);

    for (let y = 0; y < map.length; y += 1) {
      for (let x = 0; x < map[0].length; x += 1) {
        const tile = map[y][x];
        map[y][x] = tile === '#' ? '.' : '#';

        const newCols = countReflectedColumns(map, oldCols)
        const newRows = countReflectedRows(map, oldRows);

        map[y][x] = tile;

        if (newCols !== 0 && newCols !== oldCols) {
          return newCols;
        }
        if (newRows !== 0 && newRows !== oldRows) {
          return newRows * 100;
        }
      }
    }

    throw Error(`No match @ ${index}:\n${matrixToString(map)}`);
  });

  return sum(scores);
}
