/**
 * --- Advent of Code 2023 ---
 *
 * Day 10: Pipe Maze
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/10#part2
 */

import { last } from 'lodash-es';
import { coordsOf, eachMatrix, eachAdjacent } from '../lib/index.js';

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

const sumCoords = ([x1, y1], [x2, y2]) => {
  return [x1 + x2, y1 + y2];
}

// Get the connected coordinates to a particular tile
const getConnections = (map, [x, y]) => {
  const tile = map[y][x];
  const relativeConnections = PIPE_CONNECTIONS[tile];

  if (!relativeConnections) {
    return [];
  }

  return relativeConnections.map(diff => sumCoords([x, y], diff));
};

// Get the next connected coordinates in a part
const getNext = (map, coords, lastCoords) => {
  return getConnections(map, coords).find(conn => !isSameLocation(conn, lastCoords));
};

// Create a new map with additional rows and columns added between each existing
// row and column. Each new cell will either be a "x", indicating empty space,
// or be a "|" or "-" to indicate a connection with pipes from the original rows
// and columns.
const expandMap = (map) => {
  // The original rows of the map with expanded cells between each item
  const expandedRows = [];

  for (let y = 0; y < map.length; y += 1) {
    expandedRows.push([]);

    for (let x = 1; x < map[y].length; x += 1) {
      const left = map[y][x - 1];
      const right = map[y][x];

      last(expandedRows).push(left);

      if (['-', 'F', 'L'].includes(left) && ['-', '7', 'J'].includes(right)) {
        last(expandedRows).push('-');
      } else {
        last(expandedRows).push('x');
      }
    }
    last(expandedRows).push(map[y][map[y].length - 1]);
  }

  // The fully expanded map, including new rows made entirely of expanded cells
  const expanded = [];

  for (let y = 1; y < expandedRows.length; y += 1) {
    expanded.push(expandedRows[y - 1]);
    expanded.push([]);

    for (let x = 0; x < expandedRows[y].length; x += 1) {
      const top = expandedRows[y - 1][x];
      const bottom = expandedRows[y][x];

      if (['|', 'F', '7'].includes(top) && ['|', 'L', 'J'].includes(bottom)) {
        last(expanded).push('|');
      } else {
        last(expanded).push('x');
      }
    }
  }

  expanded.push(last(expandedRows));
  return expanded;
};

// Find the coordinates of a spot along the border that is empty
const findOutside = (map) => {
  const lastCol = map[0].length - 1;
  const lastRow = map.length - 1;

  for (let x = 0; x <= lastCol; x += 1) {
    if (map[0][x] === '.' || map[0][x] === 'x') {
      return [x, 0];
    }
    if (map[lastRow][x] === '.' || map[lastRow][x] === 'x') {
      return [x, lastRow];
    }
  }

  for (let y = 0; y <= lastRow; y += 1) {
    if (map[y][0] === '.' || map[y][0] === 'x') {
      return [0, y];
    }
    if (map[y][lastCol] === '.' || map[y][lastCol] === 'x') {
      return [lastCol, y];
    }
  }
}

// Aimple "flood" algorithm to mark every tile connected to outside with "X"
const markOutside = (map) => {
  const locations = [findOutside(map)];

  while (locations.length > 0) {
    const [x, y] = locations.pop();

    if (map[y][x] === '.' || map[y][x] == 'x') {
      map[y][x] = 'X';
      eachAdjacent(map, [x, y], (_, coords) => locations.push(coords));
    }
  }
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

  // Walk the loop and mark each section of pipe as an "X" on our map
  const map = matrix.map(line => [...line]);
  let [loc] = startConnections;
  let last = start;

  while (matrix[loc[1]][loc[0]] !== 'S') {
    map[loc[1]][loc[0]] = 'X';
    const next = getNext(matrix, loc, last);
    last = loc;
    loc = next;
  }

  map[start[1]][start[0]] = 'X';

  // Mark everything that is not in our pipe with a "."
  eachMatrix(map, (tile, [x, y]) => {
    if (tile !== 'X') {
      map[y][x] = '.';
    }
  });

  // Put the original pipe tiles back
  eachMatrix(map, (tile, [x, y]) => {
    if (tile === 'X') {
      map[y][x] = matrix[y][x];
    }
  });

  // Replace "S" with correct pipe
  const startPipe = Object.entries(PIPE_CONNECTIONS)
    .map(([pipe, connections]) => {
      return [pipe, connections.map(diff => sumCoords(diff, start))];
    })
    .filter(([_, locations]) => {
      return locations.every(loc => startConnections.some(conn => isSameLocation(loc, conn)));
    })
    .map(([pipe]) => pipe)[0];

  map[start[1]][start[0]] = startPipe;

  // Expand the map and then mark all outside tiles
  const expanded = expandMap(map);
  markOutside(expanded);

  // Count the remaining "." tiles, which will correspond to spots in the
  // original matrix which were inside the pipe maze
  let count = 0;

  eachMatrix(expanded, (tile) => {
    if (tile === '.') {
      count += 1;
    }
  });

  return count;
}
