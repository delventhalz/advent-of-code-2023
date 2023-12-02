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

const isValidGame = (game) => {
  return Object.entries(game).every(([color, count]) => MAX_CUBES[color] && MAX_CUBES[color] >= count);
};

module.exports = (_, rawInputs) => {
  const games = rawInputs
    .split('\n')
    .map(line => line.split(': '))
    .map(([label, games]) => ({
      id: Number(label.slice(5)),
      games: games.split('; ').map(parseGame)
    }))
    .filter(({ games }) => games.every(isValidGame))
    .map(line => line.id);

  return sum(games);
};
