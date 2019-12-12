// --- Part Two ---

// All this drifting around in space makes you wonder about the nature of the
// universe. Does history really repeat itself? You're curious whether the
// moons will ever return to a previous state.

// Determine the number of steps that must occur before all of the moons'
// positions and velocities exactly match a previous point in time.

// For example, the first example above takes 2772 steps before they exactly
// match a previous point in time; it eventually returns to the initial state:

//     After 0 steps:
//     pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
//     pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
//     pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
//     pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>

//     After 2770 steps:
//     pos=<x=  2, y= -1, z=  1>, vel=<x= -3, y=  2, z=  2>
//     pos=<x=  3, y= -7, z= -4>, vel=<x=  2, y= -5, z= -6>
//     pos=<x=  1, y= -7, z=  5>, vel=<x=  0, y= -3, z=  6>
//     pos=<x=  2, y=  2, z=  0>, vel=<x=  1, y=  6, z= -2>

//     After 2771 steps:
//     pos=<x= -1, y=  0, z=  2>, vel=<x= -3, y=  1, z=  1>
//     pos=<x=  2, y=-10, z= -7>, vel=<x= -1, y= -3, z= -3>
//     pos=<x=  4, y= -8, z=  8>, vel=<x=  3, y= -1, z=  3>
//     pos=<x=  3, y=  5, z= -1>, vel=<x=  1, y=  3, z= -1>

//     After 2772 steps:
//     pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
//     pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
//     pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
//     pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>

// Of course, the universe might last for a very long time before repeating.
// Here's a copy of the second example from above:

//     <x=-8, y=-10, z=0>
//     <x=5, y=5, z=10>
//     <x=2, y=-7, z=3>
//     <x=9, y=-8, z=-3>

// This set of initial positions takes 4686774924 steps before it repeats a
// previous state! Clearly, you might need to find a more efficient way to
// simulate the universe.

// How many steps does it take to reach the first state that exactly matches a
// previous state?

const lcm = require('compute-lcm');


const parsePositionString = (positions) => positions
  .match(/<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/)
  .slice(1)
  .map(Number);

const pluckAt = (matrix, i) => matrix.map(arr => arr[i]);
const pluckPos = (moons, i) => pluckAt(pluckAt(moons, i), 0);

const countGreater = (nums, target) => nums.filter(num => num > target).length;
const countLess = (nums, target) => nums.filter(num => num < target).length;
const velDelta = (positions, pos) => (
  countGreater(positions, pos) - countLess(positions, pos)
);

const accelerate = (moons) => moons.map(moon => (
  moon.map(([pos, vel], i) => [pos, vel + velDelta(pluckPos(moons, i), pos)])
));
const move = (moons) => moons.map(moon => (
  moon.map(([pos, vel]) => [pos + vel, vel])
));


const toAxisString = (moons, i) => pluckAt(moons, i).join();

const allArraysHaveLength = (target, ...objs) => objs.every(objOfArrays => (
  Object.values(objOfArrays).every(({ length }) => length >= target)
));
const reverse = (arr) => arr.slice().reverse();
const diffNums = (nums) => nums.slice(1).map((num, i) => num - nums[i]);


module.exports = (inputs) => {
  // Moon array of vector tuples: [[xPos, xVel], [yPos, yVel], [zPos, zVel]]
  let moons = inputs
    .map(stringPieces => stringPieces.join(','))
    .map(parsePositionString)
    .map(([x, y, z]) => [[x, 0], [y, 0], [z, 0]]);

  const xStates = {};
  const yStates = {};
  const zStates = {};
  let steps = 0;

  // Record first three states
  while (steps < 3) {
    xStates[toAxisString(moons, 0)] = [steps];
    yStates[toAxisString(moons, 1)] = [steps];
    zStates[toAxisString(moons, 2)] = [steps];

    moons = move(accelerate(moons));
    steps += 1;
  }

  // Find at least three repeats of first three states
  while (!allArraysHaveLength(3, xStates, yStates, zStates)) {
    const x = toAxisString(moons, 0);
    const y = toAxisString(moons, 1);
    const z = toAxisString(moons, 2);

    if (xStates[x]) {
      console.log(steps, '- X repeats:', reverse(xStates[x]).join(', '));
      xStates[x].push(steps);
    }

    if (yStates[y]) {
      console.log(steps, '- Y repeats:', reverse(yStates[y]).join(', '));
      yStates[y].push(steps);
    }

    if (zStates[z]) {
      console.log(steps, '- Z repeats:', reverse(zStates[z]).join(', '));
      zStates[z].push(steps);
    }

    moons = move(accelerate(moons));
    steps += 1;
  }

  // Confirm the repeats are happening at regular intervals
  const xIntervals = Object.values(xStates).flatMap(diffNums);
  const yIntervals = Object.values(yStates).flatMap(diffNums);
  const zIntervals = Object.values(zStates).flatMap(diffNums);

  console.log();
  console.log('X intervals:', xIntervals);
  console.log('Y intervals:', yIntervals);
  console.log('Z intervals:', zIntervals);

  // Calculate least common multiple of intervals
  console.log();
  console.log('LCM:');
  return lcm(xIntervals[0], yIntervals[0], zIntervals[0]);
};


// Your puzzle answer was 376203951569712.
