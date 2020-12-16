// When stopping at 30,000,000 on a 2018 MacBook Air:
//  - Time:   0.93 sec
//  - Memory: 116 MB
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

// When stopping at 30,000,000 on a 2018 MacBook Air:
//  - Time:   1.22 sec
//  - Memory: 238 MB
//
// Note that this solution is slower than a vanilla JS object if
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

// When stopping at 30,000,000 on a 2018 MacBook Air:
//  - Time:   6.86 sec
//  - Memory: 234 MB
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

// When stopping at 30,000,000 on a 2018 MacBook Air:
//  - Time:   343 sec
//  - Memory: 4 GB
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
