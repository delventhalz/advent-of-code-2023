// --- Day 20 ---

const { Grid, AStarFinder } = require('pathfinding');
const { eachMatrix, mapMatrix } = require('../lib/arrays.js');


const toWalkable = (square) => square === '.' ? 0 : 1;

const getGrid = (map) => {
  const walkable = mapMatrix(map, toWalkable);
  return new Grid(walkable);
};

const getShortestPath = (portals, current, target, visited = []) => {
  if (current === target) {
    // Last square does not teleport, so we have to counteract the teleport
    // distance added below
    return -1;
  }

  if (visited.includes(current)) {
    return Infinity;
  }
  visited = [...visited, current];

  const pathLengths = Object.entries(portals[current].paths).map(([walkTo, distance]) => {
    const suffix = !walkTo[2] ? '' : walkTo[2] === '0' ? '1' : '0';
    const teleportTo = walkTo.slice(0, 2) + suffix;

    // Add one for teleport distance
    return 1 + distance + getShortestPath(portals, teleportTo, target, [...visited, walkTo]);
  });

  return Math.min(...pathLengths);
};

const isLetter = (char) => Boolean(typeof char === 'string' && char.match(/[A-Z]/));

const setCoords = (coordsObject, partialLabel, x, y) => {
  const label = partialLabel == 'AA' || partialLabel === 'ZZ'
    ? partialLabel
      : coordsObject[partialLabel + '0']
        ? partialLabel + '1'
        : partialLabel + '0';

  coordsObject[label] = { paths: {} };
  coordsObject[label].coords = [x, y];
};

const getPortalCoords = (map) => {
  const coords = {};

  eachMatrix(map, (square, [x, y]) => {
    if (isLetter(square)) {
      const above = map[y - 1] && map[y - 1][x];
      const below = map[y + 1] && map[y + 1][x];
      const left = map[y][x - 1];
      const right = map[y][x + 1];

      if (isLetter(right) && map[y][x + 2] === '.') {
        setCoords(coords, square + right, x + 2, y);
      } else if (isLetter(below) && map[y + 2] && map[y + 2][x] === '.') {
        setCoords(coords, square + below, x, y + 2);
      } else if (isLetter(right) && left === '.') {
        setCoords(coords, square + right, x - 1, y);
      } else if (isLetter(below) && above === '.') {
        setCoords(coords, square + below, x, y - 1);
      }
    }
  })

  return coords;
}

const getPortalPaths = (map, portals) => {
  const portalEntries = Object.entries(portals);
  const finder = new AStarFinder();
  const grid = getGrid(map);

  for (const [start, { coords, paths }] of portalEntries) {
    for (const [end, { coords: endCoords }] of portalEntries) {
      if (start.slice(0, 2) !== end.slice(0, 2)) {
        const pathLength = finder
          .findPath(...coords, ...endCoords, grid.clone())
          .length - 1;

        if (pathLength > 0) {
          paths[end] = pathLength;
        }
      }
    }
  }

  return portals;
}


module.exports = (inputs) => {
  const map = inputs.map(row => row.split(''));
  const portals = getPortalPaths(map, getPortalCoords(map))

  return getShortestPath(portals, 'AA', 'ZZ');
};
