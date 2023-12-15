/**
 * --- Advent of Code 2023 ---
 *
 * Day 15: Lens Library
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/15#part2
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
  const commands = input.split(',');
  const boxes = Array(256).fill(null).map(() => []);

  for (const command of commands) {
    if (command.endsWith('-')) {
      const label = command.slice(0, -1);
      const hash = aocHash(label);
      boxes[hash] = boxes[hash].filter(lens => lens.label !== label);
    } else {
      const [label, focalString] = command.split('=');
      const focalLength = Number(focalString);
      const hash = aocHash(label);
      const index = boxes[hash].findIndex(lens => lens.label === label);
      if (index === -1) {
        boxes[hash].push({ label, focalLength });
      } else {
        boxes[hash][index].focalLength = focalLength;
      }
    }
  }

  const focusingPowers = boxes.flatMap((box, hash) => {
    return box.map(({ focalLength }, index) => (1 + hash) * (1 + index) * focalLength);
  })

  return sum(focusingPowers);
}
