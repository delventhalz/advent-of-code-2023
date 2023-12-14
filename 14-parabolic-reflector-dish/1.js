/**
 * --- Advent of Code 2023 ---
 *
 * Day 14: Parabolic Reflector Dish
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/14
 */

import { eachMatrix, eachUp } from '../lib/index.js';


export default function main({ matrix }) {
  let rolled = matrix.map(line => [...line]);

  eachMatrix(matrix, (tile, coords) => {
    if (tile === 'O') {
      let lastOpenSpot = coords;
      let stopped = false;

      eachUp(rolled, coords, (upTile, upCoords) => {
        if (!stopped && upTile === '.') {
          lastOpenSpot = upCoords;
        } else {
          stopped = true;
        }
      });

      rolled[coords[1]][coords[0]] = '.';
      rolled[lastOpenSpot[1]][lastOpenSpot[0]] = 'O';
    }
  });

  let load = 0;

  eachMatrix(rolled, (tile, [_, y]) => {
    if (tile === 'O') {
      load += rolled.length - y;
    }
  });

  return load;
}
