/**
 * --- Advent of Code 2023 ---
 *
 * Day 5: If You Give A Seed A Fertilizer
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/5
 */

import { least, between } from '../lib/index.js';

const followMaps = (maps, seed) => {
  let current = seed;

  for (const map of maps) {
    for (const [source, dest, size] of map) {
      if (between(current, source, source + size)) {
        const diff = current - source;
        current = dest + diff;
        break;
      }

      // We passed the last viable range, no change to current in this map
      if (current < source) {
        break;
      }
    }
  }

  return current;
}

export default function main({ parsed }) {
  const seeds = parsed[0][0]
    .split(': ')[1]
    .split(' ')
    .map(Number);

  const maps = parsed
    .slice(1)
    .map(lines => lines.slice(1).map(line => line.split(' ').map(Number)))
    .map(ranges => ranges.map(([dest, source, size]) => [source, dest, size]))
    .map(ranges => ranges.sort((a, b) => a[0] - b[0]));

  return least(seeds.map(seed => followMaps(maps, seed)));
}
