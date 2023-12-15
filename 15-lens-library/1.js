/**
 * --- Advent of Code 2023 ---
 *
 * Day 15: Lens Library
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/15
 */

import { sum } from '../lib/index.js';


const aocHash = str => {
  let hash = 0;

  for (const char of str) {
    hash += char.charCodeAt(0);
    hash *= 17;
    hash = hash % 256;
  }

  return hash;
};


export default function main({ input }) {
  const hashes = input.split(',').map(aocHash);

  return sum(hashes);
}
