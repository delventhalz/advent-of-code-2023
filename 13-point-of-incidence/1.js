/**
 * --- Advent of Code 2023 ---
 *
 * Day 13: Point of Incidence
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/13
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

const countReflectedColumns = (map) => {
  for (let x = 1; x < map[0].length; x += 1) {
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
      if (x <= map[0].length / 2) {
        return x;
      } else {
        return x;
      }
    }
  }

  return undefined;
};

const countReflectedRows = (map) => {
  for (let y = 1; y < map.length; y += 1) {
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
      if (y <= map.length / 2) {
        return y;
      } else {
        return y;
      }
    }
  }

  return undefined;
};

export default function main({ parsed }) {
  const maps = parsed.map(lines => lines.map(line => line.split('')));

  const scores = maps.map((map, index) => {
    const cols = countReflectedColumns(map);
    if (cols !== undefined) {
      return cols;
    }

    const rows = countReflectedRows(map);
    if (rows !== undefined) {
      return 100 * rows;
    }

    throw Error(`No match @ ${index}:\n${matrixToString(map)}`);
  })

  return sum(scores);
}
