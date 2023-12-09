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
  const map = Object.fromEntries(mapArray);

  const directions = directionString
    .split('')
    .map(dir => dir === 'L' ? 0 : 1);
  const locations = mapArray
    .map(([source]) => source)
    .filter(source => source.endsWith('A'));

  const zs = [[], [], [], [], [], []];
  let steps = 0;

  while (zs.some(z => z.length < 2)) {
    const dir = directions[steps % directions.length];

    for (let i = 0; i < locations.length; i += 1) {
      locations[i] = map[locations[i]][dir]

      if (locations[i].endsWith('Z')) {
        zs[i].push(steps)
      }
    }

    steps += 1;
  }

  return leastCommonMultiple(...zs.map(z => z[1] - z[0]));
}
