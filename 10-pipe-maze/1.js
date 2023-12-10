/**
 * --- Advent of Code 2023 ---
 *
 * Day 10: Pipe Maze
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/10
 */

// import {  } from 'lodash-es';
import { eachMatrix, eachAdjacent } from '../lib/index.js';

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


export default function main({ matrix }) {
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

  let stepsA = 1;
  let stepsB = 1;
  let [locA, locB] = locations;
  let lastA = start;
  let lastB = start;

  while (!isSameLocation(locA, locB)) {
    // console.log(locA, locB)
    const nextA = getNext(matrix[locA[1]][locA[0]], locA, lastA);
    const nextB = getNext(matrix[locB[1]][locB[0]], locB, lastB);
    lastA = locA;
    lastB = locB;
    locA = nextA;
    locB = nextB;

    stepsA += 1;
    stepsB += 1;
  }


  if (stepsA === stepsB) {
    return stepsA;
  }
  return [stepsA, stepsB];
}
