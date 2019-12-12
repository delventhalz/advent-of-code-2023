// --- Day 12 ---

const { sum } = require('../math.js');


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

const sumAbsValues = (obj) => sum(Object.values(obj).map(Math.abs));
const getEnergy = ({ pos, vel }) => sumAbsValues(pos) * sumAbsValues(vel);

module.exports = (inputs) => {
  const moons = inputs
    .map(positionsToObject)
    .map(pos => ({ pos, vel: { x: 0, y: 0, z: 0 } }));

  for (let i = 0; i < 1000; i++) {
    updatePositions(updateVelocities(moons));
  }

  return sum(moons.map(getEnergy));
};
