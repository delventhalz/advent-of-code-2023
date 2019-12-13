// --- Part Two ---

// The game didn't run because you didn't put in any quarters. Unfortunately,
// you did not bring any quarters. Memory address 0 represents the number of
// quarters that have been inserted; set it to 2 to play for free.

// The arcade cabinet has a joystick that can move left and right. The software
// reads the position of the joystick with input instructions:

// - If the joystick is in the neutral position, provide 0.
// - If the joystick is tilted to the left, provide -1.
// - If the joystick is tilted to the right, provide 1.

// The arcade cabinet also has a segment display capable of showing a single
// number that represents the player's current score. When three output
// instructions specify X=-1, Y=0, the third output instruction is not a tile;
// the value instead specifies the new score to show in the segment display.
// For example, a sequence of output values like -1,0,12345 would show 12345 as
// the player's current score.

// Beat the game by breaking all the blocks. What is your score after the last
// block is broken?

const { chunk } = require('lodash');
const { getRunner } = require('../intcode.js');


const updateScreen = (current, changes) => {
  for (const [x, y, id] of chunk(changes, 3)) {
    current[y] = current[y] || [];
    current[y][x] = id;

    if (id === 3) {
      current.paddleX = x;
    } else if (id === 4) {
      current.ballX = x;
    }
  }

  return current;
};

const getInput = ({ ballX, paddleX }) => {
  if (ballX < paddleX) {
    return -1;
  }
  if (ballX > paddleX) {
    return 1;
  }
  return 0;
};

const idToChar = (id) => {
  switch (id) {
    case 0:  // empty
      return ' ';
    case 1:  // wall
      return '\u2588';
    case 2:  // block
      return '#';
    case 3:  // horizontal paddle
      return '‒';
    case 4:  // empty tile
      return 'O';
    default:
      throw new Error(`Bad pixel id: ${id}`);
  }
};

const printScreen = (data) => {
  const screen = data
    .map(row => row.map(idToChar))
    .map(row => ' ' + row.join(''))
    .join('\n');

  console.clear();
  console.log();
  console.log(' SCORE:', data[0][-1]);
  console.log();
  console.log(screen);
  console.log();
};

const animate = (frameFn, frameLength) => {
  setTimeout(() => {
    const shouldContinue = frameFn();

    if (shouldContinue) {
      animate(frameFn, frameLength);
    }
  }, frameLength);
};


module.exports = (inputs) => {
  inputs[0] = 2;
  const run = getRunner(inputs, { pauseOnInput: true, quietIO: true });

  let screenData = [];

  animate(() => {
    const input = getInput(screenData);
    let outputs = run(input);
    let isRunning = true;

    if (outputs[outputs.length - 1] === null) {
      outputs = outputs.slice(0, -1);
      isRunning = false;
    }

    screenData = updateScreen(screenData, outputs);
    printScreen(screenData);

    return isRunning;
  }, 20);

  return screenData[0][-1];
};


// Your puzzle answer was 13989.
