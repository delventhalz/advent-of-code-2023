'use strict';

// --- Part Two ---

// Unfortunately, considering only horizontal and vertical lines doesn't give
// you the full picture; you need to also consider diagonal lines.

// Because of the limits of the hydrothermal vent mapping system, the lines in
// your list will only ever be horizontal, vertical, or a diagonal line at
// exactly 45 degrees. In other words:

// - An entry like 1,1 -> 3,3 covers points 1,1, 2,2, and 3,3.
// - An entry like 9,7 -> 7,9 covers points 9,7, 8,8, and 7,9.

// Considering all lines from the above example would now produce the following
// diagram:

//     1.1....11.
//     .111...2..
//     ..2.1.111.
//     ...1.2.2..
//     .112313211
//     ...1.2....
//     ..1...1...
//     .1.....1..
//     1.......1.
//     222111....

// You still need to determine the number of points where at least two lines
// overlap. In the above example, this is still anywhere in the diagram with a
// 2 or larger - now a total of 12 points.

// Consider all of the lines. At how many points do at least two lines overlap?


const { range } = require('lodash');
const { eachMatrix } = require('../lib');

const parseLine = (line) => {
  return line.split(' -> ').flatMap(coord => coord.split(',').map(Number));
};

const toArray = (matrix, predicate) => {
  const keep = [];

  eachMatrix(matrix, (item) => {
    if (predicate(item)) {
      keep.push(item);
    }
  })

  return keep;
};

module.exports = (_, rawInput) => {
  const lines = rawInput.split('\n').map(parseLine);
  const map = range(1000).map(() => range(1000).map(() => 0))

  for (const [x1, y1, x2, y2] of lines) {
    if (Math.abs(x2 - x1) === Math.abs(y2 - y1)) {
      let x = x1;
      let y = y1;

      while (true) {
        map[y][x] += 1;

        if (x === x2 && y === y2) {
          break;
        }

        if (x1 < x2) {
          x += 1;
        } else  {
          x -= 1;
        }

        if (y1 < y2) {
          y += 1;
        } else {
          y -= 1;
        }
      }
    } else if (x1 === x2) {
      let start = y1 < y2 ? y1 : y2;
      let end = y1 < y2 ? y2 : y1;

      for (let y = start; y <= end; y += 1) {
        map[y][x1] += 1;
      }
    } else if (y1 === y2) {
      let start = x1 < x2 ? x1 : x2;
      let end = x1 < x2 ? x2 : x1;

      for (let x = start; x <= end; x += 1) {
        map[y1][x] += 1;
      }
    }
  }

  return toArray(map, n => n >= 2).length;
};

// Your puzzle answer was 22335.
