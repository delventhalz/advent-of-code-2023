/**
 * --- Advent of Code 2023 ---
 *
 * Day 1: Trebuchet?!
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/1#part2
 */

import { last } from 'lodash-es';
import { parseTokens, sum } from '../lib/index.js';

const numberTokens = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
};

export default function main({ input }) {
  const numbers = input
    .split('\n')
    .map(line => parseTokens(line, numberTokens))
    .map(nums => [nums[0], last(nums)].join(''))
    .map(Number);

  return sum(numbers);
}

// Your puzzle answer was 52834.
