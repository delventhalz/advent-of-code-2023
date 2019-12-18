// --- Day 18: Many-Worlds Interpretation ---

// As you approach Neptune, a planetary security system detects you and
// activates a giant tractor beam on Triton! You have no choice but to land.

// A scan of the local area reveals only one interesting feature: a massive
// underground vault. You generate a map of the tunnels (your puzzle input).
// The tunnels are too narrow to move diagonally.

// Only one entrance (marked @) is present among the open passages (marked .)
// and stone walls (#), but you also detect an assortment of keys (shown as
// lowercase letters) and doors (shown as uppercase letters). Keys of a given
// letter open the door of the same letter: a opens A, b opens B, and so on.
// You aren't sure which key you need to disable the tractor beam, so you'll
// need to collect all of them.

// For example, suppose you have the following map:

//     #########
//     #b.A.@.a#
//     #########

// Starting from the entrance (@), you can only access a large door (A) and a
// key (a). Moving toward the door doesn't help you, but you can move 2 steps
// to collect the key, unlocking A in the process:

//     #########
//     #b.....@#
//     #########

// Then, you can move 6 steps to collect the only other key, b:

//     #########
//     #@......#
//     #########

// So, collecting every key took a total of 8 steps.

// Here is a larger example:

//     ########################
//     #f.D.E.e.C.b.A.@.a.B.c.#
//     ######################.#
//     #d.....................#
//     ########################

// The only reasonable move is to take key a and unlock door A:

//     ########################
//     #f.D.E.e.C.b.....@.B.c.#
//     ######################.#
//     #d.....................#
//     ########################

// Then, do the same with key b:

//     ########################
//     #f.D.E.e.C.@.........c.#
//     ######################.#
//     #d.....................#
//     ########################

// ...and the same with key c:

//     ########################
//     #f.D.E.e.............@.#
//     ######################.#
//     #d.....................#
//     ########################

// Now, you have a choice between keys d and e. While key e is closer,
// collecting it now would be slower in the long run than collecting key d
// first, so that's the best choice:

//     ########################
//     #f...E.e...............#
//     ######################.#
//     #@.....................#
//     ########################

// Finally, collect key e to unlock door E, then collect key f, taking a grand
// total of 86 steps.

// Here are a few more examples:

// - ########################
//   #...............b.C.D.f#
//   #.######################
//   #.....@.a.B.c.d.A.e.F.g#
//   ########################
//   Shortest path is 132 steps: b, a, c, d, f, e, g

// - #################
//   #i.G..c...e..H.p#
//   ########.########
//   #j.A..b...f..D.o#
//   ########@########
//   #k.E..a...g..B.n#
//   ########.########
//   #l.F..d...h..C.m#
//   #################
//   Shortest paths are 136 steps;
//   one is: a, f, b, j, g, n, h, d, l, o, e, p, c, i, k, m

// - ########################
//   #@..............ac.GI.b#
//   ###d#e#f################
//   ###A#B#C################
//   ###g#h#i################
//   ########################
//   Shortest paths are 81 steps; one is: a, c, f, i, d, g, b, e, h

// How many steps is the shortest path that collects all of the keys?

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

const getShortestPath = (map, keyCoords, keys, location) => {
  const memoKey = [...keys, ...location].join();
  if (SHORTEST_PATHS[memoKey]) {
    return SHORTEST_PATHS[memoKey];
  }

  const options = findWalkableDistances(map, keyCoords, keys, location);
  if (options.length === 0) {
    return 0;
  }

  const pathLengths = options.map(([key, distance]) => (
    distance + getShortestPath(map, keyCoords, [key, ...keys].sort(), keyCoords[key]))
  );

  const shortest = Math.min(...pathLengths);
  SHORTEST_PATHS[memoKey] = shortest;
  return shortest;
};

module.exports = (inputs) => {
  const map = inputs.map(row => row.split(''));
  const keyCoords = getKeyCoords(map);
  const start = coordsOf(map, '@');

  return getShortestPath(map, keyCoords, [], start);
};


// Your puzzle answer was 3918.
