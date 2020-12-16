// --- Part Two ---

// Impressed, the Elves issue you a challenge: determine the 30000000th number
// spoken. For example, given the same starting numbers as above:

// - Given 0,3,6, the 30000000th number spoken is 175594.
// - Given 1,3,2, the 30000000th number spoken is 2578.
// - Given 2,1,3, the 30000000th number spoken is 3544142.
// - Given 1,2,3, the 30000000th number spoken is 261214.
// - Given 2,3,1, the 30000000th number spoken is 6895259.
// - Given 3,2,1, the 30000000th number spoken is 18.
// - Given 3,1,2, the 30000000th number spoken is 362.

// Given your starting numbers, what will be the 30000000th number spoken?

const { memoryGame } = require('./memory-game.js');

module.exports = (inputs) => {
  return memoryGame(inputs, 30000000);
};

// Your puzzle answer was 1505722.
