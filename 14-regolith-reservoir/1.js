'use strict';

// --- Day 14 ---

const { range } = require('lodash');
const { greatest } = require('../lib');

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

  while (true) {
    if (y > lowest) {
      return true;
    }

    if (!map[y + 1]) {
      map[y + 1] = [];
    }

    if (!map[y + 1][x]) {
      y += 1;
    } else if (!map[y + 1][x - 1]) {
      y += 1;
      x -= 1;
    } else if (!map[y + 1][x + 1]) {
      y += 1;
      x += 1;
    } else {
      map[y][x] = true;
      return false;
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
    const isDroppingIntoAbyss = dropSand(map, lowest);

    if (isDroppingIntoAbyss) {
      return sand;
    } else {
      sand += 1;
    }
  }
};
