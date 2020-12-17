// --- Day 17: Conway Cubes ---

// As your flight slowly drifts through the sky, the Elves at the Mythical
// Information Bureau at the North Pole contact you. They'd like some help
// debugging a malfunctioning experimental energy source aboard one of their
// super-secret imaging satellites.

// The experimental energy source is based on cutting-edge technology: a set of
// Conway Cubes contained in a pocket dimension! When you hear it's having
// problems, you can't help but agree to take a look.

// The pocket dimension contains an infinite 3-dimensional grid. At every
// integer 3-dimensional coordinate (x,y,z), there exists a single cube which
// is either active or inactive.

// In the initial state of the pocket dimension, almost all cubes start
// inactive. The only exception to this is a small flat region of cubes (your
// puzzle input); the cubes in this region start in the specified active (#) or
// inactive (.) state.

// The energy source then proceeds to boot up by executing six cycles.

// Each cube only ever considers its neighbors: any of the 26 other cubes where
// any of their coordinates differ by at most 1. For example, given the cube at
// x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at
// x=0,y=2,z=3, and so on.

// During a cycle, all cubes simultaneously change their state according to the
// following rules:

// - If a cube is active and exactly 2 or 3 of its neighbors are also active,
//   the cube remains active. Otherwise, the cube becomes inactive.
// - If a cube is inactive but exactly 3 of its neighbors are active, the cube
//   becomes active. Otherwise, the cube remains inactive.

// The engineers responsible for this experimental energy source would like you
// to simulate the pocket dimension and determine what the configuration of
// cubes should be at the end of the six-cycle boot process.

// For example, consider the following initial state:

//     .#.
//     ..#
//     ###

// Even though the pocket dimension is 3-dimensional, this initial state
// represents a small 2-dimensional slice of it. (In particular, this initial
// state defines a 3x3x1 region of the 3-dimensional space.)

// Simulating a few cycles from this initial state produces the following
// configurations, where the result of each cycle is shown layer-by-layer at
// each given z coordinate (and the frame of view follows the active cells in
// each cycle):

//     Before any cycles:

//     z=0
//     .#.
//     ..#
//     ###


//     After 1 cycle:

//     z=-1
//     #..
//     ..#
//     .#.

//     z=0
//     #.#
//     .##
//     .#.

//     z=1
//     #..
//     ..#
//     .#.


//     After 2 cycles:

//     z=-2
//     .....
//     .....
//     ..#..
//     .....
//     .....

//     z=-1
//     ..#..
//     .#..#
//     ....#
//     .#...
//     .....

//     z=0
//     ##...
//     ##...
//     #....
//     ....#
//     .###.

//     z=1
//     ..#..
//     .#..#
//     ....#
//     .#...
//     .....

//     z=2
//     .....
//     .....
//     ..#..
//     .....
//     .....


//     After 3 cycles:

//     z=-2
//     .......
//     .......
//     ..##...
//     ..###..
//     .......
//     .......
//     .......

//     z=-1
//     ..#....
//     ...#...
//     #......
//     .....##
//     .#...#.
//     ..#.#..
//     ...#...

//     z=0
//     ...#...
//     .......
//     #......
//     .......
//     .....##
//     .##.#..
//     ...#...

//     z=1
//     ..#....
//     ...#...
//     #......
//     .....##
//     .#...#.
//     ..#.#..
//     ...#...

//     z=2
//     .......
//     .......
//     ..##...
//     ..###..
//     .......
//     .......
//     .......

// After the full six-cycle boot process completes, 112 cubes are left in the
// active state.

// Starting with your given initial configuration, simulate six cycles. How
// many cubes are left in the active state after the sixth cycle?

const { get, set } = require('lodash');


const CYCLES = 6;

const parseInputs = lines => lines.map(
  line => line.split('').map(char => Boolean(char === '#'))
);

const countBordering = (space, x, y, z) => {
  let count = 0;

  if (get(space, [z + 1, y, x])) count += 1;
  if (get(space, [z + 1, y + 1, x])) count += 1;
  if (get(space, [z + 1, y + 1, x + 1])) count += 1;
  if (get(space, [z + 1, y + 1, x - 1])) count += 1;
  if (get(space, [z + 1, y - 1, x])) count += 1;
  if (get(space, [z + 1, y - 1, x + 1])) count += 1;
  if (get(space, [z + 1, y - 1, x - 1])) count += 1;
  if (get(space, [z + 1, y, x + 1])) count += 1;
  if (get(space, [z + 1, y, x - 1])) count += 1;

  if (get(space, [z - 1, y, x])) count += 1;
  if (get(space, [z - 1, y + 1, x])) count += 1;
  if (get(space, [z - 1, y + 1, x + 1])) count += 1;
  if (get(space, [z - 1, y + 1, x - 1])) count += 1;
  if (get(space, [z - 1, y - 1, x])) count += 1;
  if (get(space, [z - 1, y - 1, x + 1])) count += 1;
  if (get(space, [z - 1, y - 1, x - 1])) count += 1;
  if (get(space, [z - 1, y, x + 1])) count += 1;
  if (get(space, [z - 1, y, x - 1])) count += 1;

  if (get(space, [z, y + 1, x])) count += 1;
  if (get(space, [z, y + 1, x + 1])) count += 1;
  if (get(space, [z, y + 1, x - 1])) count += 1;

  if (get(space, [z, y - 1, x])) count += 1;
  if (get(space, [z, y - 1, x + 1])) count += 1;
  if (get(space, [z, y - 1, x - 1])) count += 1;

  if (get(space, [z, y, x + 1])) count += 1;
  if (get(space, [z, y, x - 1])) count += 1;

  return count;
};

const cycle = (space, height, width, count) => {
  let next = [[[]]];

  for (let z = -space.length; z <= space.length; z += 1) {
    for (let y = -1 - count; y <= height + count; y += 1) {
      for (let x = -1 - count; x <= width + count; x += 1) {
        const isActive = get(space, [z, y, x]);
        const neighbors = countBordering(space, x, y, z);

        if (isActive) {
          set(next, [z, y, x], neighbors === 2 || neighbors === 3);
        } else {
          set(next, [z, y, x], neighbors === 3);
        }
      }
    }
  }

  return next;
};


module.exports = (inputs) => {
  let space = [parseInputs(inputs)];
  let height = space[0].length;
  let width = space[0][0].length;

  for (let i = 0; i < CYCLES; i += 1) {
    space = cycle(space, height, width, i);
  }

  let count = 0;

  for (let z = -space.length + 1; z < space.length; z += 1) {
    for (let y = -CYCLES; y < height + CYCLES; y += 1) {
      for (let x = -CYCLES; x < width + CYCLES; x += 1) {
        if (space[z][y][x]) {
          count += 1;
        }
      }
    }
  }

  return count;
};

// Your puzzle answer was 237.
