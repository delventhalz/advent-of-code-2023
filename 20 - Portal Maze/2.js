// --- Part Two ---

// Strangely, the exit isn't open when you reach it. Then, you remember: the
// ancient Plutonians were famous for building recursive spaces.

// The marked connections in the maze aren't portals: they physically connect
// to a larger or smaller copy of the maze. Specifically, the labeled tiles
// around the inside edge actually connect to a smaller copy of the same maze,
// and the smaller copy's inner labeled tiles connect to yet a smaller copy,
// and so on.

// When you enter the maze, you are at the outermost level; when at the
// outermost level, only the outer labels AA and ZZ function (as the start and
// end, respectively); all other outer labeled tiles are effectively walls. At
// any other level, AA and ZZ count as walls, but the other outer labeled tiles
// bring you one level outward.

// Your goal is to find a path through the maze that brings you back to ZZ at
// the outermost level of the maze.

// In the first example above, the shortest path is now the loop around the
// right side. If the starting level is 0, then taking the previously-shortest
// path would pass through BC (to level 1), DE (to level 2), and FG (back to
// level 1). Because this is not the outermost level, ZZ is a wall, and the
// only option is to go back around to BC, which would only send you even
// deeper into the recursive maze.

// In the second example above, there is no path that brings you to ZZ at the
// outermost level.

// Here is a more interesting example:

//                  Z L X W       C
//                  Z P Q B       K
//       ###########.#.#.#.#######.###############
//       #...#.......#.#.......#.#.......#.#.#...#
//       ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###
//       #.#...#.#.#...#.#.#...#...#...#.#.......#
//       #.###.#######.###.###.#.###.###.#.#######
//       #...#.......#.#...#...#.............#...#
//       #.#########.#######.#.#######.#######.###
//       #...#.#    F       R I       Z    #.#.#.#
//       #.###.#    D       E C       H    #.#.#.#
//       #.#...#                           #...#.#
//       #.###.#                           #.###.#
//       #.#....OA                       WB..#.#..ZH
//       #.###.#                           #.#.#.#
//     CJ......#                           #.....#
//       #######                           #######
//       #.#....CK                         #......IC
//       #.###.#                           #.###.#
//       #.....#                           #...#.#
//       ###.###                           #.#.#.#
//     XF....#.#                         RF..#.#.#
//       #####.#                           #######
//       #......CJ                       NM..#...#
//       ###.#.#                           #.###.#
//     RE....#.#                           #......RF
//       ###.###        X   X       L      #.#.#.#
//       #.....#        F   Q       P      #.#.#.#
//       ###.###########.###.#######.#########.###
//       #.....#...#.....#.......#...#.....#.#...#
//       #####.#.###.#######.#######.###.###.#.#.#
//       #.......#.......#.#.#.#.#...#...#...#.#.#
//       #####.###.#####.#.#.#.#.###.###.#.###.###
//       #.......#.....#.#...#...............#...#
//       #############.#.#.###.###################
//                    A O F   N
//                    A A D   M

// One shortest path through the maze is the following:

// - Walk from AA to XF (16 steps)
// - Recurse into level 1 through XF (1 step)
// - Walk from XF to CK (10 steps)
// - Recurse into level 2 through CK (1 step)
// - Walk from CK to ZH (14 steps)
// - Recurse into level 3 through ZH (1 step)
// - Walk from ZH to WB (10 steps)
// - Recurse into level 4 through WB (1 step)
// - Walk from WB to IC (10 steps)
// - Recurse into level 5 through IC (1 step)
// - Walk from IC to RF (10 steps)
// - Recurse into level 6 through RF (1 step)
// - Walk from RF to NM (8 steps)
// - Recurse into level 7 through NM (1 step)
// - Walk from NM to LP (12 steps)
// - Recurse into level 8 through LP (1 step)
// - Walk from LP to FD (24 steps)
// - Recurse into level 9 through FD (1 step)
// - Walk from FD to XQ (8 steps)
// - Recurse into level 10 through XQ (1 step)
// - Walk from XQ to WB (4 steps)
// - Return to level 9 through WB (1 step)
// - Walk from WB to ZH (10 steps)
// - Return to level 8 through ZH (1 step)
// - Walk from ZH to CK (14 steps)
// - Return to level 7 through CK (1 step)
// - Walk from CK to XF (10 steps)
// - Return to level 6 through XF (1 step)
// - Walk from XF to OA (14 steps)
// - Return to level 5 through OA (1 step)
// - Walk from OA to CJ (8 steps)
// - Return to level 4 through CJ (1 step)
// - Walk from CJ to RE (8 steps)
// - Return to level 3 through RE (1 step)
// - Walk from RE to IC (4 steps)
// - Recurse into level 4 through IC (1 step)
// - Walk from IC to RF (10 steps)
// - Recurse into level 5 through RF (1 step)
// - Walk from RF to NM (8 steps)
// - Recurse into level 6 through NM (1 step)
// - Walk from NM to LP (12 steps)
// - Recurse into level 7 through LP (1 step)
// - Walk from LP to FD (24 steps)
// - Recurse into level 8 through FD (1 step)
// - Walk from FD to XQ (8 steps)
// - Recurse into level 9 through XQ (1 step)
// - Walk from XQ to WB (4 steps)
// - Return to level 8 through WB (1 step)
// - Walk from WB to ZH (10 steps)
// - Return to level 7 through ZH (1 step)
// - Walk from ZH to CK (14 steps)
// - Return to level 6 through CK (1 step)
// - Walk from CK to XF (10 steps)
// - Return to level 5 through XF (1 step)
// - Walk from XF to OA (14 steps)
// - Return to level 4 through OA (1 step)
// - Walk from OA to CJ (8 steps)
// - Return to level 3 through CJ (1 step)
// - Walk from CJ to RE (8 steps)
// - Return to level 2 through RE (1 step)
// - Walk from RE to XQ (14 steps)
// - Return to level 1 through XQ (1 step)
// - Walk from XQ to FD (8 steps)
// - Return to level 0 through FD (1 step)
// - Walk from FD to ZZ (18 steps)

// This path takes a total of 396 steps to move from AA at the outermost layer
// to ZZ at the outermost layer.

// In your maze, when accounting for recursion, how many steps does it take to
// get from the open tile marked AA to the open tile marked ZZ, both at the
// outermost layer?

const { Grid, AStarFinder } = require('pathfinding');
const { eachMatrix, mapMatrix } = require('../lib/arrays.js');


const START = 'AA';
const END = 'ZZ';
const MAX_DEPTH = 25;


const toWalkable = (square) => square === '.' ? 0 : 1;

const getGrid = (map) => {
  const walkable = mapMatrix(map, toWalkable);
  return new Grid(walkable);
};

const isLetter = (char) => Boolean(typeof char === 'string' && char.match(/[A-Z]/));

const setCoords = (map, coordsObject, partialLabel, x, y) => {
  const isOuter = x < 4
    || y < 4
    || x > map[0].length - 5
    || y > map.length - 5;
  const isEntrance = partialLabel === START || partialLabel === END;
  const label = isEntrance ? partialLabel : isOuter ? partialLabel + 'o' : partialLabel + 'i';

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
        setCoords(map, coords, square + right, x + 2, y);
      } else if (isLetter(below) && map[y + 2] && map[y + 2][x] === '.') {
        setCoords(map, coords, square + below, x, y + 2);
      } else if (isLetter(right) && left === '.') {
        setCoords(map, coords, square + right, x - 1, y);
      } else if (isLetter(below) && above === '.') {
        setCoords(map, coords, square + below, x, y - 1);
      }
    }
  })

  return coords;
};

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
};


const toVisited = (portal, level) => `${portal}-${level}`;

const getTeleporter = (portals, visited, level) => ([walkTo, walkDistance]) => {
  // No-teleport cases
  if (level > MAX_DEPTH) {
    return [Infinity, visited];
  }
  if (walkTo[2] === 'o' && level === 0) {
    return [Infinity, visited];
  }
  if (walkTo === START) {
    return [Infinity, visited];
  }
  if (walkTo === END && level !== 0) {
    return [Infinity, visited];
  }
  if (walkTo === END && level === 0) {
    // Got to the end!
    return [walkDistance, [...visited, toVisited(walkTo, level)]];
  }
  if (visited.includes(toVisited(walkTo, level))) {
    return [Infinity, visited];
  }

  const teleportSuffix = walkTo[2] === 'o' ? 'i' : 'o';
  const teleportTo = walkTo.slice(0, 2) + teleportSuffix;
  const levelChange = teleportSuffix === 'o' ? 1 : -1;

  const [pathDistance, path] = getShortestPath(
    portals,
    teleportTo,
    [...visited, toVisited(walkTo, level)],
    level + levelChange
  );

  return [1 + pathDistance + walkDistance, path];
}

const getShortestPath = (portals, current = START, visited = [], level = 0) => {
  visited = [...visited, toVisited(current, level)];

  const pathLengths = Object
    .entries(portals[current].paths)
    .map(getTeleporter(portals, visited, level));

  return pathLengths.sort((a, b) => a[0] - b[0])[0];
};


module.exports = (inputs) => {
  const map = inputs.map(row => row.split(''));
  const portals = getPortalPaths(map, getPortalCoords(map));

  return getShortestPath(portals);
};


// Your puzzle answer was 6452.
