// Time when stopping at 30,000,000 on a 2018 MacBook Air: 1.272 sec
//
// Note that this solution is just as slow as a vanilla JS object if
// `memory` is instantiated without a length.
const memoryGame = (startingNumbers, stopAt) => {
  const memory = new Array(stopAt);
  let last;

  for (let i = 0; i < startingNumbers.length; i += 1) {
    last = startingNumbers[i];
    memory[last] = i;
  }

  for (let i = startingNumbers.length; i < stopAt; i += 1) {
    const remembered = memory[last];
    const next = remembered !== undefined
      ? i - 1 - remembered
      : 0;

    memory[last] = i - 1;
    last = next;
  }

  return last;
};

// Time when stopping at 30,000,000 on a 2018 MacBook Air: 6.98 sec
const memoryGameWithMap = (startingNumbers, stopAt) => {
  const memory = new Map();
  let last;

  for (let i = 0; i < startingNumbers.length; i += 1) {
    last = startingNumbers[i];
    memory.set(last, i);
  }

  for (let i = startingNumbers.length; i < stopAt; i += 1) {
    const next = memory.has(last)
      ? i - 1 - memory.get(last)
      : 0;

    memory.set(last, i - 1);
    last = next;
  }

  return last;
};

// Time when stopping at 30,000,000 on a 2018 MacBook Air: 366.9 sec
const memoryGameWithObject = (startingNumbers, stopAt) => {
  const memory = {};
  let last;

  for (let i = 0; i < startingNumbers.length; i += 1) {
    last = startingNumbers[i];
    memory[last] = i;
  }

  for (let i = startingNumbers.length; i < stopAt; i += 1) {
    const remembered = memory[last];
    const next = remembered !== undefined
      ? i - 1 - remembered
      : 0;

    memory[last] = i - 1;
    last = next;
  }

  return last;
};

module.exports = {
  memoryGame,
  memoryGameWithMap,
  memoryGameWithObject
};
