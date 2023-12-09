/**
 * --- Advent of Code 2023 ---
 *
 * Day 9: Mirage Maintenance
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/9#part2
 */

import { sum } from '../lib/index.js';


const findDifferences = (history) => {
  const diffs = [];

  for (let i = 1; i < history.length; i += 1) {
    diffs.push(history[i] - history[i - 1])
  }

  return diffs;
};

const findPrevValue = (history) => {
  // If every value is the same, we know the previous value in the sequence
  if (history.every(entry => entry === history[0])) {
    return history[0];
  }

  // If not, we can get the next value by adding the next diff
  const diffs = findDifferences(history);
  const prevDiff = findPrevValue(diffs);
  return history[0] - prevDiff;
};


export default function main({ lines }) {
  const histories = lines.map(line => line.split(' ').map(Number));
  const previousValues = histories.map(findPrevValue);
  return sum(previousValues);
}
