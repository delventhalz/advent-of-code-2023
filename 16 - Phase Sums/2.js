// --- Day 16 ---

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
