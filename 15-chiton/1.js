'use strict';

// --- Day 15: Chiton ---

// You've almost reached the exit of the cave, but the walls are getting closer
// together. Your submarine can barely still fit, though; the main problem is
// that the walls of the cave are covered in chitons, and it would be best not
// to bump any of them.

// The cavern is large, but has a very low ceiling, restricting your motion to
// two dimensions. The shape of the cavern resembles a square; a quick scan of
// chiton density produces a map of risk level throughout the cave (your puzzle
// input). For example:

//     1163751742
//     1381373672
//     2136511328
//     3694931569
//     7463417111
//     1319128137
//     1359912421
//     3125421639
//     1293138521
//     2311944581

// You start in the top left position, your destination is the bottom right
// position, and you cannot move diagonally. The number at each position is its
// risk level; to determine the total risk of an entire path, add up the risk
// levels of each position you enter (that is, don't count the risk level of
// your starting position unless you enter it; leaving it adds no risk to your
// total).

// Your goal is to find a path with the lowest total risk. In this example, a
// path with the lowest total risk is highlighted here:

//     1163751742
//     1381373672
//     2136511328
//     3694931569
//     7463417111
//     1319128137
//     1359912421
//     3125421639
//     1293138521
//     2311944581

// The total risk of this path is 40 (the starting position is never entered,
// so its risk is not counted).

// What is the lowest total risk of any path from the top left to the bottom
// right?

const { eachAdjacent, matrixToString, mapMatrix } = require('../lib');


let MAP;
let GOAL_X;
let GOAL_Y;
let BEST_RISK;

const PATHS = {};


// eslint-disable-next-line no-unused-vars
const logPath = ([x, y], visited) => {
  const toPrint = mapMatrix(MAP, (risk, loc) => visited.has(loc.join(',')) ? '•' : risk);
  toPrint[GOAL_Y][GOAL_X] = 'X';
  toPrint[y][x] = '#';

  console.log(matrixToString(toPrint));
};

const walk = (loc, visited, lastRisk) => {
  const [x, y] = loc;
  const locString = loc.join(',');
  const thisRisk = MAP[y][x];
  const nextRisk = lastRisk + thisRisk;

  if (visited.has(locString)) {
    return Infinity;
  }

  if (PATHS[locString] <= nextRisk) {
    return Infinity;
  }

  if (nextRisk >= BEST_RISK) {
    return Infinity;
  }


  if (x === GOAL_X && y === GOAL_Y) {
    BEST_RISK = nextRisk;
    console.log('GOAL  --  LENGTH:', visited.size + 1, ' --  RISK:', nextRisk);
    // logPath(loc, visited);
    // console.log()
    return thisRisk;
  }

  const nextVisited = new Set(visited);
  nextVisited.add(locString);

  const nextSteps = [];
  eachAdjacent(MAP, [x, y], (_, [nextX, nextY]) => {
    if (!nextVisited.has(`${nextX},${nextY}`)) {
      nextSteps.push([nextX, nextY]);
    }
  });

  // Prefer down, right, and least risk
  nextSteps.sort(([aX, aY], [bX, bY]) => {
    if (aY !== bY) {
      return bY - aY;
    }

    if (aX !== bX) {
      return bX - aX;
    }

    return MAP[aY][aX] - MAP[bY][bX];
  });

  const laterRisks = nextSteps.map(loc => walk(loc, nextVisited, nextRisk));
  return thisRisk + Math.min(Infinity, ...laterRisks);
};


module.exports = (_, rawInput) => {
  MAP = rawInput.split('\n').map(row => row.split('').map(Number));
  GOAL_X = MAP[0].length - 1;
  GOAL_Y = MAP.length - 1;
  BEST_RISK = 6 * (MAP.length + MAP[0].length);

  return walk([0, 0], new Set(), 0) - MAP[0][0];
};

// Your puzzle answer was 540.

