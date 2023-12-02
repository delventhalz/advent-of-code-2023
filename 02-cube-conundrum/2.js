'use strict';

// --- Day 2 ---

// const {  } = require('lodash');
const { sum } = require('../lib');

const MAX_CUBES = {
  red: 12,
  green: 13,
  blue: 14
};

const parseCubes = cubeString => {
  const [count, color] = cubeString.split(' ');
  return [color, Number(count)];
};

const parseGame = (gameString) => {
  return Object.fromEntries(gameString.split(', ').map(parseCubes));
};

const toMinCubes = (games) => {
  const maxes = { red: 0, green: 0, blue: 0 };

  for (const game of games) {
    for (const [color, count] of Object.entries(game)) {
      if (count > maxes[color]) {
        maxes[color] = count;
      }
    }
  }

  return maxes.red * maxes.green * maxes.blue;
}

module.exports = (_, rawInputs) => {
  const games = rawInputs
    .split('\n')
    .map(line => line.split(': '))
    .map(([label, games]) => ({
      id: Number(label.slice(5)),
      games: games.split('; ').map(parseGame)
    }))
    .map(({ games }) => toMinCubes(games));

  return sum(games);
};
