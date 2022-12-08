'use strict';

// --- Part Two ---

const { eachMatrix } = require('../lib');

const getVisible = (map, x, y, max, next) => {
  let visible = [];

  while (true) {
    ([x, y] = next(x, y));
    if (map[y] === undefined || map[y][x] === undefined) {
      return visible;
    }

      visible.push(`${x},${y}`);


    if (map[y][x] >= max) {
      return visible;
    }
  }

  return visible;
};

module.exports = (_, rawInput) => {
  const map = rawInput.split('\n').map(row => row.split('').map(Number));

  let best = -1;

  eachMatrix(map, (_, [x, y]) => {
    const height = map[y][x];
    const visible = [
      getVisible(map, x, y, height, (x, y) => [x + 1, y]),
      getVisible(map, x, y, height, (x, y) => [x, y + 1]),
      getVisible(map, x, y, height, (x, y) => [x - 1, y]),
      getVisible(map, x, y, height, (x, y) => [x, y - 1]),
    ];
    const score = visible[0].length * visible[1].length * visible[2].length * visible[3].length;

    if (score > best) {
      best = score;
    }
  });

  return best;
};
