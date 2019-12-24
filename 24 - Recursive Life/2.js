// --- Day 24 ---

const { mapMatrix } = require('../lib/arrays.js');
const { sum } = require('../lib/math.js');


const countCurrentNeighbors = (maps, i, x, y, target) => {
  const current = maps[i]
  let count = 0;

  if (current[y][x - 1] === target) {
    count += 1;
  }
  if (current[y][x + 1] === target) {
    count += 1;
  }
  if (current[y - 1] && current[y - 1][x] === target) {
    count += 1;
  }
  if (current[y + 1] && current[y + 1][x] === target) {
    count += 1;
  }

  return count;
};

const countPreviousNeighbors = (maps, i, x, y, target) => {
  const current = maps[i];
  const previous = maps[i - 1];
  let count = 0;

  if (!previous) {
    return count;
  }

  if (current[y][x - 1] === undefined && previous[2][1] === target) {
    count += 1;
  }
  if (current[y][x + 1] === undefined && previous[2][3] === target) {
    count += 1;
  }
  if (current[y - 1] === undefined && previous[1][2] === target) {
    count += 1;
  }
  if (current[y + 1] === undefined && previous[3][2] === target) {
    count += 1;
  }

  return count;
};

const countNextNeighbors = (maps, i, x, y, target) => {
  const next = maps[i + 1];
  let count = 0;

  if (!next) {
    return count;
  }

  if (x === 1 && y === 2) {
    count += sum(next.map(row => row[0] === target ? 1 : 0));
  }
  if (x === 3 && y === 2) {
    count += sum(next.map(row => row[4] === target ? 1 : 0));
  }
  if (x === 2 && y === 1) {
    count += sum(next[0].map(square => square === target ? 1 : 0));
  }
  if (x === 2 && y === 3) {
    count += sum(next[4].map(square => square === target ? 1 : 0));
  }

  return count;
};

const countNeighbors = (maps, i, x, y, target) => (
  countCurrentNeighbors(maps, i, x, y, target)
  + countPreviousNeighbors(maps, i, x, y, target)
  + countNextNeighbors(maps, i, x, y, target)
);

const cycle = (maps) => maps.map((map, i) => mapMatrix(map, (square, [x, y]) => {
  if (x === 2 && y === 2) {
    return '.';
  }

  const neighbors = countNeighbors(maps, i, x, y, '#');

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
}));

const getNewMap = () => [
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.']
];

const goDeeper = (maps) => {
  const bottomHasCenterBugs =
    countCurrentNeighbors(maps, maps.length - 1, 2, 2, '#') > 0;

  if (bottomHasCenterBugs) {
    maps.push(getNewMap());
  }
};

const goShallower = (maps) => {
  const top = maps[0];
  const topHasBorderBugs =
    top.some(row => row[0] === '#')
    || top.some(row => row[4] === '#')
    || top[0].some(square => square === '#')
    || top[4].some(square => square === '#');

  if (topHasBorderBugs) {
    maps.unshift(getNewMap());
  }
};

const tally = (maps) => sum(
  maps
    .flatMap(map => map.flat())
    .map(square => square === '#' ? 1 : 0)
);


module.exports = async (inputs) => {
  let maps = [inputs.map(row => row.split(''))];

  for (let i = 0; i < 200; i++) {
    goDeeper(maps);
    goShallower(maps);
    maps = cycle(maps);
  }

  return tally(maps);
};
