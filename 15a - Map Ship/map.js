// --- Day 15: Oxygen System ---

// Out here in deep space, many things can go wrong. Fortunately, many of those
// things have indicator lights. Unfortunately, one of those lights is lit: the
// oxygen system for part of the ship has failed!

// According to the readouts, the oxygen system must have failed days ago after
// a rupture in oxygen tank two; that section of the ship was automatically
// sealed once oxygen levels went dangerously low. A single remotely-operated
// repair droid is your only option for fixing the oxygen system.

// The Elves' care package included an Intcode program (your puzzle input) that
// you can use to remotely control the repair droid. By running that program,
// you can direct the repair droid to the oxygen system and fix the problem.

// The remote control program executes the following steps in a loop forever:

// - Accept a movement command via an input instruction.
// - Send the movement command to the repair droid.
// - Wait for the repair droid to finish the movement operation.
// - Report on the status of the repair droid via an output instruction.

// Only four movement commands are understood: north (1), south (2), west (3),
// and east (4). Any other command is invalid. The movements differ in
// direction, but not in distance: in a long enough east-west hallway, a series
// of commands like 4,4,4,4,3,3,3,3 would leave the repair droid back where it
// started.

// The repair droid can reply with any of the following status codes:

// - 0: The repair droid hit a wall. Its position has not changed.
// - 1: The repair droid has moved one step in the requested direction.
// - 2: The repair droid has moved one step in the requested direction; its new
//   position is the location of the oxygen system.

// You don't know anything about the area around the repair droid, but you can
// figure it out by watching the status codes.

// For example, we can draw the area using D for the droid, # for walls, . for
// locations the droid can traverse, and empty space for unexplored locations.
// Then, the initial state looks like this:



//        D


// To make the droid go north, send it 1. If it replies with 0, you know that
// location is a wall and that the droid didn't move:


//        #
//        D


// To move east, send 4; a reply of 1 means the movement was successful:


//        #
//        .D


// Then, perhaps attempts to move north (1), south (2), and east (4) are all
// met with replies of 0:


//        ##
//        .D#
//         #

// Now, you know the repair droid is in a dead end. Backtrack with 3 (which you
// already know will get a reply of 1 because you already know that location is
// open):


//        ##
//        D.#
//         #

// Then, perhaps west (3) gets a reply of 0, south (2) gets a reply of 1, south
// again (2) gets a reply of 0, and then west (3) gets a reply of 2:


//        ##
//       #..#
//       D.#
//        #

// Now, because of the reply of 2, you know you've found the oxygen system! In
// this example, it was only 2 moves away from the repair droid's starting
// position.

const { getRunner } = require('../lib/intcode.js');
const { loop, print } = require('../lib/animation.js');
const {
  fillMatrix,
  mapMatrix,
  matrixToString,
  shiftMatrix
} = require('../lib/arrays.js');


const indexToDirection = (moveIndex, lastDirection) => {
  switch(moveIndex % 4) {
    case 0: // left
      switch(lastDirection) {
        case 1: // north
          return 3;
        case 2: // south
          return 4;
        case 3: // west
          return 2;
        case 4: // east
          return 1;
      }
      break;
    case 1: // up
      return lastDirection;
    case 2: // right
      switch(lastDirection) {
        case 1:
          return 4;
        case 2:
          return 3;
        case 3:
          return 1;
        case 4:
          return 2;
      }
      break;
    case 3: // down
      switch(lastDirection) {
        case 1:
          return 2;
        case 2:
          return 1;
        case 3:
          return 4;
        case 4:
          return 3;
      }
  }
};

const move = ([x, y], direction) => {
  switch(direction) {
    case 1: // north
      return [x, y - 1];
    case 2: // south
      return [x, y + 1];
    case 3: // west
      return [x - 1, y];
    case 4: // east
      return [x + 1, y];
    default:
      throw new Error(`Bad move direction: ${direction}`);
  }
};

const getRobot = (direction) => {
  switch(direction) {
    case 1: // north
      return '^';
    case 2: // south
      return 'v';
    case 3: // west
      return '<';
    case 4: // east
      return '>';
    default:
      throw new Error(`Bad robot direction: ${direction}`);
  }
};

const getMapUpdater = (map) => (location, direction, output) => {
  const [x, y] = move(location, direction);
  map[y] = map[y] || [];

  if (output === 0) {
    map[y][x] = '#';
    return location;
  }

  if (output === 1) {
    map[y][x] = '.';
    map[0][0] = 'O';
    return [x, y];
  }

  if (output === 2) {
    map[y][x] = 'X';
    return [x, y];
  }

  throw new Error(`Bad update output: ${output}`);
};

const getMapPrinter = (map) => ([x, y], direction) => {
  if (map[y][x] !== 'X') {
    map[y][x] = getRobot(direction);
  }

  const fullMatrix = fillMatrix(shiftMatrix(map));
  const screen = matrixToString(mapMatrix(fullMatrix, char => char || ' '));

  if (map[y][x] === getRobot(direction)) {
    map[y][x] = '.';
  }

  print(screen, ['LOCATION:', x, y]);
};

module.exports = (inputs) => {
  const run = getRunner(inputs, { pauseOnOutput: true, quietIO: true });

  const map = [['O']];
  const updateMap = getMapUpdater(map);
  const printMap = getMapPrinter(map);

  let location = [0, 0];
  let moveIndex = 0;
  let lastDirection = 1;

  loop(() => {
    const direction = indexToDirection(moveIndex, lastDirection);
    const output = run(direction);

    location = updateMap(location, direction, output);
    printMap(location, lastDirection);

    switch (output) {
      case 0:  // wall
        moveIndex += 1;
        break;
      case 1: // moved
        moveIndex = 0;
        lastDirection = direction;
        break;
      case 2: // oxygen system found
        // Remove comment on next line to stop on finding oxygen system,
        // otherwise it runs until you kill it manually:
        // return false;
        moveIndex = 0;
        lastDirection = direction;
        break;
      default:
        throw new Error(`Bad loop output: ${output}`);
    }

    return true;
  }, 20);
};


// Manually killed mapper after maze was fully explored, and used output as
// input.txt (with some manual modifications) for part 1/2 solutions in 15b
