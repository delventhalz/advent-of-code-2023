const memoryGame = (startingNumbers, stopAt) => {
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

// Over 50x slower than the nearly identical Map implementation above.
// Timed on a 2018 MacBook Air:
//   - object: 366.9  sec
//   - Map:      6.98 sec
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
  memoryGameWithObject
};
