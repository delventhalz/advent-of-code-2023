'use strict';

// --- Part Two ---

// Next, you need to find the largest basins so you know what areas are most
// important to avoid.

// A basin is all locations that eventually flow downward to a single low
// point. Therefore, every low point has a basin, although some basins are very
// small. Locations of height 9 do not count as being in any basin, and all
// other locations will always be part of exactly one basin.

// The size of a basin is the number of locations within the basin, including
// the low point. The example above has four basins.

// The top-left basin, size 3:

//     2199943210
//     3987894921
//     9856789892
//     8767896789
//     9899965678

// The top-right basin, size 9:

//     2199943210
//     3987894921
//     9856789892
//     8767896789
//     9899965678

// The middle basin, size 14:

//     2199943210
//     3987894921
//     9856789892
//     8767896789
//     9899965678

// The bottom-right basin, size 9:

//     2199943210
//     3987894921
//     9856789892
//     8767896789
//     9899965678

// Find the three largest basins and multiply their sizes together. In the
// above example, this is 9 * 14 * 9 = 1134.

// What do you get if you multiply together the sizes of the three largest
// basins?

const { uniq } = require('lodash');
const { eachMatrix } = require('../lib');


const getLowPoints = (map) => {
  const lowPoints = [];

  eachMatrix(map, (height, [x, y]) => {
    const isLowPoint = (
      (map[y - 1] === undefined || map[y - 1][x] === undefined || map[y - 1][x] > height)
        && (map[y + 1] === undefined || map[y + 1][x] === undefined || map[y + 1][x] > height)
        && (map[y][x - 1] === undefined || map[y][x - 1] > height)
        && (map[y][x + 1] === undefined || map[y][x + 1] > height)
    );

    if (isLowPoint) {
      lowPoints.push([x, y]);
    }
  });

  return lowPoints;
};

const getBasin = (map, [x, y]) => {
  const height = map[y][x];
  const basin = [[x, y]];

  if (map[y - 1] !== undefined && map[y - 1][x] !== undefined && map[y - 1][x] !== 9 && map[y - 1][x] > height) {
    basin.push(...getBasin(map, [x, y - 1]))
  }

  if (map[y + 1] !== undefined && map[y + 1][x] !== undefined && map[y + 1][x] !== 9 && map[y + 1][x] > height) {
    basin.push(...getBasin(map, [x, y + 1]))
  }

  if (map[y][x - 1] !== undefined && map[y][x - 1] !== 9 && map[y][x - 1] > height) {
    basin.push(...getBasin(map, [x - 1, y]))
  }

  if (map[y][x + 1] !== undefined && map[y][x + 1] !== 9 && map[y][x + 1] > height) {
    basin.push(...getBasin(map, [x + 1, y]))
  }

  // Dedup basin
  return uniq(basin.map(String)).map(str => str.split(','));
};


module.exports = (_, rawInput) => {
  const map = rawInput.split('\n').map(line => line.split('').map(Number))

  return getLowPoints(map)
    .map(lowpoint => getBasin(map, lowpoint))
    .map(basin => basin.length)
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((prod, num) => prod * num);
};

// Your puzzle answer was 1019494.
