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
const { parseIfNumber, sum } = require('../lib');


const lineToNumbers = (line) => {
  const numbers = [];

  for (let i = 0; i < line.length; i += 1) {
    const parsed = parseIfNumber(line[i]);

    const nextThree = line.slice(i, i + 3);
    const nextFour = line.slice(i, i + 4);
    const nextFive = line.slice(i, i + 5);

    if (typeof parsed === 'number') {
      numbers.push(parsed);
    } else if (nextThree === 'one') {
      numbers.push(1);
      i += 2;
    } else if (nextThree === 'two') {
      numbers.push(2);
      i += 2;
    } else if (nextThree === 'six') {
      numbers.push(6);
      i += 2;
    } else if (nextFour === 'four') {
      numbers.push(4);
      i += 3;
    } else if (nextFour === 'five') {
      numbers.push(5);
      i += 3;
    } else if (nextFour === 'nine') {
      numbers.push(9);
      i += 3;
    } else if (nextFive === 'three') {
      numbers.push(3);
      i += 4;
    } else if (nextFive === 'seven') {
      numbers.push(7);
      i += 4;
    } else if (nextFive === 'eight') {
      numbers.push(8);
      i += 4;
    }
  }

  return numbers;
};


module.exports = (_, rawInputs) => {
  const numbers = rawInputs
    .split('\n')
    .map(lineToNumbers)
    .map(nums => [nums[0], last(nums)].join(''))
    .map(Number);

  return sum(numbers);
};

// Your puzzle answer was 52834.
