// --- Day 15 ---

const { getRunner } = require('../intcode.js');
const { least } = require('../math.js');

const getLeastIndex = (arr) => least(Object.keys(arr).map(Number));

const shiftArray = (negativeArray, amount = null) => {
  if (amount === null) {
    const leastIndex = getLeastIndex(negativeArray);
    if (leastIndex >= 0) {
      return negativeArray;
    }

    amount = -leastIndex;
  }

  const shifted = [];
  for (const [i, val] of Object.entries(negativeArray)) {
    shifted[Number(i) + amount] = val;
  }

  return shifted;
};

const shiftMatrix = (negativeMatrix) => {
  const shifted = shiftArray(negativeMatrix);
  const leastXIndex = least(shifted.map(getLeastIndex));
  return shifted.map(row => shiftArray(row, -leastXIndex));
};

const fillMatrix = (sparseMatrix) => {
  const filled = [];

  for (let y = 0; y < sparseMatrix.length; y++) {
    filled[y] = [];
    const currentRow = sparseMatrix[y];
    if (!currentRow) continue;

    for (let x = 0; x < currentRow.length; x++) {
      filled[y][x] = currentRow[x];
    }
  }

  return filled;
};

const animate = (frameFn, frameLength) => {
  setTimeout(() => {
    const shouldContinue = frameFn();

    if (shouldContinue) {
      animate(frameFn, frameLength);
    }
  }, frameLength);
};

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

  const screen = fillMatrix(shiftMatrix(map))
    .map(row => row.map(char => char || ' '))
    .map(row => ' ' + row.join(''))
    .join('\n');

  if (map[y][x] === getRobot(direction)) {
    map[y][x] = '.';
  }


  console.clear();
  console.log();
  console.log(' LOCATION:', x, y)
  console.log();
  console.log(screen);
  console.log();
};

module.exports = (inputs) => {
  const run = getRunner(inputs, { pauseOnOutput: true, quietIO: true });

  const map = [['O']];
  const update = getMapUpdater(map);
  const print = getMapPrinter(map);

  let location = [0, 0];
  let moveIndex = 0;
  let lastDirection = 1;

  animate(() => {
    const direction = indexToDirection(moveIndex, lastDirection);
    const output = run(direction);

    location = update(location, direction, output);
    print(location, lastDirection);

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
