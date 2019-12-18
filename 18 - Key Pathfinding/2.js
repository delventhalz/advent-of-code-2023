// --- Day 18 ---

const { Grid, AStarFinder } = require('pathfinding');
const { coordsOf, eachMatrix, mapMatrix } = require('../lib/arrays.js');


// Memo objects
const WALKABLE_DISTANCES = {};
const SHORTEST_PATHS = {};

const getKeyCoords = (map) => {
  const keyCoords = {};

  eachMatrix(map, (square, [x, y]) => {
    if (square.match(/[a-z]/)) {
      keyCoords[square] = [x, y];
    }
  });

  return keyCoords;
};

const getWalkableMapper = (keys) => (square) => {
  if (square.match(/[A-Z]/)) {
    return keys.includes(square.toLowerCase()) ? 0 : 1;
  }

  if (square.match(/[a-z]/)) {
    return 0;
  }

  switch(square) {
    case '.':
      return 0; // walkable
    case '#':
      return 1; // not walkable
    case '@':
      return 0;
    default:
      throw new Error(`Bad walkable square: ${square}`);
  }
};

const gridFactory = (map) => (keys) => {
  const walkable = mapMatrix(map, getWalkableMapper(keys));
  return new Grid(walkable);
};

const findWalkableDistances = (map, keyCoords, keys, location) => {
  const memoKey = [...keys, ...location].join();
  if (WALKABLE_DISTANCES[memoKey]) {
    return WALKABLE_DISTANCES[memoKey];
  }

  const finder = new AStarFinder();
  const getGrid = gridFactory(map);

  const distances = Object.entries(keyCoords)
    .filter(([key, _]) => !keys.includes(key))
    .map(([key, coords]) => [key, finder.findPath(...location, ...coords, getGrid(keys))])
    .filter(([_, path]) => path.length > 0)
    .map(([key, path]) => [key, path.length - 1]);

  WALKABLE_DISTANCES[memoKey] = distances;
  return distances;
};

const getShortestPath = (map, keyCoords, keys, locations) => {
  const memoKey = [...keys, ...locations.flat()].join();
  if (SHORTEST_PATHS[memoKey]) {
    return SHORTEST_PATHS[memoKey];
  }

  const options = locations.map(start => findWalkableDistances(map, keyCoords, keys, start));
  if (options.every(distances => distances.length === 0)) {
    return 0;
  }

  const pathLengths = options.flatMap((distances, i) => (
    distances.map(([key, distance]) => distance + getShortestPath(
      map,
      keyCoords,
      [key, ...keys].sort(),
      [...locations.slice(0, i), keyCoords[key], ...locations.slice(i + 1)]
    ))
  ));

  const shortest = Math.min(...pathLengths);
  SHORTEST_PATHS[memoKey] = shortest;
  return shortest;
};

const getInitialState = (inputs) => {
  const map = inputs.map(row => row.split(''));
  const [x, y] = coordsOf(map, '@');

  map[y - 1][x - 1] = '@';
  map[y - 1][x] = '#';
  map[y - 1][x + 1] = '@';

  map[y][x - 1] = '#';
  map[y][x] = '#';
  map[y][x + 1] = '#';

  map[y + 1][x - 1] = '@';
  map[y + 1][x] = '#';
  map[y + 1][x + 1] = '@';

  return [map, [[x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]]];
}

module.exports = (inputs) => {
  const [map, locations] = getInitialState(inputs);
  const keyCoords = getKeyCoords(map);

  return getShortestPath(map, keyCoords, [], locations);
};
