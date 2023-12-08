/**
 * --- Advent of Code 2023 ---
 *
 * Day 8: Haunted Wasteland
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/8
 */

import { leastCommonMultiple } from '../lib/index.js';


export default function main({ input }) {
  const [directionString, mapString] = input.split('\n\n');

  const mapArray = mapString
    .split('\n')
    .map(line => line.split(' = '))
    .map(([source, destinations]) => [source, destinations.slice(1, -1).split(', ')]);

  const directions = directionString.split('');
  const map = Object.fromEntries(mapArray);

  const locations = mapArray
    .map(([source]) => source)
    .filter(source => source.endsWith('A'));

  const starts = locations.slice();

  const zs = [[], [], [], [], [], []];
  const diffs = [];

  let steps = 0;

  while (true) {
    const direction = directions[steps % directions.length];

    for (let i = 0; i < locations.length; i += 1) {
      if (direction === 'L') {
        locations[i] = map[locations[i]][0]
      } else {
        locations[i] = map[locations[i]][1]
      }

      if (locations[i].endsWith('Z')) {
        console.log(`@${i} = Z:`, steps);
        zs[i].push(steps)
      }

      if (locations[i] === starts[i]) {
        console.log(`@${i} RESET:`, steps);
      }
    }

    if (zs.every(z => z.length > 2)) {
      for (const z of zs) {
        diffs.push(z[1] - z[0]);
      }
      return leastCommonMultiple(...diffs);
    }

    if (locations.every(loc => loc.endsWith('Z'))) {
      return steps;
    }

    steps += 1;
  }
}
