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

module.exports = (inputs) => {
  const numbers = inputs.slice();
  const memory = {};

  for (let i = 0; i < numbers.length; i += 1) {
    memory[numbers[i]]= [i];
  }

  for (let i = numbers.length; i < 30000000; i += 1) {
    const last = numbers[i - 1];
    const record = memory[last];

    if (record.length === 1) {
      numbers.push(0);
      memory[0].push(i);
    } else {
      const say = record[record.length - 1] - record[record.length - 2];
      numbers.push(say);

      if (memory[say]) {
        memory[say].push(i);
      } else {
        memory[say]= [i];
      }
    }
  }

  return numbers[29999999];
};

// Your puzzle answer was 1505722.
