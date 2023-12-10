/**
 * --- Advent of Code 2023 ---
 *
 * Day 10: Pipe Maze
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/10
 */

import { coordsOf, eachAdjacent } from '../lib/index.js';


const PIPE_CONNECTIONS = {
  '|': [[0, 1], [0, -1]],
  '-': [[1, 0], [-1, 0]],
  'L': [[0, -1], [1, 0]],
  'J': [[0, -1], [-1, 0]],
  '7': [[0, 1], [-1, 0]],
  'F': [[0, 1], [1, 0]]
};

const isSameLocation = ([x1, y1], [x2, y2]) => {
  return x1 === x2 && y1 === y2;
};

const getConnections = (map, [x, y]) => {
  const tile = map[y][x];
  const relativeConnections = PIPE_CONNECTIONS[tile];

  if (!relativeConnections) {
    return [];
  }

  return relativeConnections.map(([diffX, diffY]) => [x + diffX, y + diffY]);
};

const getNext = (map, coords, lastCoords) => {
  return getConnections(map, coords).find(conn => !isSameLocation(conn, lastCoords));
};


export default function main({ matrix }) {
  const start = coordsOf(matrix, 'S');
  const startConnections = [];

  // Find the two tiles which connect to the start
  eachAdjacent(matrix, start, (tile, coords) => {
    const [connA, connB] = getConnections(matrix, coords);

    const isConnectedToStart = (connA && isSameLocation(start, connA))
      || (connB && isSameLocation(start, connB));

    if (isConnectedToStart) {
      startConnections.push(coords);
    }
  });

  // Begin at first connection and walk the loop
  let [loc] = startConnections;
  let steps = 1;
  let last = start;

  while (matrix[loc[1]][loc[0]] !== 'S') {
    const next = getNext(matrix, loc, last);
    last = loc;
    loc = next;
    steps += 1;
  }

  // Furthest point is half the length of the full loop
  return Math.ceil(steps / 2);
}
