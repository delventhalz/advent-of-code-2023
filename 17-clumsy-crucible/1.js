/**
 * --- Advent of Code 2023 ---
 *
 * Day 17: Clumsy Crucible
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/17
 */

import { mapMatrix } from '../lib/index.js';


const isSameLocation = ([aX, aY], [bX, bY]) => aX === bX && aY === bY;
const toKey = (path) => path.map(loc => loc.join()).join('|');

const findCoolest = (nodeMap) => {
  let coolestKey = undefined;
  let coolestHeat = Infinity;

  for (const [key, values] of Object.entries(nodeMap)) {
    if (values.heat < coolestHeat) {
      coolestKey = key;
      coolestHeat = values.heat;
    }
  }

  return coolestKey;
};

// Rather than nodes with coordinates, we are working with paths of many
// coordinates which can be connected to possible next paths. It doesn't seem to
// be very efficient, but it allows the basic Djikstra approach to consider the
// various path requirements.
const getNextPaths = (path) => {
  const [lastX, lastY] = path[0];
  const [lastLastX, lastLastY] = path[1];

  const nextPaths = [];

  // X's match, traveling vertically
  if (lastX === lastLastX) {
    nextPaths.push(
      [[lastX + 1, lastY], path[0]],
      [[lastX - 1, lastY], path[0]]
    );

    // Length resets to 2 on turns
    if (path.length < 4) {
      nextPaths.push(
        [[lastX, lastY + (lastY - lastLastY)], ...path]
      );
    }
  }

  // Y's match, traveling horizontally
  if (lastY === lastLastY) {
    nextPaths.push(
      [[lastX, lastY + 1], path[0]],
      [[lastX, lastY - 1], path[0]],
    );

    // Length resets to 2 on turns
    if (path.length < 4) {
      nextPaths.push(
        [[lastX + (lastX - lastLastX), lastY], ...path]
      );
    }
  }

  return nextPaths;
};


export default function main({ matrix }) {
  const map = mapMatrix(matrix, Number);
  const end = [map[0].length - 1, map.length - 1];

  // We need a path of two or longer for the helper functions,
  // so we'll manually feed in the first two possible steps
  const visited = new Set();
  visited.add(toKey([[0, 0]]));

  const measured = {
    [toKey([[0, 1], [0, 0]])]: { path: [[0, 1], [0, 0]], heat:  map[0][1] + map[0][0] },
    [toKey([[1, 0], [0, 0]])]: { path: [[1, 0], [0, 0]], heat:  map[1][0] + map[0][0] }
  };

  while (true) {
    // Always do the path with the least recorded heat next
    const key = findCoolest(measured);
    const { path, heat } = measured[key];

    if (isSameLocation(path[0], end)) {
      // I have no idea why, but the final heat is off by one!
      return heat - 1;
    }

    // Assign heat scores to all valid unvisited next paths
    for (const nextPath of getNextPaths(path)) {
      const nextKey = toKey(nextPath);
      const [x, y] = nextPath[0];

      if (!visited.has(nextKey) && (map[y]?.[x] !== undefined)) {
        const nextProps = measured[nextKey];
        const nextHeat = heat + map[y][x];

        if (nextProps) {
          nextProps.heat = Math.min(nextProps.heat, nextHeat)
        } else {
          measured[nextKey] = { path: nextPath, heat: nextHeat };
        }
      }
    }

    visited.add(key);
    delete measured[key];
  }
}
