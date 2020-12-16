// Time when stopping at 30,000,000 on a 2018 MacBook Air: 1.004 sec
const memoryGame = (startingNumbers, stopAt) => {
  const memory = new Uint32Array(new ArrayBuffer(stopAt * 4));
  const startingLength = startingNumbers.length;
  let last;

  for (let i = 0; i < startingLength; i += 1) {
    last = startingNumbers[i];
    memory[last] = i;
  }

  // TypedArrays are populated with 0's, so we have to manually skip past
  // the iterations where 0 is a valid remembered index
  memory[0] = startingLength
  last = startingLength;

  for (let i = startingLength + 2; i < stopAt; i += 1) {
    const remembered = memory[last];
    const next = remembered !== 0
      ? i - 1 - remembered
      : 0;

    memory[last] = i - 1;
    last = next;
  }

  return last;
};

// Time when stopping at 30,000,000 on a 2018 MacBook Air: 1.272 sec
//
// Note that this solution is just as slow as a vanilla JS object if
// `memory` is instantiated without a length.
const memoryGameWithSizedArray = (startingNumbers, stopAt) => {
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
  memoryGameWithSizedArray,
  memoryGameWithMap,
  memoryGameWithObject
};
