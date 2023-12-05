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

    for (const currentRange of currentRanges) {
      const remainingRanges = [currentRange];

      while (remainingRanges.length > 0) {
        const [remaining, remainingSize] = remainingRanges.shift();
        let isConsumed = false; // this is so hacky

        for (const [source, dest, size] of map) {
          const isStartBetween = between(remaining, source, source + size);
          const isEndBetween = between(remaining + remainingSize, source, source + size);

          // Outside this range and past a possible match, push unmodified
          if (!isStartBetween && !isEndBetween && remaining < source) {
            nextRanges.push([remaining, remainingSize]);
            isConsumed = true;
            break;
          }

          // End is within this range, split between unmodified and map
          if (!isStartBetween && isEndBetween) {
            const unmodifiedSize = source - remaining;
            nextRanges.push([remaining, unmodifiedSize]);
            nextRanges.push([dest, remainingSize - unmodifiedSize]);
            isConsumed = true;
            break;
          }

          // Entirely inside this range, map whole thing
          if (isStartBetween && isEndBetween) {
            const diff = remaining - source;
            nextRanges.push([dest + diff, remainingSize]);
            isConsumed = true;
            break;
          }

          // Start is within this range, split between map and next
          if (isStartBetween && !isEndBetween) {
            const diff = remaining - source;
            const end = source + size;
            const mappedSize = end - remaining;
            nextRanges.push([dest + diff, mappedSize]);
            remainingRanges.push([end, remainingSize - mappedSize]);
            isConsumed = true;
            break;
          }

          // Outside this range but maybe not the next one, check next
          if (!isStartBetween && !isEndBetween && remaining > source) {
            continue;
          }
        }

        if (!isConsumed) {
          nextRanges.push([remaining, remainingSize]);
        }
      }
    }

    // Not sure if sorting it actually matters here but yolo
    currentRanges = nextRanges.sort((a, b) => a[0] - b[0]);
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
