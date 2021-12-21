'use strict';

// --- Part Two ---

// Now that you're warmed up, it's time to play the real game.

// A second compartment opens, this time labeled Dirac dice. Out of it falls a
// single three-sided die.

// As you experiment with the die, you feel a little strange. An informational
// brochure in the compartment explains that this is a quantum die: when you
// roll it, the universe splits into multiple copies, one copy for each
// possible outcome of the die. In this case, rolling the die always splits the
// universe into three copies: one where the outcome of the roll was 1, one
// where it was 2, and one where it was 3.

// The game is played the same as before, although to prevent things from
// getting too far out of hand, the game now ends when either player's score
// reaches at least 21.

// Using the same starting positions as in the example above, player 1 wins in
// 444356092776315 universes, while player 2 merely wins in 341960390180808
// universes.

// Using your given starting positions, determine every possible outcome. Find
// the player that wins in more universes; in how many universes does that
// player win?

const { last } = require('lodash');


const ROLLS = {};


const roll = (loc1, score1, loc2, score2, rollVal, rollId) => {
  const key = [loc1, score1, loc2, score2, rollVal, rollId].join('|');
  if (ROLLS[key]) {
    return ROLLS[key];
  }

  if (rollId < 3) {
    loc1 += rollVal;
  } else {
    loc2 += rollVal;
  }

  if (rollId === 2) {
    loc1 = loc1 % 10 || 10;
    score1 += loc1;

    if (score1 >= 21) {
      ROLLS[key] = [1, 0];
      return ROLLS[key];
    }
  }

  if (rollId === 5) {
    loc2 = loc2 % 10 || 10;
    score2 += loc2;

    if (score2 >= 21) {
      ROLLS[key] = [0, 1];
      return ROLLS[key];
    }
  }

  rollId = (rollId + 1) % 6;

  ROLLS[key] = [1, 2, 3]
    .map(nextVal => roll(loc1, score1, loc2, score2, nextVal, rollId))
    .reduce(([sum1, sum2], [wins1, wins2]) => [sum1 + wins1, sum2 + wins2]);

  return ROLLS[key];
};


module.exports = (inputs) => {
  let loc1 = Number(last(inputs[0]));
  let loc2 = Number(last(inputs[1]));

  const [ wins1, wins2 ] = roll(loc1, 0, loc2, 0, 0, -1);

  return Math.max(wins1, wins2);
};

// Your puzzle answer was 272847859601291.
