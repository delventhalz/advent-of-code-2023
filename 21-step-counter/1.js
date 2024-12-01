/**
 * --- Advent of Code 2023 ---
 *
 * Day 21: Step Counter
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/21
 */

import { uniq } from 'lodash-es';
import { eachMatrix, eachAdjacent, matrixToString } from '../lib/index.js';


export default function main({ matrix }) {
  let start;

  eachMatrix(matrix, (tile, coords) => {
    if (tile === 'S') {
      start = coords;
    }
  });

  matrix[start[1]][start[0]] = '.';

  let alive = [start];

  for (let step = 0; step < 64; step += 1) {
    const nextAlive = [];
    // const map = structuredClone(matrix);
    // for (const [x, y] of alive) {
    //   map[y][x] = 'O';
    // };
    // console.log(matrixToString(map));
    // console.log();

    while (alive.length > 0) {
      const coords = alive.pop();
      // console.log(coords, '|>')

      eachAdjacent(matrix, coords, (tile, nextCoords) => {
        // console.log('  ', nextCoords, tile);
        if (tile === '.') {
          nextAlive.push(nextCoords.join(','));
        }
      });
      // console.log();
    }

    alive = uniq(nextAlive).map(coordsString => coordsString.split(',').map(Number));
  }
    // const map = structuredClone(matrix);
    // for (const [x, y] of alive) {
    //   map[y][x] = 'O';
    // };
    // console.log(matrixToString(map));
    // console.log()
  return alive.length;
}
