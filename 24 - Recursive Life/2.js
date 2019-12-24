// --- Part Two ---

// After careful analysis, one thing is certain: you have no idea where all
// these bugs are coming from.

// Then, you remember: Eris is an old Plutonian settlement! Clearly, the bugs
// are coming from recursively-folded space.

// This 5x5 grid is only one level in an infinite number of recursion levels.
// The tile in the middle of the grid is actually another 5x5 grid, the grid in
// your scan is contained as the middle tile of a larger 5x5 grid, and so on.
// Two levels of grids look like this:

//          |     |         |     |
//          |     |         |     |
//          |     |         |     |
//     -----+-----+---------+-----+-----
//          |     |         |     |
//          |     |         |     |
//          |     |         |     |
//     -----+-----+---------+-----+-----
//          |     | | | | | |     |
//          |     |-+-+-+-+-|     |
//          |     | | | | | |     |
//          |     |-+-+-+-+-|     |
//          |     | | |?| | |     |
//          |     |-+-+-+-+-|     |
//          |     | | | | | |     |
//          |     |-+-+-+-+-|     |
//          |     | | | | | |     |
//     -----+-----+---------+-----+-----
//          |     |         |     |
//          |     |         |     |
//          |     |         |     |
//     -----+-----+---------+-----+-----
//          |     |         |     |
//          |     |         |     |
//          |     |         |     |

// (To save space, some of the tiles are not drawn to scale.) Remember, this is
// only a small part of the infinitely recursive grid; there is a 5x5 grid that
// contains this diagram, and a 5x5 grid that contains that one, and so on.
// Also, the ? in the diagram contains another 5x5 grid, which itself contains
// another 5x5 grid, and so on.

// The scan you took (your puzzle input) shows where the bugs are on a single
// level of this structure. The middle tile of your scan is empty to
// accommodate the recursive grids within it. Initially, no other levels
// contain bugs.

// Tiles still count as adjacent if they are directly up, down, left, or right
// of a given tile. Some tiles have adjacent tiles at a recursion level above
// or below its own level. For example:

//          |     |         |     |
//       1  |  2  |    3    |  4  |  5
//          |     |         |     |
//     -----+-----+---------+-----+-----
//          |     |         |     |
//       6  |  7  |    8    |  9  |  10
//          |     |         |     |
//     -----+-----+---------+-----+-----
//          |     |A|B|C|D|E|     |
//          |     |-+-+-+-+-|     |
//          |     |F|G|H|I|J|     |
//          |     |-+-+-+-+-|     |
//      11  | 12  |K|L|?|N|O|  14 |  15
//          |     |-+-+-+-+-|     |
//          |     |P|Q|R|S|T|     |
//          |     |-+-+-+-+-|     |
//          |     |U|V|W|X|Y|     |
//     -----+-----+---------+-----+-----
//          |     |         |     |
//      16  | 17  |    18   |  19 |  20
//          |     |         |     |
//     -----+-----+---------+-----+-----
//          |     |         |     |
//      21  | 22  |    23   |  24 |  25
//          |     |         |     |

// - Tile 19 has four adjacent tiles: 14, 18, 20, and 24.
// - Tile G has four adjacent tiles: B, F, H, and L.
// - Tile D has four adjacent tiles: 8, C, E, and I.
// - Tile E has four adjacent tiles: 8, D, 14, and J.
// - Tile 14 has eight adjacent tiles: 9, E, J, O, T, Y, 15, and 19.
// - Tile N has eight adjacent tiles: I, O, S, and five tiles within the sub-grid marked ?.

// The rules about bugs living and dying are the same as before.

// For example, consider the same initial state as above:

//     ....#
//     #..#.
//     #.?##
//     ..#..
//     #....

// The center tile is drawn as ? to indicate the next recursive grid. Call this
// level 0; the grid within this one is level 1, and the grid that contains
// this one is level -1. Then, after ten minutes, the grid at each level would
// look like this:

//     Depth -5:
//     ..#..
//     .#.#.
//     ..?.#
//     .#.#.
//     ..#..

//     Depth -4:
//     ...#.
//     ...##
//     ..?..
//     ...##
//     ...#.

//     Depth -3:
//     #.#..
//     .#...
//     ..?..
//     .#...
//     #.#..

//     Depth -2:
//     .#.##
//     ....#
//     ..?.#
//     ...##
//     .###.

//     Depth -1:
//     #..##
//     ...##
//     ..?..
//     ...#.
//     .####

//     Depth 0:
//     .#...
//     .#.##
//     .#?..
//     .....
//     .....

//     Depth 1:
//     .##..
//     #..##
//     ..?.#
//     ##.##
//     #####

//     Depth 2:
//     ###..
//     ##.#.
//     #.?..
//     .#.##
//     #.#..

//     Depth 3:
//     ..###
//     .....
//     #.?..
//     #....
//     #...#

//     Depth 4:
//     .###.
//     #..#.
//     #.?..
//     ##.#.
//     .....

//     Depth 5:
//     ####.
//     #..#.
//     #.?#.
//     ####.
//     .....

// In this example, after 10 minutes, a total of 99 bugs are present.

// Starting with your scan, how many bugs are present after 200 minutes?

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


// Your puzzle answer was 1948.
