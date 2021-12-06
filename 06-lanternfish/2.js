'use strict';

// --- Part Two ---

// Suppose the lanternfish live forever and have unlimited food and space.
// Would they take over the entire ocean?

// After 256 days in the example above, there would be a total of 26984457539
// lanternfish!

// How many lanternfish would there be after 256 days?

const { sum } = require('../lib');


const runDay = (lastFishCounts) => {
  const nextFishCounts = lastFishCounts.slice();
  const parentCount = nextFishCounts.shift();

  nextFishCounts[6] += parentCount;
  nextFishCounts.push(parentCount);

  return nextFishCounts;
}

module.exports = (inputs) => {
  let fishCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (const input of inputs) {
    fishCounts[input] += 1;
  }

  for (let i = 0; i < 256; i += 1) {
    fishCounts = runDay(fishCounts);
  }

  return sum(fishCounts);
};

// Your puzzle answer was 1609314870967.
