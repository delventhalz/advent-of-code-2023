/**
 * --- Advent of Code 2023 ---
 *
 * Day 10: Pipe Maze
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/10#part2
 */

import { last  } from 'lodash-es';
import { eachMatrix, eachAdjacent, matrixToString } from '../lib/index.js';

const PIPES = {
  '|': [[0, 1], [0, -1]],
  '-': [[1, 0], [-1, 0]],
  'L': [[0, -1], [1, 0]],
  'J': [[0, -1], [-1, 0]],
  '7': [[0, 1], [-1, 0]],
  'F': [[0, 1], [1, 0]]
};

const findStart = (matrix) => {
  let start = null;
  eachMatrix(matrix, (tile, coords) => {
    if (tile === 'S') {
      start = coords;
    }
  })
  return start;
};

const isSameLocation = ([x1, y1], [x2, y2]) => {
  return x1 === x2 && y1 === y2;
};

const getNext = (pipe, [x, y], [lastX, lastY]) => {
  // console.log(pipe)
  const paths = PIPES[pipe].map(([pathX, pathY]) => [x + pathX, y + pathY]);

  if (paths[0][0] === lastX && paths[0][1] === lastY) {
    return paths[1];
  }

  return paths[0];
};

// const findSection = (matrix, [x, y]) => {
//   const tile = matrix[y][x];
//   if (tile === '.' && (x === 0 || y === 0 }|| x === matrix[0].length || y === matrix.length)) {
//     return 0;
//   }
//   if (typeof tile === 'number') {
//     return tile;
//   }

// }

const expandMap = (map) => {
  const expandedX = [];

  for (let y = 0; y < map.length; y += 1) {
    expandedX.push([]);

    for (let x = 1; x < map[y].length; x += 1) {
      const left = map[y][x - 1];
      const right = map[y][x];

      last(expandedX).push(left);

      if (['-', 'F', 'L'].includes(left) && ['-', '7', 'J'].includes(right)) {
        last(expandedX).push('-');
      } else {
        last(expandedX).push('x');
      }
    }
    last(expandedX).push(map[y][map[y].length - 1]);
  }

  const expanded = [];

  for (let y = 1; y < expandedX.length; y += 1) {
    expanded.push(expandedX[y -1]);
    expanded.push([]);

    for (let x = 0; x < expandedX[y].length; x += 1) {
      const top = expandedX[y - 1][x];
      const bottom = expandedX[y][x];

      if (['|', 'F', '7'].includes(top) && ['|', 'L', 'J'].includes(bottom)) {
        last(expanded).push('|');
      } else {
        last(expanded).push('x');
      }
    }
  }

  expanded.push(last(expandedX));

  return expanded;
};

const flood = (matrix) => {
  const locations = [[0, 0]];

  while (locations.length > 0) {
    const [x, y] = locations.pop();
    const tile = matrix[y][x];

    if (tile === '.' || tile == 'x') {
      matrix[y][x] = 'X';
      eachAdjacent(matrix, [x, y], (_, coords) => locations.push(coords));
    }
  }
};

export default function main({ matrix }) {
  const map = matrix.map(line => [...line]);
  const start = findStart(matrix);

  const locations = [];

  eachAdjacent(matrix, start, (tile, [x, y]) => {
    if (!PIPES[tile]) {
      return;
    }
    const [a, b] = PIPES[tile].map(([pathX, pathY]) => [x + pathX, y + pathY]);
    if (a[0] === start[0] && a[1] === start[1]) {
      locations.push([x, y]);
    } else if (b[0] === start[0] && b[1] === start[1]) {
      locations.push([x, y]);
    }
  });

  let [locA, locB] = locations;
  let lastA = start;
  let lastB = start;

  map[start[1]][start[0]] = 'X';

  while (!isSameLocation(locA, locB)) {
    const nextA = getNext(matrix[locA[1]][locA[0]], locA, lastA);
    const nextB = getNext(matrix[locB[1]][locB[0]], locB, lastB);
    map[locA[1]][locA[0]] = 'X';
    map[locB[1]][locB[0]] = 'X';

    lastA = locA;
    lastB = locB;
    locA = nextA;
    locB = nextB;
  }
  map[locA[1]][locA[0]] = 'X';


  eachMatrix(map, (tile, [x, y]) => {
    if (tile !== 'X') {
      map[y][x] = '.'
    }
  });

  eachMatrix(map, (tile, [x, y]) => {
    if (tile === 'X') {
      map[y][x] = matrix[y][x]
    }
  });

  map[start[1]][start[0]] = 'J';
  // map[start[1]][start[0]] = 'F';

  const expanded = expandMap(map);

  flood(expanded, [0, 0]);

  console.log(matrixToString(expanded))

  let count = 0;

  eachMatrix(expanded, (tile) => {
    if (tile === '.') {
      count += 1;
    }
  })

  return count;
}
