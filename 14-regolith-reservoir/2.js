'use strict';

// --- Part Two ---

const { range } = require('lodash');
const { greatest } = require('../lib');


// Calculated manually
const ROCK_SPAN = 40
const SIDE_COUNT = 7626

const pathsToMap = (paths) => {
  const map = [];

  let start = null;

  for (const path of paths) {
    for (const dest of path) {
      if (start) {
        const [startX, startY] = start;
        const [destX, destY] = dest;

        if (startX === destX) {
          for (const y of range(startY, destY + (startY < destY ? 1 : -1))) {
            if (!map[y]) {
              map[y] = [];
            }
            map[y][startX] = true;
          }
        }

        if (startY === destY) {
          if (!map[startY]) {
            map[startY] = [];
          }
          for (const x of range(startX, destX + (startX < destX ? 1 : -1))) {
            map[startY][x] = true;
          }
        }
      }

      start = dest;
    }

    start = null;
  }

  return map;
};

const dropSand = (map, lowest) => {
  let x = 500;
  let y = 0;

  const left = x - ROCK_SPAN;
  const right = x + ROCK_SPAN;

  while (true) {
    if (y > lowest) {
      map[y][x] = true;
      return false;
    }

    if (!map[y + 1]) {
      map[y + 1] = [];
    }

    if (!map[y + 1][x]) {
      y += 1;
    } else if (!map[y + 1][x - 1] && x > left) {
      y += 1;
      x -= 1;
    } else if (!map[y + 1][x + 1] && x < right) {
      y += 1;
      x += 1;
    } else {
      map[y][x] = true;
      return x === 500 && y === 0;
    }
  }
}


module.exports = (_, rawInput) => {
  const paths = rawInput.split('\n').map(row => row.split(' -> ').map(coords => coords.split(',').map(Number)))
  const lowest = greatest(paths.flat().map(([_, y]) => y));
  const map = pathsToMap(paths);
  map[0] = [];

  let sand = 0;

  while (true) {
    const isStopped = dropSand(map, lowest);

    if (isStopped) {
      return 2 * SIDE_COUNT + sand + 1;
    } else {
      sand += 1;
    }
  }
};
