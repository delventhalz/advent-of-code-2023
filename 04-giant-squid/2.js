'use strict';

// --- Part Two ---

// On the other hand, it might be wise to try a different strategy: let the
// giant squid win.

// You aren't sure how many bingo boards a giant squid could play at once, so
// rather than waste time counting its arms, the safe thing to do is to figure
// out which board will win last and choose that one. That way, no matter which
// boards it picks, it will win for sure.

// In the above example, the second board is the last to win, which happens
// after 13 is eventually called and its middle column is completely marked. If
// you were to keep playing until this point, the second board would have a sum
// of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

// Figure out which board will win last. Once it wins, what would its final
// score be?

const { last } = require('lodash');
const { rotateMatrix, sum } = require('../lib');


const parseBoard = (boardString) => {
  return boardString
    .split('\n')
    .map(row => row.trim().replace(/\s+/g, ' ').split(' ').map(Number));
};

const isWinner = (board, called) => {
  for (let row of board) {
    if (row.every(num => called.has(num))) {
      return true;
    }
  }

  for (let col of rotateMatrix(board)) {
    if (col.every(num => called.has(num))) {
      return true;
    }
  }

  return false;
};

const findWinners = (boards, calls) => {
  const called = new Set();
  const winners = [];

  let currentBoards = boards;
  let nextBoards = boards;

  for (const call of calls) {
    called.add(call);

    for (const board of currentBoards) {
      if (isWinner(board, called)) {
        winners.push({
          winner: board,
          lastCall: call,
          uncalled: board.flat().filter(spot => !called.has(spot))
        });

        nextBoards = nextBoards.filter(b => b !== board);
      }
    }

    currentBoards = nextBoards
  }

  return winners;
}

module.exports = (_, rawInput) => {
  const groups = rawInput.split('\n\n');
  const calls = groups[0].split(',').map(Number);
  const boards = groups.slice(1).map(parseBoard);

  const winners = findWinners(boards, calls);
  const { lastCall, uncalled } = last(winners);

  return lastCall * sum(uncalled);
};

// Your puzzle answer was 13912.
