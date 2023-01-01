'use strict';

// --- Part Two ---

// You realize you misread the scan. There isn't an endless void at the bottom
// of the scan - there's floor, and you're standing on it!

// You don't have time to scan the floor, so assume the floor is an infinite
// horizontal line with a y coordinate equal to two plus the highest y
// coordinate of any point in your scan.

// In the example above, the highest y coordinate of any point is 9, and so the
// floor is at y=11. (This is as if your scan contained one extra rock path
// like -infinity,11 -> infinity,11.) With the added floor, the example above
// now looks like this:

//             ...........+........
//             ....................
//             ....................
//             ....................
//             .........#...##.....
//             .........#...#......
//             .......###...#......
//             .............#......
//             .............#......
//             .....#########......
//             ....................
//     <-- etc #################### etc -->

// To find somewhere safe to stand, you'll need to simulate falling sand until a
// unit of sand comes to rest at 500,0, blocking the source entirely and
// stopping the flow of sand into the cave. In the example above, the situation
// finally looks like this after 93 units of sand come to rest:

//     ............o............
//     ...........ooo...........
//     ..........ooooo..........
//     .........ooooooo.........
//     ........oo#ooo##o........
//     .......ooo#ooo#ooo.......
//     ......oo###ooo#oooo......
//     .....oooo.oooo#ooooo.....
//     ....oooooooooo#oooooo....
//     ...ooo#########ooooooo...
//     ..ooooo.......ooooooooo..
//     #########################

// Using your scan, simulate the falling sand until the source of the sand
// becomes blocked. How many units of sand come to rest?

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
};


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

// Your puzzle answer was 25055.
