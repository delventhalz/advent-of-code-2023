// --- Day 20: Donut Maze ---

// You notice a strange pattern on the surface of Pluto and land nearby to get
// a closer look. Upon closer inspection, you realize you've come across one of
// the famous space-warping mazes of the long-lost Pluto civilization!

// Because there isn't much space on Pluto, the civilization that used to live
// here thrived by inventing a method for folding spacetime. Although the
// technology is no longer understood, mazes like this one provide a small
// glimpse into the daily life of an ancient Pluto citizen.

// This maze is shaped like a donut. Portals along the inner and outer edge of
// the donut can instantly teleport you from one side to the other. For
// example:

//              A
//              A
//       #######.#########
//       #######.........#
//       #######.#######.#
//       #######.#######.#
//       #######.#######.#
//       #####  B    ###.#
//     BC...##  C    ###.#
//       ##.##       ###.#
//       ##...DE  F  ###.#
//       #####    G  ###.#
//       #########.#####.#
//     DE..#######...###.#
//       #.#########.###.#
//     FG..#########.....#
//       ###########.#####
//                  Z
//                  Z

// This map of the maze shows solid walls (#) and open passages (.). Every maze
// on Pluto has a start (the open tile next to AA) and an end (the open tile
// next to ZZ). Mazes on Pluto also have portals; this maze has three pairs of
// portals: BC, DE, and FG. When on an open tile next to one of these labels, a
// single step can take you to the other tile with the same label. (You can
// only walk on . tiles; labels and empty space are not traversable.)

// One path through the maze doesn't require any portals. Starting at AA, you
// could go down 1, right 8, down 12, left 4, and down 1 to reach ZZ, a total
// of 26 steps.

// However, there is a shorter path: You could walk from AA to the inner BC
// portal (4 steps), warp to the outer BC portal (1 step), walk to the inner DE
// (6 steps), warp to the outer DE (1 step), walk to the outer FG (4 steps),
// warp to the inner FG (1 step), and finally walk to ZZ (6 steps). In total,
// this is only 23 steps.

// Here is a larger example:

//                        A
//                        A
//       #################.#############
//       #.#...#...................#.#.#
//       #.#.#.###.###.###.#########.#.#
//       #.#.#.......#...#.....#.#.#...#
//       #.#########.###.#####.#.#.###.#
//       #.............#.#.....#.......#
//       ###.###########.###.#####.#.#.#
//       #.....#        A   C    #.#.#.#
//       #######        S   P    #####.#
//       #.#...#                 #......VT
//       #.#.#.#                 #.#####
//       #...#.#               YN....#.#
//       #.###.#                 #####.#
//     DI....#.#                 #.....#
//       #####.#                 #.###.#
//     ZZ......#               QG....#..AS
//       ###.###                 #######
//     JO..#.#.#                 #.....#
//       #.#.#.#                 ###.#.#
//       #...#..DI             BU....#..LF
//       #####.#                 #.#####
//     YN......#               VT..#....QG
//       #.###.#                 #.###.#
//       #.#...#                 #.....#
//       ###.###    J L     J    #.#.###
//       #.....#    O F     P    #.#...#
//       #.###.#####.#.#####.#####.###.#
//       #...#.#.#...#.....#.....#.#...#
//       #.#####.###.###.#.#.#########.#
//       #...#.#.....#...#.#.#.#.....#.#
//       #.###.#####.###.###.#.#.#######
//       #.#.........#...#.............#
//       #########.###.###.#############
//                B   J   C
//                U   P   P

// Here, AA has no direct path to ZZ, but it does connect to AS and CP. By
// passing through AS, QG, BU, and JO, you can reach ZZ in 58 steps.

// In your maze, how many steps does it take to get from the open tile marked
// AA to the open tile marked ZZ?

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


// Your puzzle answer was 548.
