/**
 * --- Advent of Code 2023 ---
 *
 * Day 5: If You Give A Seed A Fertilizer
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/5#part2
 */

import { chunk } from 'lodash-es';
import { least, between } from '../lib/index.js';

const followMaps = (maps, seedRange) => {
  let currentRanges = [seedRange];

  for (const map of maps) {
    const nextRanges = [];

    for (let [current, currentSize] of currentRanges) {
      let isConsumed = false; // this is so hacky

      for (const [source, dest, size] of map) {
        const isStartBetween = between(current, source, source + size);
        const isEndBetween = between(current + currentSize, source, source + size);

        // Outside this range and past a possible match, push unmodified
        if (!isStartBetween && !isEndBetween && current < source) {
          nextRanges.push([current, currentSize]);
          isConsumed = true;
          break;
        }

        // End is within this range, split between unmodified and destination
        if (!isStartBetween && isEndBetween) {
          const unmodifiedSize = source - current;
          nextRanges.push([current, unmodifiedSize]);
          nextRanges.push([dest, currentSize - unmodifiedSize]);
          isConsumed = true;
          break;
        }

        // Entirely inside this range, map whole thing
        if (isStartBetween && isEndBetween) {
          const diff = current - source;
          nextRanges.push([dest + diff, currentSize]);
          isConsumed = true;
          break;
        }

        // Start is within this range, split between destination and next check
        if (isStartBetween && !isEndBetween) {
          const diff = current - source;
          const end = source + size;
          const mappedSize = end - current;
          nextRanges.push([dest + diff, mappedSize]);
          current = end;
          currentSize -= mappedSize;
          continue;
        }

        // Outside this range but maybe not the next one, check next
        if (!isStartBetween && !isEndBetween && current > source) {
          continue;
        }
      }

      if (!isConsumed) {
        nextRanges.push([current, currentSize]);
      }
    }

    currentRanges = nextRanges;
  }

  return currentRanges;
}

export default function main({ parsed }) {
  const seeds = parsed[0][0]
    .split(': ')[1]
    .split(' ')
    .map(Number);

  const seedRanges = chunk(seeds, 2).sort((a, b) => a[0] - b[0]);

  const maps = parsed
    .slice(1)
    .map(lines => lines.slice(1).map(line => line.split(' ').map(Number)))
    .map(ranges => ranges.map(([dest, source, size]) => [source, dest, size]))
    .map(ranges => ranges.sort((a, b) => a[0] - b[0]));

  const locationRanges = seedRanges.flatMap(seedRange => followMaps(maps, seedRange));

  return least(locationRanges.map(([start]) => start));
}
