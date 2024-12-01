/**
 * --- Advent of Code 2023 ---
 *
 * Day 18: Lavaduct Lagoon
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/18
 */

// import {  } from 'lodash-es';
import { fillMatrix, mapMatrix, matrixToString, shiftMatrix, eachAdjacent } from '../lib/index.js';

const getDelta = (dir) => {
  switch (dir) {
    case 'R':
      return [1, 0];
    case 'D':
      return [0, 1];
    case 'L':
      return [-1, 0];
    case 'U':
      return [0, -1];
    default:
      throw new Error(`Bad dir: ${dir}`);
  }
}

export default function main({ lines }) {
  const directions = lines
    .map(line => line.split(' '))
    .map(([dir, count]) => [dir, Number(count)]);

  let map = [['#']];
  let location = [0, 0];

  // console.log('START:');
  // console.log(matrixToString(mapMatrix(fillMatrix(shiftMatrix(map)), t => t || '.')));
  // console.log();

  for (const [dir, count] of directions) {
    let [x, y] = location;
    const [deltaX, deltaY] = getDelta(dir);

    for (let i = 1; i <= count; i += 1) {
      const nextX = x + deltaX * i;
      const nextY = y + deltaY * i;

      if (!map[nextY]) {
        map[nextY] = [];
      }

      map[nextY][nextX] = '#';
      location = [nextX, nextY];
    }
  }

  map = fillMatrix(shiftMatrix(map));
  // console.log(matrixToString(mapMatrix(map, t => t || '.')));
  // console.log();

  const toFlood = [
    [Math.floor(map[0].length / 2), Math.floor(map.length / 2)],
    // [map[0].length - 1, 0],
    // [0, map.length - 1],
    // [map[0].length - 1, map.length - 1]
  ];

  while (toFlood.length > 0) {
    const [x, y] = toFlood.pop();

    if (map[y][x] === undefined) {
      map[y][x] = '#';
      eachAdjacent(map, [x, y], (_, coords) => {
        toFlood.push(coords);
      });
    }
  }

  // map = mapMatrix(map, tile => tile || '#');


  console.log(matrixToString(mapMatrix(map, t => t || '.')));
  // console.log(matrixToString(map));

  return map.flat().filter(t => t === '#').length;
}
