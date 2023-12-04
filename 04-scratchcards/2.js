/**
 * --- Advent of Code 2023 ---
 *
 * Day 4: Scratchcards
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/4#part2
 */

import { sum, count } from '../lib/index.js';


export default function main({ lines }) {
  const cards = lines
    .map(line => line.split(': ')[1])
    .map(line => line.replaceAll('  ', ' '))
    .map(line => line.split(' | '))
    .map(sides => sides.map(side => side.split(' ').map(Number)));

  const cardCounts = cards.map(() => 1);

  cards.forEach(([winners, mine], index) => {
    const wonCount = count(mine, num => winners.includes(num));

    for (let i = index + 1; i <= index + wonCount; i += 1) {
      cardCounts[i] += cardCounts[index];
    }
  });

  return sum(cardCounts);
}

// Your puzzle answer was 6050769.
