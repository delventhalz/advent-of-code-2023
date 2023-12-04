/**
 * --- Advent of Code 2023 ---
 *
 * Day 4: Scratchcards
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/4
 */

import { sum } from '../lib/index.js';


export default function main({ lines }) {
  const points = lines
    .map(line => line.split(': ')[1])
    .map(numbers => numbers.replaceAll('  ', ' '))
    .map(numbers => numbers.split(' | '))
    .map(numbers => numbers.map(nums => nums.split(' ').map(Number)))
    .map(([winners, mine]) => {
      const myWinners = mine.filter(num => winners.includes(num));
      return myWinners.length === 0 ? 0 : 2 ** (myWinners.length - 1);
    });

  return sum(points);
}

// Your puzzle answer was 21158.
