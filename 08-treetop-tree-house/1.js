'use strict';

// --- Day 8 ---

const { eachMatrix } = require('../lib');

const getVisible = (map, x, y, next) => {
  let visible = [`${x},${y}`];
  let height = map[y][x];

  while (height < 9) {
    ([x, y] = next(x, y));
    if (map[y] === undefined || map[y][x] === undefined) {
      return visible;
    }

    if (map[y][x] > height) {
      visible.push(`${x},${y}`);
      height = map[y][x];
    }
  }

  return visible;
};

module.exports = (_, rawInput) => {
  const map = rawInput.split('\n').map(row => row.split('').map(Number));

  const visible = [];

  eachMatrix(map, (_, [x, y]) => {
    if (x === 0) {
      visible.push(...getVisible(map, x, y, (x, y) => [x + 1, y]));
    }
    if (y === 0) {
      visible.push(...getVisible(map, x, y, (x, y) => [x, y + 1]));
    }
    if (x === map[0].length - 1) {
      visible.push(...getVisible(map, x, y, (x, y) => [x - 1, y]));
    }
    if (y === map.length - 1) {
      visible.push(...getVisible(map, x, y, (x, y) => [x, y - 1]));
    }
  });

  return new Set(visible).size;
};
