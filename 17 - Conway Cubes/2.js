// --- Part Two ---

// For some reason, your simulated results don't match what the experimental
// energy source engineers expected. Apparently, the pocket dimension actually
// has four spatial dimensions, not three.

// The pocket dimension contains an infinite 4-dimensional grid. At every
// integer 4-dimensional coordinate (x,y,z,w), there exists a single cube
// (really, a hypercube) which is still either active or inactive.

// Each cube only ever considers its neighbors: any of the 80 other cubes where
// any of their coordinates differ by at most 1. For example, given the cube at
// x=1,y=2,z=3,w=4, its neighbors include the cube at x=2,y=2,z=3,w=3, the cube
// at x=0,y=2,z=3,w=4, and so on.

// The initial state of the pocket dimension still consists of a small flat
// region of cubes. Furthermore, the same rules for cycle updating still apply:
// during each cycle, consider the number of active neighbors of each cube.

// For example, consider the same initial state as in the example above. Even
// though the pocket dimension is 4-dimensional, this initial state represents
// a small 2-dimensional slice of it. (In particular, this initial state
// defines a 3x3x1x1 region of the 4-dimensional space.)

// Simulating a few cycles from this initial state produces the following
// configurations, where the result of each cycle is shown layer-by-layer at
// each given z and w coordinate:

//     Before any cycles:

//     z=0, w=0
//     .#.
//     ..#
//     ###


//     After 1 cycle:

//     z=-1, w=-1
//     #..
//     ..#
//     .#.

//     z=0, w=-1
//     #..
//     ..#
//     .#.

//     z=1, w=-1
//     #..
//     ..#
//     .#.

//     z=-1, w=0
//     #..
//     ..#
//     .#.

//     z=0, w=0
//     #.#
//     .##
//     .#.

//     z=1, w=0
//     #..
//     ..#
//     .#.

//     z=-1, w=1
//     #..
//     ..#
//     .#.

//     z=0, w=1
//     #..
//     ..#
//     .#.

//     z=1, w=1
//     #..
//     ..#
//     .#.


//     After 2 cycles:

//     z=-2, w=-2
//     .....
//     .....
//     ..#..
//     .....
//     .....

//     z=-1, w=-2
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=0, w=-2
//     ###..
//     ##.##
//     #...#
//     .#..#
//     .###.

//     z=1, w=-2
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=2, w=-2
//     .....
//     .....
//     ..#..
//     .....
//     .....

//     z=-2, w=-1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=-1, w=-1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=0, w=-1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=1, w=-1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=2, w=-1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=-2, w=0
//     ###..
//     ##.##
//     #...#
//     .#..#
//     .###.

//     z=-1, w=0
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=0, w=0
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=1, w=0
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=2, w=0
//     ###..
//     ##.##
//     #...#
//     .#..#
//     .###.

//     z=-2, w=1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=-1, w=1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=0, w=1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=1, w=1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=2, w=1
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=-2, w=2
//     .....
//     .....
//     ..#..
//     .....
//     .....

//     z=-1, w=2
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=0, w=2
//     ###..
//     ##.##
//     #...#
//     .#..#
//     .###.

//     z=1, w=2
//     .....
//     .....
//     .....
//     .....
//     .....

//     z=2, w=2
//     .....
//     .....
//     ..#..
//     .....
//     .....

// After the full six-cycle boot process completes, 848 cubes are left in the
// active state.

// Starting with your given initial configuration, simulate six cycles in a
// 4-dimensional space. How many cubes are left in the active state after the
// sixth cycle?

const { get, set } = require('lodash');


const CYCLES = 6;

const parseInputs = lines => lines.map(
  line => line.split('').map(char => Boolean(char === '#'))
);

const countBordering = (space, xP, yP, zP, wP) => {
  let count = 0;

  for (let w = wP - 1; w <= wP + 1; w += 1) {
    for (let z = zP - 1; z <= zP + 1; z += 1) {
      for (let y = yP - 1; y <= yP + 1; y += 1) {
        for (let x = xP - 1; x <= xP + 1; x += 1) {
          if (get(space, [w, z, y, x])) {
            count += 1;
          }
        }
      }
    }
  }

  // Remove parent space if it was counted
  return get(space, [wP, zP, yP, xP]) ? count - 1 : count;
};

const cycle = (space, height, width, count) => {
  let next = [[[[]]]];

  for (let w = -space.length; w <= space.length; w += 1) {
    for (let z = -space[0].length; z <= space[0].length; z += 1) {
      for (let y = -1 - count; y <= height + count; y += 1) {
        for (let x = -1 - count; x <= width + count; x += 1) {
          const isActive = get(space, [w, z, y, x]);
          const neighbors = countBordering(space, x, y, z, w);

          if (isActive) {
            set(next, [w, z, y, x], neighbors === 2 || neighbors === 3);
          } else {
            set(next, [w, z, y, x], neighbors === 3);
          }
        }
      }
    }
  }

  return next;
};


module.exports = (inputs) => {
  let space = [[parseInputs(inputs)]];
  let height = space[0][0].length;
  let width = space[0][0][0].length;

  for (let i = 0; i < CYCLES; i += 1) {
    space = cycle(space, height, width, i);
  }

  let count = 0;

  for (let w = -space.length + 1; w < space.length; w += 1) {
    for (let z = -space[0].length + 1; z < space[0].length; z += 1) {
      for (let y = -CYCLES; y < height + CYCLES; y += 1) {
        for (let x = -CYCLES; x < width + CYCLES; x += 1) {
          if (space[w][z][y][x]) {
            count += 1;
          }
        }
      }
    }
  }

  return count;
};

// Your puzzle answer was 2448.
