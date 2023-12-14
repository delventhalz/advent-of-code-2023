/**
 * --- Advent of Code 2023 ---
 *
 * Day 14: Parabolic Reflector Dish
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/14#part2
 */

import {
  eachMatrix,
  eachUp,
  eachDown,
  eachLeft,
  eachRight,
  matrixToString
} from '../lib/index.js';


export default function main({ matrix }) {
  for (let i = 0; i < 1000000000; i += 1) {
    // This will never finish: look at the logs, find the cycle, and math it out
    console.log(`${i + 1}:`);

    eachMatrix(matrix, (tile, coords) => {
      if (tile === 'O') {
        let lastOpenSpot = coords;
        let stopped = false;

        eachUp(matrix, coords, (upTile, upCoords) => {
          if (!stopped && upTile === '.') {
            lastOpenSpot = upCoords;
          } else {
            stopped = true;
          }
        });

        matrix[coords[1]][coords[0]] = '.';
        matrix[lastOpenSpot[1]][lastOpenSpot[0]] = 'O';
      }
    });

    for (let x = 0; x < matrix[0].length; x += 1) {
      for (let y = 0; y < matrix.length; y += 1) {
        const tile = matrix[y][x];
        const coords = [x, y];

        if (tile === 'O') {
          let lastOpenSpot = coords;
          let stopped = false;

          eachLeft(matrix, coords, (leftTile, leftCoords) => {
            if (!stopped && leftTile === '.') {
              lastOpenSpot = leftCoords;
            } else {
              stopped = true;
            }
          });

          matrix[coords[1]][coords[0]] = '.';
          matrix[lastOpenSpot[1]][lastOpenSpot[0]] = 'O';
        }
      }
    }

    for (let y = matrix.length - 1; y >= 0; y -= 1) {
      for (let x = 0; x < matrix[0].length; x += 1) {
        const tile = matrix[y][x];
        const coords = [x, y];

        if (tile === 'O') {
          let lastOpenSpot = coords;
          let stopped = false;

          eachDown(matrix, coords, (downTile, downCoords) => {
            if (!stopped && downTile === '.') {
              lastOpenSpot = downCoords;
            } else {
              stopped = true;
            }
          });

          matrix[coords[1]][coords[0]] = '.';
          matrix[lastOpenSpot[1]][lastOpenSpot[0]] = 'O';
        }
      }
    }

    for (let x = matrix[0].length; x >= 0; x -= 1) {
      for (let y = 0; y < matrix.length; y += 1) {
        const tile = matrix[y][x];
        const coords = [x, y];

        if (tile === 'O') {
          let lastOpenSpot = coords;
          let stopped = false;

          eachRight(matrix, coords, (rightTile, rightCoords) => {
            if (!stopped && rightTile === '.') {
              lastOpenSpot = rightCoords;
            } else {
              stopped = true;
            }
          });

          matrix[coords[1]][coords[0]] = '.';
          matrix[lastOpenSpot[1]][lastOpenSpot[0]] = 'O';
        }
      }
    }

    let load = 0;

    eachMatrix(matrix, (tile, [_, y]) => {
      if (tile === 'O') {
        load += matrix.length - y;
      }
    });

    console.log(load);
    console.log();
  }

  let load = 0;

  eachMatrix(matrix, (tile, [_, y]) => {
    if (tile === 'O') {
      load += matrix.length - y;
    }
  });

  return load;
}
