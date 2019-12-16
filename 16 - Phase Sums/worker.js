const { parentPort, workerData } = require('worker_threads');

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

const { start, stop, digits } = workerData;
const newDigits = [];

for (let reps = start; reps < stop; reps++) {
  newDigits.push(ones(quickPhasedSum(digits, reps)));
}

parentPort.postMessage(newDigits);
