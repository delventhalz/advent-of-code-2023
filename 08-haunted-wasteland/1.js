/**
 * --- Advent of Code 2023 ---
 *
 * Day 8: Haunted Wasteland
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/8
 */

export default function main({ input }) {
  const [directionString, mapString] = input.split('\n\n');

  const mapArray = mapString
    .split('\n')
    .map(line => line.split(' = '))
    .map(([source, destinations]) => [source, destinations.slice(1, -1).split(', ')]);

  const directions = directionString.split('').map(dir => dir === 'L' ? 0 : 1);
  const map = Object.fromEntries(mapArray);

  let steps = 0;
  let loc = 'AAA';

  while (loc !== 'ZZZ') {
    const dir = directions[steps % directions.length];
    loc = map[loc][dir]
    steps += 1;
  }

  return steps;
}
