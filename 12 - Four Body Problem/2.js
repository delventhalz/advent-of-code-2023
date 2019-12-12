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

const positionsToObject = (positions) => Object.fromEntries(
  positions
    .map(position => position.replace('<', ''))
    .map(position => position.replace('>', ''))
    .map(position => position.trim())
    .map(position => position.split('='))
    .map(([key, val]) => [key, Number(val)])
);

const sort = (nums) => nums.slice().sort((a, b) => a - b);
const withUniqueItem = (arr, uniqItem) => {
  const first = arr.indexOf(uniqItem);
  return arr.filter((item, i) => item !== uniqItem || i === first);
};

const updateVelocity = (moons, key) => {
  const positions = sort(moons.map(({ pos }) => pos[key]));

  for (const moon of moons) {
    const pos = moon.pos[key];
    const withoutMatching = withUniqueItem(positions, pos);

    const preceding = withoutMatching.indexOf(pos);
    const following = withoutMatching.length - preceding - 1;
    moon.vel[key] += following - preceding;
  }

  return moons;
};

const updateVelocities = (moons) => {
  updateVelocity(moons, 'x');
  updateVelocity(moons, 'y');
  updateVelocity(moons, 'z');

  return moons;
};

const updatePositions = (moons) => {
  for (const moon of moons) {
    const { vel: { x, y, z } } = moon;
    moon.pos.x += x;
    moon.pos.y += y;
    moon.pos.z += z;
  }

  return moons;
};

const toKeyString = (moons, key) => [
  ...moons.map(({ pos }) => pos[key]),
  ...moons.map(({ vel }) => vel[key])
].join();

/*
Notes:
- Z hits equilibrium at 96237 steps, repeating every step afterwards
  * -9,-10,-10,0,-1,3,1,-3
- X hits equilibrium at 135025 steps, repeating every step afterwards
  * -5,-3,-12,-4,1,-3,3,-1
- Y hits equilibrium at 231615 steps, repeating every step afterwards
  * -4,-4,7,-5,1,-1,-3,3
- X * Y * Z = 3009698170243875 (too high)
- LCM(X, Y, Z) = 1003232723414625 (too high)
- These are not clean repeats, i.e. the X of step 96237 !== the X of step 0
- Off by 1?
  * YES
*/

module.exports = (inputs) => {
  const moons = inputs
    .map(positionsToObject)
    .map(pos => ({ pos, vel: { x: 0, y: 0, z: 0 } }));

  const xs = {};
  const ys = {};
  const zs = {};
  let steps = 0;

  const x = toKeyString(moons, 'x');
  const y = toKeyString(moons, 'y');
  const z = toKeyString(moons, 'z');
  xs[x] = [0];
  ys[y] = [0];
  zs[z] = [0];

  while (steps < 231615 * 3 + 1) {
    updatePositions(updateVelocities(moons));
    steps += 1;

    const x = toKeyString(moons, 'x');
    const y = toKeyString(moons, 'y');
    const z = toKeyString(moons, 'z');

    if (xs[x]) {
      // console.log(steps, '- X repeats:', xs[x].join());
      // xs[x].push(steps);
      // break;
      xs[x] = null;
      xs.foo = steps;
    } else {
      // xs[x] = [steps];
    }

    if (ys[y]) {
      // console.log(steps, '- Y repeats:', ys[y].join());
      // ys[y].push(steps);
      // break;
      ys[y] = null;
      ys.foo = steps;
    } else {
      // ys[y] = [steps];
    }

    if (zs[z]) {
      // console.log(steps, '- Z repeats:', zs[z].join());
      // zs[z].push(steps);
      // break;
      zs[z] = null;
      zs.foo = steps;
    } else {
      // zs[z] = [steps];
    }
  }

  // return lcm(96236, 135024, 231614);
  return lcm(xs.foo, ys.foo, zs.foo);
};


// Your puzzle answer was 376203951569712.
