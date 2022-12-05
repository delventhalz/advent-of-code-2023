'use strict';

// --- Day 5 ---

const { last } = require('lodash');


module.exports = (_, rawInput) => {
  const [stackString, instructionStrings] = rawInput.split('\n\n');

  const [indexString, ...contentStrings] = stackString.split('\n').reverse();

  const indexes = [];
  const stacks = {};

  for (let i = 0; i < indexString.length; i += 1) {
    const char = indexString[i];

    if (char !== ' ') {
      stacks[char] = [];
      indexes.push([char, i]);
    }
  }

  for (const contentString of contentStrings) {
    for (const [index, i] of indexes) {
      if (contentString[i] && contentString[i] !== ' ') {
        stacks[index].push(contentString[i]);
      }
    }
  }

  const instructions = instructionStrings.split('\n').map(str => {
    const [_, count, from, to] = str.match(/move (\d+) from (\d) to (\d)/);
    return [Number(count), from, to];
  });

  for (const [count, from, to] of instructions) {
    for (let i = 0; i < count; i += 1) {
      const crate = stacks[from].pop();
      if (crate) {
        stacks[to].push(crate);
      }
    }
  }

  return Object.values(stacks).map(last).join('');
};
