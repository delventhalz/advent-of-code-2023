'use strict';

/**
 * --- Advent of Code 2023 ---
 *
 * Day 2: Cube Conundrum
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/2
 */

const { sum } = require('../lib');


const MAX_CUBES = {
  red: 12,
  green: 13,
  blue: 14
};

const parseCube = (cubeString) => {
  const [count, color] = cubeString.split(' ');
  return [color, Number(count)];
};

const parsePull = (pullString) => {
  return Object.fromEntries(pullString.split(', ').map(parseCube));
};

const isValidPull = (pull) => {
  return Object.entries(pull).every(([color, count]) => MAX_CUBES[color] >= count);
};


module.exports = (_, rawInputs) => {
  const gameIds = rawInputs
    .split('\n')
    .map(game => game.split(': '))
    .map(([label, pulls]) => ({
      id: Number(label.slice(5)),
      pulls: pulls.split('; ').map(parsePull)
    }))
    .filter(({ pulls }) => pulls.every(isValidPull))
    .map(line => line.id);

  return sum(gameIds);
};

// Your puzzle answer was 2632.
