/**
 * --- Advent of Code 2023 ---
 *
 * Day 18: Lavaduct Lagoon
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/18#part2
 */

// import {  } from 'lodash-es';
import { sum, fillMatrix, mapMatrix, matrixToString, shiftMatrix, eachAdjacent } from '../lib/index.js';

const toDir = (int) => {
  switch (int) {
    case '0':
      return 'R';
    case '1':
      return 'D';
    case '2':
      return 'L';
    case '3':
      return 'U';
    default:
      throw new Error(`Bad int: ${int}`);
  }
};

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
};

const getRowArea = (row, prevRow = []) => {
  const prevRowSet = new Set(prevRow);
  let isFilled = false;
  let area = 0;

  // console.log(row);

  for (let i = 0; i < row.length; i += 1) {
    // console.log();
    const start = i;
    let end = i;
    while (row[end + 1] - row[end] <= 1) {
      end += 1;
    }

    // console.log({ i, start, end, isFilled });

    i += end - start;


    const prevX = row[start - 1];
    const startX = row[start];
    const endX = row[end];

    // console.log({ prevX, startX, endX })

    area += endX - startX;

    // console.log('area +=', endX - startX);

    if (start === end) {
      // console.log('{start === end} area +=', isFilled ? startX - prevX : 1);
      area += isFilled ? startX - prevX : 1;
      isFilled = !isFilled;
      continue;
    }

    const startAbove = prevRowSet.has(startX);
    const endAbove = prevRowSet.has(endX);

    if (startAbove !== endAbove) {
      // console.log('{startAbove !== endAbove} area +=', isFilled ? startX - prevX : 1);
      area += isFilled ? startX - prevX : 1;
      isFilled = !isFilled;
      continue;
    }

    if (startAbove === endAbove) {
      // console.log('{startAbove === endAbove} area +=', isFilled ? startX - prevX : 1);
      area += isFilled ? startX - prevX : 1;
      continue;
    }

    throw new Error(`Bad area: ${isFilled} ${[prevX, prevAbove, prevBelow]} ${[nextX, nextAbove, nextBelow]}`);
  }

  // console.log(area);
  // console.log();
  //   console.log();
  //   console.log();

  return area;
};

export default function main({ lines }) {
  const directions = lines
    .map(line => line.split(' '))
    // .map(([dir, count]) => [dir, Number(count)]);
    .map(([_, __, hex]) => hex.slice(2, - 1))
    .map(hex => [toDir(hex[5]), Number.parseInt(hex.slice(0, 5), 16)]);

  // return sum(directions.map(([_, count]) => count));
    return directions[121]
  console.log('Pathing...');


  const path = { 0: [0] };
  let location = [0, 0];

  // console.log('START:');
  // console.log(matrixToString(mapMatrix(fillMatrix(shiftMatrix(map)), t => t || '.')));
  // console.log();

  // for (const [dir, count] of directions) {
  directions.forEach(([dir, count], i) => {
    console.log(i, 'of', directions.length);
    let [x, y] = location;
    const [deltaX, deltaY] = getDelta(dir);

    for (let i = 1; i <= count; i += 1) {
      const nextX = x + deltaX * i;
      const nextY = y + deltaY * i;

      if (!path[nextY]) {
        path[nextY] = [];
      }

      path[nextY].push(nextX);
      location = [nextX, nextY];
    }
  });
  // }
  console.log();
  console.log('Sorting...');

  for (const xCoords of Object.values(path)) {
    xCoords.sort((a, b) => a - b);
  }

  // console.log(path);

  console.log();
  console.log('Calculating area...');

  const keys = Object.keys(path);

  let area = 0;

  keys.forEach((y, i) => {
    console.log(i, 'of', keys.length, ':');
    const rowArea = getRowArea(path[y], path[y - 1]);
    console.log(rowArea);
    console.log();
    area += rowArea;
  });

  // for (const y of Object.keys(path)) {
    // console.log('[[', y, ']]');
  //   area += getRowArea(path[y], path[y - 1]);
  // };

  return area;

  // map = fillMatrix(shiftMatrix(map));
  // console.log(matrixToString(mapMatrix(map, t => t || '.')));
  // console.log();

  // const toFlood = [
  //   [Math.floor(map[0].length / 2), Math.floor(map.length / 2)],
  //   // [map[0].length - 1, 0],
  //   // [0, map.length - 1],
  //   // [map[0].length - 1, map.length - 1]
  // ];

  // while (toFlood.length > 0) {
  //   const [x, y] = toFlood.pop();

  //   if (map[y][x] === undefined) {
  //     map[y][x] = '#';
  //     eachAdjacent(map, [x, y], (_, coords) => {
  //       toFlood.push(coords);
  //     });
  //   }
  // }

  // map = mapMatrix(map, tile => tile || '#');


  // console.log(matrixToString(mapMatrix(map, t => t || '.')));
  // console.log(matrixToString(map));

  // return map.flat().filter(t => t === '#').length;
}
