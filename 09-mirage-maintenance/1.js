/**
 * --- Advent of Code 2023 ---
 *
 * Day 9: Mirage Maintenance
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/9
 */

import { last } from 'lodash-es';
import { sum } from '../lib/index.js';


const findDifferences = (history) => {
  const diffs = [];

  for (let i = 1; i < history.length; i += 1) {
    diffs.push(history[i] - history[i - 1])
  }

  return diffs;
};

const findNextValue = (history) => {
  // If every value is the same, we know the next value in the sequence
  if (history.every(entry => entry === history[0])) {
    return history[0];
  }

  // If not, we can get the next value by adding the next diff
  const diffs = findDifferences(history);
  const nextDiff = findNextValue(diffs);
  return last(history) + nextDiff;
};


export default function main({ lines }) {
  const histories = lines.map(line => line.split(' ').map(Number));
  const nextValues = histories.map(findNextValue);
  return sum(nextValues);
}
