/**
 * --- Advent of Code 2023 ---
 *
 * Day 6: Wait For It
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/6
 */

import { zip } from 'lodash-es';


export default function main({ input }) {
  const [times, distances] = input
    .split('\n')
    .map(line => line.split(/\s+/).slice(1).map(Number));

  const races = zip(times, distances);

  const wins = races.map(([time, distance]) => {
    let count = 0;

    for (let hold = 0; hold < time; hold += 1) {
      const reached = (time - hold) * hold;

      if (reached > distance) {
        count += 1;
      }
    }

    return count;
  });

  return wins.reduce((product, count) => product * count);
}
