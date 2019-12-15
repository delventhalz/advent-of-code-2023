// --- Part Two ---

// You're not sure what it's trying to paint, but it's definitely not a
// registration identifier. The Space Police are getting impatient.

// Checking your external ship cameras again, you notice a white panel marked
// "emergency hull painting robot starting panel". The rest of the panels are
// still black, but it looks like the robot was expecting to start on a white
// panel, not a black one.

// Based on the Space Law Space Brochure that the Space Police attached to one
// of your windows, a valid registration identifier is always eight capital
// letters. After starting the robot on a single white panel instead, what
// registration identifier does it paint on your hull?

const { getRunner } = require('../lib/intcode.js');
const { fillMatrix } = require('../lib/arrays.js');


const normalize = (angle) => angle < 0 ? 1 - Math.abs(angle % 1) : angle % 1;

const turn = (angle, turnOutput) => normalize(
  turnOutput === 0 ? angle - 0.25 : angle + 0.25
);

const move = ([x, y], angle) => {
  switch (angle) {
    case 0:
      return [x, y - 1];
    case 0.25:
      return [x + 1, y];
    case 0.5:
      return [x, y + 1];
    case 0.75:
      return [x - 1, y];
    default:
      throw new Error('Bad angle:', angle);
  }
};


const parseLocationKey = (locationKey) => locationKey.split(',').map(Number);

const locationMapToMatrix = (locationMap) => {
  const matrix = [];

  for (const [location, value] of Object.entries(locationMap)) {
    const [x, y] = parseLocationKey(location);
    matrix[y] = matrix[y] || [];
    matrix[y][x] = value;
  }

  return fillMatrix(matrix);
};

const toPaintString = (num) => num === 1 ? '\u2588' : ' ';

const matrixToString = (paintMatrix) => paintMatrix
  .map(row => row.map(toPaintString))
  .map(row => row.join(''))
  .join('\n');


module.exports = (inputs) => {
  const run = getRunner(inputs, { pauseOnOutput: true, quietIO: true });

  const paintMap = { '0,0': 1 };
  let location = [0, 0];
  let angle = 0;
  let colorOutput = run(1);

  while (colorOutput !== null) {
    paintMap[location] = colorOutput;
    angle = turn(angle, run());
    location = move(location, angle);

    colorOutput = run(paintMap[location] || 0);
  }

  const paintMatrix = locationMapToMatrix(paintMap);
  return matrixToString(paintMatrix);
};


// Your puzzle answer was JKZLZJBH.
