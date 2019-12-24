// --- Day 24 ---

const { mapMatrix } = require('../lib/arrays.js');
const { sum } = require('../lib/math.js');


const countSurrounding = (matrix, x, y, target) => {
  let count = 0;

  if (matrix[y][x - 1] === target) {
    count += 1;
  }
  if (matrix[y][x + 1] === target) {
    count += 1;
  }
  if (matrix[y - 1] && matrix[y - 1][x] === target) {
    count += 1;
  }
  if (matrix[y + 1] && matrix[y + 1][x] === target) {
    count += 1;
  }

  return count;
};

const cycle = (map) => mapMatrix(map, (square, [x, y]) => {
  const neighbors = countSurrounding(map, x, y, '#');
  if (square === '#') {
    if (neighbors === 1) {
      return '#';
    }
    return '.';
  }

  if (square === '.') {
    if (neighbors === 1 || neighbors === 2) {
      return '#';
    }
    return '.';
  }
});

const mapToString = (map) => map.map(row => row.join()).join();

const tally = (squares) => sum(squares.map((square, i) => square === '#' ? 2 ** i : 0));


module.exports = (inputs) => {
  let map = inputs.map(row => row.split(''));
  const seen = new Set([mapToString(map)]);

  while(true) {
    map = cycle(map);
    const mapString = mapToString(map);

    if (seen.has(mapString)) {
      return tally(mapString.split(','));
    }

    seen.add(mapString);
  }
};
