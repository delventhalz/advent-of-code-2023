/**
 * --- Advent of Code 2023 ---
 *
 * Day 17: Clumsy Crucible
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/17#part2
 */

import { mapMatrix, matrixToString, least } from '../lib/index.js';


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

  // X's match, traveling vertically
  if (lastX === lastLastX) {
    // Must continue straight if path is too short
    if (path.length < 5) {
      return [
        [[lastX, lastY + (lastY - lastLastY)], ...path]
      ];
    }

    // Must continue straight if path is too long
    if (path.length > 10) {
      return [
        [[lastX + 1, lastY], path[0]],
        [[lastX - 1, lastY], path[0]]
      ];
    }

    // Otherwise, could turn or continue straight
    return [
      [[lastX, lastY + (lastY - lastLastY)], ...path],
      [[lastX + 1, lastY], path[0]],
      [[lastX - 1, lastY], path[0]]
    ];
  }

  // Y's match, traveling horizontally
  if (path.length <= 4) {
    return [
      [[lastX + (lastX - lastLastX), lastY], ...path]
    ];
  }

  if (path.length > 10) {
    return [
      [[lastX, lastY + 1], path[0]],
      [[lastX, lastY - 1], path[0]]
    ];
  }

  return [
    [[lastX + (lastX - lastLastX), lastY], ...path],
    [[lastX, lastY + 1], path[0]],
    [[lastX, lastY - 1], path[0]]
  ];
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

    if (isSameLocation(path[0], end) && path.length >= 4) {
      // This is the right answer for the real input,
      // but one too high for the test input!?!
      return heat;
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
