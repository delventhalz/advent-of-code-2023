/**
 * --- Advent of Code 2023 ---
 *
 * Day 6: Wait For It
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/6#part2
 */


export default function main({ input }) {
  const [time, distance] = input
    .replaceAll(' ', '')
    .split('\n')
    .map(line => Number(line.split(':')[1]));

  let count = 0;

  for (let hold = 0; hold < time; hold += 1) {
    const reached = (time - hold) * hold;

    if (reached > distance) {
      count += 1;
    }
  }

  return count;
}
