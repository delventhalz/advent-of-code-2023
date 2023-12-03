'use strict';

/**
 * --- Advent of Code 2023 ---
 *
 * Day 2: Cube Conundrum
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/2#part2
 */

const { sum } = require('../lib');


const parseCube = (cubeString) => {
  const [count, color] = cubeString.split(' ');
  return [color, Number(count)];
};

const parsePull = (pullString) => {
  return Object.fromEntries(pullString.split(', ').map(parseCube));
};

const toMinCubes = (pulls) => {
  const currentMins = { red: 0, green: 0, blue: 0 };

  for (const pull of pulls) {
    for (const [color, count] of Object.entries(pull)) {
      if (count > currentMins[color]) {
        currentMins[color] = count;
      }
    }
  }

  return currentMins;
};


module.exports = (_, rawInputs) => {
  const products = rawInputs
    .split('\n')
    .map(game => game.split(': '))
    .map(([label, pulls]) => ({
      id: Number(label.slice(5)),
      pulls: pulls.split('; ').map(parsePull)
    }))
    .map(({ pulls }) => toMinCubes(pulls))
    .map(mins => mins.red * mins.green * mins.blue)

  return sum(products);
};

// Your puzzle answer was 69629.
