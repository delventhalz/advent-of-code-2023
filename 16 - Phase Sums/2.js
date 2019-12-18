// --- Part Two ---

// Now that your FFT is working, you can decode the real signal.

// The real signal is your puzzle input repeated 10000 times. Treat this new
// signal as a single input list. Patterns are still calculated as before, and
// 100 phases of FFT are still applied.

// The first seven digits of your initial input signal also represent the
// message offset. The message offset is the location of the eight-digit
// message in the final output list. Specifically, the message offset indicates
// the number of digits to skip before reading the eight-digit message. For
// example, if the first seven digits of your initial input signal were
// 1234567, the eight-digit message would be the eight digits after skipping
// 1,234,567 digits of the final output list. Or, if the message offset were 7
// and your final output list were 98765432109876543210, the eight-digit
// message would be 21098765. (Of course, your real message offset will be a
// seven-digit number, not a one-digit number like 7.)

// Here is the eight-digit message in the final output list after 100 phases.
// The message offset given in each input has been highlighted. (Note that the
// inputs given below are repeated 10000 times to find the actual starting
// input lists.)

// - 03036732577212944063491565474664 becomes 84462026.
// - 02935109699940807407585447034323 becomes 78725270.
// - 03081770884921959731165446850517 becomes 53553731.

// After repeating your input signal 10000 times and running 100 phases of FFT,
// what is the eight-digit message embedded in the final output list?

const { range } = require('lodash');
const { loop, print, wait } = require('../lib/animation.js');


const PHASE_COUNT = 100;
const PRINT_FREQUENCY = 100;

const min = (a, b) => a < b ? a : b;
const ones = (num) => num < 0 ? -num % 10 : num % 10;

const sumSlice = (nums, start, desiredStop) => {
  const stop = min(nums.length, desiredStop);
  let sum = 0;

  for (let i = start; i < stop; i++) {
    sum += nums[i];
  }

  return sum;
};

const quickPhasedSum = (nums, repetitions) => {
  const stop = nums.length;
  let sum = 0;
  let index = repetitions - 1;
  let shouldAdd = true;

  while (index < stop) {
    if (shouldAdd) {
      sum += sumSlice(nums, index, index + repetitions);
    } else {
      sum -= sumSlice(nums, index, index + repetitions);
    }
    index += repetitions + repetitions;
    shouldAdd = !shouldAdd;
  }

  return sum;
};

const getMessage = (digits, offset = 0) => (
  Number(digits.slice(offset, offset + 8).join(''))
);


module.exports = async (inputs) => {
  // let digits = inputs.split('').map(Number);
  // const offset = 0;

  const initialDigits = inputs.split('').map(Number);
  const offset = Number(initialDigits.slice(0, 7).join(''));
  let digits = range(10000).flatMap(() => initialDigits);

  let times = 0;

  // Print status
  loop(() => {
    const indicators = ['|', '/', '-', '\\'];
    const indicator = indicators[Math.floor(Date.now() / PRINT_FREQUENCY) % 4];

    print(`${indicator} : ${times} : ${getMessage(digits, offset)}`);
    return times < PHASE_COUNT;
  }, PRINT_FREQUENCY);

  // Run
  while (times < PHASE_COUNT) {
    const newDigits = [];
    const stop = digits.length + 1;

    for (let reps = 1; reps < stop; reps++) {
      newDigits.push(ones(quickPhasedSum(digits, reps)));
    }

    digits = newDigits;
    times += 1;
  }

  // Wait for print-loop to terminate before returning
  await wait(PRINT_FREQUENCY * 2);
  return getMessage(digits, offset);
};
