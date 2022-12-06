'use strict';

// --- Part Two ---

// As you watch the crane operator expertly rearrange the crates, you notice the
// process isn't following your prediction.

// Some mud was covering the writing on the side of the crane, and you quickly
// wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

// The CrateMover 9001 is notable for many new and exciting features: air
// conditioning, leather seats, an extra cup holder, and the ability to pick up
// and move multiple crates at once.

// Again considering the example above, the crates begin in the same
// configuration:

//     [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// Moving a single crate from stack 2 to stack 1 behaves the same as before:

// [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// However, the action of moving three crates from stack 1 to stack 3 means that
// those three moved crates stay in the same order, resulting in this new
// configuration:

//         [D]
//         [N]
//     [C] [Z]
//     [M] [P]
//  1   2   3

// Next, as both crates are moved from stack 2 to stack 1, they retain their
// order as well:

//         [D]
//         [N]
// [C]     [Z]
// [M]     [P]
//  1   2   3

// Finally, a single crate is still moved from stack 1 to stack 2, but now it's
// crate C that gets moved:

//         [D]
//         [N]
//         [Z]
// [M] [C] [P]
//  1   2   3

// In this example, the CrateMover 9001 has put the crates in a totally
// different order: MCD.

// Before the rearrangement process finishes, update your simulation so that the
// Elves know where they should stand to be ready to unload the final supplies.
// After the rearrangement procedure completes, what crate ends up on top of
// each stack?

const { last } = require('lodash');


const parseStackString = (stackString) => {
  const [keyString, ...crateStrings] = stackString.split('\n').reverse();

  const indexes = [];
  const stacks = {};

  for (const [i, key] of Object.entries(keyString)) {
    if (key !== ' ') {
      stacks[key] = [];
      indexes.push([i, key]);
    }
  }

  for (const crateString of crateStrings) {
    for (const [i, key] of indexes) {
      const crate = crateString[i];

      if (crate && crate !== ' ') {
        stacks[key].push(crate);
      }
    }
  }

  return stacks;
};

const parseInstructionsString = (instructionsString) => {
  return instructionsString.split('\n').map(str => {
    const [_, count, from, to] = str.match(/move (\d+) from (.) to (.)/);
    return [Number(count), from, to];
  });
};


module.exports = (_, rawInput) => {
  const [stackString, instructionsString] = rawInput.split('\n\n');
  const stacks = parseStackString(stackString);
  const instructions = parseInstructionsString(instructionsString);

  for (const [count, from, to] of instructions) {
    const crates = stacks[from].splice(-count);
    stacks[to].push(...crates);
  }

  return Object.values(stacks).map(last).join('');
};

// Your puzzle answer was BRZGFVBTJ.
