// --- Part Two ---

// You arrive at the vault only to discover that there is not one vault, but
// four - each with its own entrance.

// On your map, find the area in the middle that looks like this:

//     ...
//     .@.
//     ...

// Update your map to instead use the correct data:

//     @#@
//     ###
//     @#@

// This change will split your map into four separate sections, each with its
// own entrance:

//     #######       #######
//     #a.#Cd#       #a.#Cd#
//     ##...##       ##@#@##
//     ##.@.##  -->  #######
//     ##...##       ##@#@##
//     #cB#Ab#       #cB#Ab#
//     #######       #######

// Because some of the keys are for doors in other vaults, it would take much
// too long to collect all of the keys by yourself. Instead, you deploy four
// remote-controlled robots. Each starts at one of the entrances (@).

// Your goal is still to collect all of the keys in the fewest steps, but now,
// each robot has its own position and can move independently. You can only
// remotely control a single robot at a time. Collecting a key instantly
// unlocks any corresponding doors, regardless of the vault in which the key or
// door is found.

// For example, in the map above, the top-left robot first collects key a,
// unlocking door A in the bottom-right vault:

//     #######
//     #@.#Cd#
//     ##.#@##
//     #######
//     ##@#@##
//     #cB#.b#
//     #######

// Then, the bottom-right robot collects key b, unlocking door B in the bottom-left vault:

//     #######
//     #@.#Cd#
//     ##.#@##
//     #######
//     ##@#.##
//     #c.#.@#
//     #######

// Then, the bottom-left robot collects key c:

//     #######
//     #@.#.d#
//     ##.#@##
//     #######
//     ##.#.##
//     #@.#.@#
//     #######

// Finally, the top-right robot collects key d:

//     #######
//     #@.#.@#
//     ##.#.##
//     #######
//     ##.#.##
//     #@.#.@#
//     #######

// In this example, it only took 8 steps to collect all of the keys.

// Sometimes, multiple robots might have keys available, or a robot might have
// to wait for multiple keys to be collected:

//     ###############
//     #d.ABC.#.....a#
//     ######@#@######
//     ###############
//     ######@#@######
//     #b.....#.....c#
//     ###############

// First, the top-right, bottom-left, and bottom-right robots take turns
// collecting keys a, b, and c, a total of 6 + 6 + 6 = 18 steps. Then, the
// top-left robot can access key d, spending another 6 steps; collecting all of
// the keys here takes a minimum of 24 steps.

// Here's a more complex example:

//     #############
//     #DcBa.#.GhKl#
//     #.###@#@#I###
//     #e#d#####j#k#
//     ###C#@#@###J#
//     #fEbA.#.FgHi#
//     #############

// - Top-left robot collects key a.
// - Bottom-left robot collects key b.
// - Top-left robot collects key c.
// - Bottom-left robot collects key d.
// - Top-left robot collects key e.
// - Bottom-left robot collects key f.
// - Bottom-right robot collects key g.
// - Top-right robot collects key h.
// - Bottom-right robot collects key i.
// - Top-right robot collects key j.
// - Bottom-right robot collects key k.
// - Top-right robot collects key l.

// In the above example, the fewest steps to collect all of the keys is 32.

// Here's an example with more choices:

//     #############
//     #g#f.D#..h#l#
//     #F###e#E###.#
//     #dCba@#@BcIJ#
//     #############
//     #nK.L@#@G...#
//     #M###N#H###.#
//     #o#m..#i#jk.#
//     #############

// One solution with the fewest steps is:

// - Top-left robot collects key e.
// - Top-right robot collects key h.
// - Bottom-right robot collects key i.
// - Top-left robot collects key a.
// - Top-left robot collects key b.
// - Top-right robot collects key c.
// - Top-left robot collects key d.
// - Top-left robot collects key f.
// - Top-left robot collects key g.
// - Bottom-right robot collects key k.
// - Bottom-right robot collects key j.
// - Top-right robot collects key l.
// - Bottom-left robot collects key n.
// - Bottom-left robot collects key m.
// - Bottom-left robot collects key o.

// This example requires at least 72 steps to collect all keys.

// After updating your map and using the remote-controlled robots, what is the
// fewest steps necessary to collect all of the keys?

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


// Your puzzle answer was 2004.
