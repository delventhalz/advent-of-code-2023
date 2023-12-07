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
        const currentEnd = current + currentSize;
        const sourceEnd = source + size;
        const isStartBetween = between(current, source, sourceEnd);
        const isEndBetween = between(currentEnd, source, sourceEnd);

        // Larger than this range, split into three ranges
        if (!isStartBetween && !isEndBetween && current < source && currentEnd > sourceEnd) {
          // The section is past any possible matches, push it unmodified
          nextRanges.push([current, source]);

          // This section should be mapped to the destination
          const diff = current - source;
          nextRanges.push([dest + diff, size]);

          // This section may still match a future range, keep checking it
          current = sourceEnd;
          currentSize -= size;

          continue;
        }

        // Entirely before this range, past a possible match, push unmodified
        if (!isStartBetween && !isEndBetween && current < source) {
          nextRanges.push([current, currentSize]);
          isConsumed = true;
          break;
        }

        // Only end is within this range, split between unmodified and destination
        if (!isStartBetween && isEndBetween) {
          const unmodifiedSize = source - current;
          nextRanges.push([current, unmodifiedSize]);
          nextRanges.push([dest, currentSize - unmodifiedSize]);
          isConsumed = true;
          break;
        }

        // Entirely inside this range, map whole thing to destination
        if (isStartBetween && isEndBetween) {
          const diff = current - source;
          nextRanges.push([dest + diff, currentSize]);
          isConsumed = true;
          break;
        }

        // Pnly start is within range, split between destination and next check
        if (isStartBetween && !isEndBetween) {
          const diff = current - source;
          const mappedSize = sourceEnd - current;
          nextRanges.push([dest + diff, mappedSize]);
          current = sourceEnd;
          currentSize -= mappedSize;
          continue;
        }

        // Entirely after this range, may match next one, keep checking
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
