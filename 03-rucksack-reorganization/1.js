'use strict';

// --- Day 3 ---

const { sum } = require('../lib');


const split = rucksack => [rucksack.slice(0, rucksack.length / 2), rucksack.slice(rucksack.length / 2)]

const item = ([first, second]) => second.split('').find(c => first.includes(c));

const point = char => {
  const code = char.charCodeAt(0)
  if (code < 91) {
    return code - 38;
  }
  return code - 96;
}

module.exports = (inputs) => {

  return sum(inputs.map(split).map(item).map(point));
};
