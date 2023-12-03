/**
 * --- Advent of Code 2023 ---
 *
 * Day 1: Trebuchet?!
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/1
 */

import { parseIfNumber, sum } from '../lib/index.js';


export default function main({ input }) {
  const numbers = input
    .split('\n')
    .map(input => [
      input.split('').find(n => typeof parseIfNumber(n) === 'number'),
      input.split('').reverse().find(n => typeof parseIfNumber(n) === 'number'),
    ].join(''))
    .map(Number);

  return sum(numbers);
}

// Your puzzle answer was 53334.
