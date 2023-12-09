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
}

const findNextValue = (history) => {
  if (history.every(entry => entry === history[0])) {
    return [...history, history[0]];
  }

  const diffs = findDifferences(history);
  const next = findNextValue(diffs);
  return [...history, last(next) + last(history)];
}

export default function main({ lines }) {
  const histories = lines.map(line => line.split(' ').map(Number));
  const next = histories.map(findNextValue).map(last);
  return sum(next);
}
