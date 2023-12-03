'use strict';

// --- Day 3 ---

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
