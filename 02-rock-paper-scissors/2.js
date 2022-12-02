'use strict';

// --- Part Two ---

// The Elf finishes helping with the tent and sneaks back over to you. "Anyway,
// the second column says how the round needs to end: X means you need to lose,
// Y means you need to end the round in a draw, and Z means you need to win.
// Good luck!"

// The total score is still calculated in the same way, but now you need to
// figure out what shape to choose so the round ends as indicated. The example
// above now goes like this:

// - In the first round, your opponent will choose Rock (A), and you need the
//   round to end in a draw (Y), so you also choose Rock. This gives you a
//   score of 1 + 3 = 4.
// - In the second round, your opponent will choose Paper (B), and you choose
//   Rock so you lose (X) with a score of 1 + 0 = 1.
// - In the third round, you will defeat your opponent's Scissors with Rock for
//   a score of 1 + 6 = 7.

// Now that you're correctly decrypting the ultra top secret strategy guide, you
// would get a total score of 12.

// Following the Elf's instructions for the second column, what would your total
// score be if everything goes exactly according to your strategy guide?

const { sum } = require('../lib');


const getLosingChoice = (opponent) => {
  switch (opponent) {
    case 'A':
      return 'C';
    case 'B':
      return 'A';
    case 'C':
      return 'B';
    default:
      throw new Error(`Not a valid choice: ${opponent}`);
  }
};

const getWinningChoice = (opponent) => {
  switch (opponent) {
    case 'A':
      return 'B';
    case 'B':
      return 'C';
    case 'C':
      return 'A';
    default:
      throw new Error(`Not a valid choice: ${opponent}`);
  }
};

const scoreChoice = (choice) => {
  switch (choice) {
    case 'A':
      return 1;
    case 'B':
      return 2;
    case 'C':
      return 3;
    default:
      throw new Error(`Not a valid choice: ${choice}`);
  }
}

const scoreRound = ([opponent, outcome]) => {
  switch (outcome) {
    case 'X':
      return scoreChoice(getLosingChoice(opponent));
    case 'Y':
      return 3 + scoreChoice(opponent);
    case 'Z':
      return 6 + scoreChoice(getWinningChoice(opponent));
    default:
      throw new Error(`Not a valid outcome: ${outcome}`);
  }
};

module.exports = (inputs) => {
  const scores = inputs
    .map(round => round.split(' '))
    .map(scoreRound);

  return sum(scores);
};

// Your puzzle answer was 16862.
