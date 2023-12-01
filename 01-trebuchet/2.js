'use strict';

// --- Part Two ---

// Your calculation isn't quite right. It looks like some of the digits are
// actually spelled out with letters: one, two, three, four, five, six, seven,
// eight, and nine also count as valid "digits".

// Equipped with this new information, you now need to find the real first and
// last digit on each line. For example:

//     two1nine
//     eightwothree
//     abcone2threexyz
//     xtwone3four
//     4nineeightseven2
//     zoneight234
//     7pqrstsixteen

// In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76.
// Adding these together produces 281.

// What is the sum of all of the calibration values?

const { last } = require('lodash');
const { parseTokens, sum } = require('../lib');

const numberTokens = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
};

module.exports = (_, rawInputs) => {
  const numbers = rawInputs
    .split('\n')
    .map(line => parseTokens(line, numberTokens))
    .map(nums => [nums[0], last(nums)].join(''))
    .map(Number);

  return sum(numbers);
};

// Your puzzle answer was 52834.
