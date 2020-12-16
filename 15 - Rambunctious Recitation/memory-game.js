const memoryGame = (startingNumbers, stopAt) => {
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
  memoryGame
};
