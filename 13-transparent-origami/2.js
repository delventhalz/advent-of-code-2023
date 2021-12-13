'use strict';

// --- Part Two ---

// Finish folding the transparent paper according to the instructions. The
// manual says the code is always eight capital letters.

// What code do you use to activate the infrared thermal imaging camera system?

const { uniq } = require('lodash');
const { matrixToString, fillMatrix, mapMatrix } = require('../lib');


const parseDots = input => input.split('\n').map(coords => coords.split(',').map(Number));

const parseFolds = input => input.split('\n').map(instruction => {
  const xFold = instruction.match(/x=(\d+)/)
  const yFold = instruction.match(/y=(\d+)/)
  return xFold
    ? { xFold: Number(xFold[1]) }
    : { yFold: Number(yFold[1]) };
});

const leftFolder = (xFold) => ([x, y]) => x > xFold ? [x - xFold - 1, y] : [xFold - x - 1, y];

const upFolder = (yFold) => ([x, y]) => y < yFold ? [x, y] : [x, yFold - (y - yFold)];

const dedupDots = dots => uniq(dots.map(String)).map(dot => dot.split(',').map(Number));

module.exports = (_, rawInput) => {
  const [start, end] = rawInput.split('\n\n');
  let dots = parseDots(start);
  const folds = parseFolds(end);

  for (const { xFold, yFold } of folds) {
    if (xFold !== undefined) {
      dots = dots.map(leftFolder(xFold));
    } else {
      dots = dots.map(upFolder(yFold));
    }

    dots = dedupDots(dots);
  }

  let output = [];
  for (const [x, y] of dots) {
    if (!output[y]) {
      output[y] = [];
    }
    output[y][x] = true;
  }

  output = mapMatrix(fillMatrix(output), point => point ? '#' : ' ')
  return matrixToString(output)
};

// Your puzzle answer was HZLEHJRK.
