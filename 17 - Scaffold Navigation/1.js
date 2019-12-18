// --- Day 17 ---

const { eachMatrix } = require('../lib/arrays.js');
const { getRunner } = require('../lib/intcode.js');
const { sum } = require('../lib/math.js');

const findIntersectionCoords = (matrix) => {
  const intersections = [];

  eachMatrix(matrix, (char, [x, y]) => {
    const isIntersection = char === '#'
      && matrix[y - 1] && matrix[y - 1][x] === '#'
      && matrix[y + 1] && matrix[y + 1][x] === '#'
      && matrix[y][x - 1] === '#'
      && matrix[y][x + 1] === '#';

    if (isIntersection) {
      intersections.push([x, y]);
    }
  });

  return intersections;
};

module.exports = (inputs) => {
  const run = getRunner(inputs, { quietIO: true });

  const map = run()
    .map(ascii =>  String.fromCharCode(ascii))
    .join('')
    .replace(/[\^<>v]/g, '#')
    .split('\n')
    .map(row => row.split(''));

  const intersections = findIntersectionCoords(map);
  return sum(intersections.map(([x, y]) => x * y));
};
