/**
 * --- Advent of Code 2023 ---
 *
 * Day 4: Scratchcards
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/4
 */

import { sum, count } from '../lib/index.js';


export default function main({ lines }) {
  const points = lines
    .map(line => line.split(': ')[1])
    .map(line => line.replaceAll('  ', ' '))
    .map(line => line.split(' | '))
    .map(sides => sides.map(side => side.split(' ').map(Number)))
    .map(([winners, mine]) => {
      const wonCount = count(mine, num => winners.includes(num));
      return wonCount === 0 ? 0 : 2 ** (wonCount - 1);
    });

  return sum(points);
}
