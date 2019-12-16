// --- Day 16 ---

const { range } = require('lodash');
const { sum } = require('../lib/math.js');

const getOnes = (num) => Number(String(num).slice(-1));

const getPhaseFn = (repeatCount) => (index) => {
  switch (Math.floor(index % (4 * repeatCount) / repeatCount)) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 0;
    case 3:
      return -1;
  }
};

const getPhasePatternFn = (length) => (index) => range(length + 1)
  .map(getPhaseFn(index + 1))
  .slice(1);


module.exports = (inputs) => {
  let digits = inputs.split('').map(Number);
  const getPhasePattern = getPhasePatternFn(digits.length);

  for (let times = 0; times < 100; times++) {
    const newDigits = [];

    for (let d = 0; d < digits.length; d++) {
      const phasePattern = getPhasePattern(d);
      const phased = digits.map((digit, i) => digit * phasePattern[i]);
      newDigits.push(getOnes(sum(phased)));
    }

    digits = newDigits;
  }

  return Number(digits.slice(0, 8).join(''));
};
