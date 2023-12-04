/**
 * --- Advent of Code 2023 ---
 *
 * Day 4: Scratchcards
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/4#part2
 */

import { sum } from '../lib/index.js';


export default function main({ lines }) {
  const cards = lines
    .map(line => line.split(': ')[1])
    .map(numbers => numbers.replaceAll('  ', ' '))
    .map(numbers => numbers.split(' | '))
    .map(numbers => numbers.map(nums => nums.split(' ').map(Number)));

  const cardCounts = cards.map(() => 1);

  cards.forEach(([winners, mine], index) => {
    const myWinners = mine.filter(num => winners.includes(num)).length;

    for (let i = index + 1; i <= index + myWinners.length; i += 1) {
      cardCounts[i] += cardCounts[index];
    }
  });

  return sum(cardCounts);
}

// Your puzzle answer was 6050769.
