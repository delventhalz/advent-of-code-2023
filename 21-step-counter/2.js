/**
 * --- Advent of Code 2023 ---
 *
 * Day 21: Step Counter
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/21#part2
 */

import { uniq } from 'lodash-es';
import { sum, eachMatrix, eachAdjacent, matrixToString, shiftMatrix, fillMatrix, mapMatrix } from '../lib/index.js';

const atMatrix = (matrix, [x, y]) => {
  const modX = x % matrix[0].length;
  const modY = y % matrix.length;
  const normalX = modX < 0 ? matrix[0].length + modX : modX;
  const normalY = modY < 0 ? matrix.length + modY : modY;
  // console.log([x, y], [normalX, normalY])
  return matrix[normalY][normalX];
}

export default function main({ matrix }) {
  const firstRow = [1000, 5788, 995];

  const topRowStart = [1000, 6709];
  const topRowEnd = [6706, 995];

  const middleRowStart = [5765];
  const middleRowEnd = [5755];

  const bottomRowStart = [980, 6683];
  const bottomRowEnd = [6676, 1000];

  const lastRow = [980, 5732, 1000];
  const filler = [7770, 7627];

  const count = (26501365 - 65) / 131;
  const gridSize = count * 2 + 1;

  let total = 0;

  for (let i = -count; i <= count; i += 1) {
    const preTotal = total;
    if (i === -count) {
      total += sum(firstRow);
    } else if (i < 0) {
      const fillerCount = gridSize - 2 * (Math.abs(i) - 1) - topRowStart.length - topRowEnd.length;
      total += sum(topRowStart);
      total += Math.ceil(fillerCount / 2) * filler[0];
      total += Math.floor(fillerCount / 2) * filler[1];
      total += sum(topRowEnd);
    } else if (i === 0) {
      const fillerCount = gridSize - middleRowEnd.length - middleRowStart.length;
      total += sum(middleRowStart);
      total += Math.ceil(fillerCount / 2) * filler[0];
      total += Math.floor(fillerCount / 2) * filler[1];
      total += sum(middleRowEnd);
    } else if (i < count) {
      const fillerCount = gridSize - 2 * (i - 1) - bottomRowStart.length - bottomRowEnd.length;
      total += sum(bottomRowStart);
      total += Math.ceil(fillerCount / 2) * filler[0];
      total += Math.floor(fillerCount / 2) * filler[1];
      total += sum(bottomRowEnd);
    } else if (i === count) {
      total += sum(lastRow);
    }
  }

  return total;


  // let count = 5;
  // let diff = 4;

  // for (let i = 0; i < 202300; i += 1) {
  //   diff += 4;
  //   count += diff;
  // }

  // const odds = Math.ceil(count / 2);
  // const evens = Math.floor(count / 2);

  // return odds * 7627 + evens * 7770;

  let start;

  console.log(matrix.length, matrix[0].length)

  eachMatrix(matrix, (tile, coords) => {
    if (tile === 'S') {
      start = coords;
    }
  });

  matrix[start[1]][start[0]] = '.';

  let alive = [start];
  // const filled = [];
  // const filledSet = new Set();
  // let nextFilled = [[0, 0]];

  for (let step = 1; step <= 26501365; step += 1) {
    const nextAlive = [];
    // const map = structuredClone(matrix);
    // for (const [x, y] of alive) {
    //   map[y][x] = 'O';
    // };
    // console.log(matrixToString(map));
    // console.log();

    while (alive.length > 0) {
      const [x, y] = alive.pop();

      if (atMatrix(matrix, [x + 1, y]) === '.') {
        nextAlive.push([x + 1, y].join(','));
      }
      if (atMatrix(matrix, [x, y + 1]) === '.') {
        nextAlive.push([x, y + 1].join(','));
      }
      if (atMatrix(matrix, [x - 1, y]) === '.') {
        nextAlive.push([x - 1, y].join(','));
      }
      if (atMatrix(matrix, [x, y - 1]) === '.') {
        nextAlive.push([x, y - 1].join(','));
      }

    }

    alive = uniq(nextAlive).map(coordsString => coordsString.split(',').map(Number));

    // for (const [dX, dY] of nextFilled) {
    //   const count = alive.filter(([x, y]) => (
    //     x >= 0 + dX * 131
    //       && x < 131 + dX * 131
    //       && y >= 0 + dY * 131
    //       && y < 131 + dY * 131
    //   )).length;

    //   if (count === 7627) {
    //     filled.push([[dX, dY], step % 2 === 0 ? 7770 : 7627]);
    //     filledSet.add([dX, dY].join());
    //     nextFilled.push([dX + 1, dY], [dX, dY + 1], [dX - 1, dY], [dX, dY - 1]);
    //   }
    //   if (count === 7770) {
    //     filled.push([[dX, dY], step % 2 === 0 ? 7627 : 7770]);
    //     filledSet.add([dX, dY].join());
    //     nextFilled.push([dX + 1, dY], [dX, dY + 1], [dX - 1, dY], [dX, dY - 1]);
    //   }
    // }

    // nextFilled = nextFilled.filter(mult => !filledSet.has(mult.join));
    // alive = alive.filter(([x, y]) => !filled.some(([dX, dY]) => (
    //   x >= 0 + dX * 131
    //     && x < 131 + dX * 131
    //     && y >= 0 + dY * 131
    //     && y < 131 + dY * 131
    // )));

    // const og = alive.filter(([x, y]) => x >= -131 && x < 0 && y >= 0 && y < 131);

    if ((step - 65) % 131 === 0) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const [x, y] of alive) {
        if (x < minX) {
          minX = x;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (y > maxY) {
          maxY = y;
        }
      }

      console.log(step, '|>');
      console.log('  TOTAL:', alive.length);
      console.log('  MIN X:', minX);
      console.log('  MAX X:', maxX);
      console.log('  MIN Y:', minY);
      console.log('  MAX Y:', maxY);

      const group = (step - 65) / 131 + 2;

      let grid = [];

      for (let mY = -group; mY <= group; mY += 1) {
        for (let mX = -group; mX <= group; mX += 1) {
          const count = alive.filter(([x, y]) => (
            x >= 0 + mX * 131
              && x < 131 + mX * 131
              && y >= 0 + mY * 131
              && y < 131 + mY * 131
          )).length;
          if (count > 0) {
            if (!grid[mY]) {
              grid[mY] = [];
            }
            grid[mY][mX] = count;
          }
        }
      }

      grid = shiftMatrix(grid)
      grid = fillMatrix(grid)
      grid = mapMatrix(grid, c => c || 0);
      grid = mapMatrix(grid, c => ' ' + String(c).padStart(4, ' ') + ' ');
      console.log('--- GRID ---')
      console.log(matrixToString(grid));

      console.log();
      console.log();
    }
  }
    // const map = structuredClone(matrix);
    // for (const [x, y] of alive) {
    //   map[y][x] = 'O';
    // };
    // console.log(matrixToString(map));
    // console.log()
  return alive.length;
}
