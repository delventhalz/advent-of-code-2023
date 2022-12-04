'use strict';

// --- Part Two ---

// It seems like there is still quite a bit of duplicate work planned. Instead,
// the Elves would like to know the number of pairs that overlap at all.

// In the above example, the first two pairs (2-4,6-8 and 2-3,4-5) don't
// overlap, while the remaining four pairs (5-7,7-9, 2-8,3-7, 6-6,4-6, and
// 2-6,4-8) do overlap:

// - 5-7,7-9 overlaps in a single section, 7.
// - 2-8,3-7 overlaps all of the sections 3 through 7.
// - 6-6,4-6 overlaps in a single section, 6.
// - 2-6,4-8 overlaps in sections 4, 5, and 6.

// So, in this example, the number of overlapping assignment pairs is 4.

// In how many assignment pairs do the ranges overlap?

const { between, count } = require('../lib');


const parsePair = (stringPair) => stringPair.map(elf => elf.split('-').map(Number));

const isOneContained = ([a, b]) => {
  if (between(a[0], b[0], b[1] + 1) || between(a[1], b[0], b[1] + 1)) {
    return true;
  }

  if (between(b[0], a[0], a[1] + 1) || between(b[1], a[0], a[1] + 1)) {
    return true;
  }

  return false;
};


module.exports = (inputs) => {
  const pairs = inputs.map(parsePair);
  return count(pairs, isOneContained);
};

// Your puzzle answer was 770.
