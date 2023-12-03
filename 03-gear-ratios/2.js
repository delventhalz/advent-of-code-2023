'use strict';

// --- Part Two ---

// The engineer finds the missing part and installs it in the engine! As the
// engine springs to life, you jump in the closest gondola, finally ready to
// ascend to the water source.

// You don't seem to be going very fast, though. Maybe something is still wrong?
// Fortunately, the gondola has a phone labeled "help", so you pick it up and
// the engineer answers.

// Before you can explain the situation, she suggests that you look out the
// window. There stands the engineer, holding a phone in one hand and waving
// with the other. You're going so slowly that you haven't even left the
// station. You exit the gondola.

// The missing part wasn't the only issue - one of the gears in the engine is
// wrong. A gear is any * symbol that is adjacent to exactly two part numbers.
// Its gear ratio is the result of multiplying those two numbers together.

// This time, you need to find the gear ratio of every gear and add them all up
// so that the engineer can figure out which gear needs to be replaced.

// Consider the same engine schematic again:

//     467..114..
//     ...*......
//     ..35..633.
//     ......#...
//     617*......
//     .....+.58.
//     ..592.....
//     ......755.
//     ...$.*....
//     .664.598..

// In this schematic, there are two gears. The first is in the top left; it has
// part numbers 467 and 35, so its gear ratio is 16345. The second gear is in
// the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a
// gear because it is only adjacent to one part number.) Adding up all of the
// gear ratios produces 467835.

// What is the sum of all of the gear ratios in your engine schematic?

// const {  } = require('lodash');
const { eachMatrix, eachSurrounding, sum, matrixToString } = require('../lib');

const isDigit = char => /[0-9]/.test(char);
const isSymbol = char => char !== '.' && !isDigit(char);
const isGear = char => char === '*';

const extractNumber = (matrix, [x, y]) => {
  let start = x;

  while (isDigit(matrix[y][start])) {
    start -= 1;
  }

  // start will end up one too small
  let current = start + 1
  let number = '';

  while (isDigit(matrix[y][current])) {
    number += matrix[y][current];
    matrix[y][current] = 'X';
    current += 1;
  }

  return Number(number);
};

module.exports = (inputs) => {
  const matrix = inputs.map(line => line.split(''));
  const numbers = [];

  eachMatrix(matrix, (char, coords) => {
    if (isGear(char)) {
      const parts = [];

      eachSurrounding(matrix, coords, (adj, adjCoords) => {
        if (isDigit(adj)) {
          parts.push(extractNumber(matrix, adjCoords));
        }
      });

      if (parts.length === 2) {
        numbers.push(parts[0] * parts[1]);
      }
    }
  });

  console.log(matrixToString(matrix));
  console.log(numbers);

  return sum(numbers);
};

// Your puzzle answer was 84399773.
