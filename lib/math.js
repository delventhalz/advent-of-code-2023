const leastCommonMultiple = require('compute-lcm');

const greatestCommonDivisor = (x, y) => {
  if (!y) {
    return Math.abs(x);
  }
  return greatestCommonDivisor(y, x % y);
};

const identity = x => x;

const sum = nums => nums.reduce((total, num) => total + num, 0);

const firstOfSort = (items, sortFn) => items.slice().sort(sortFn)[0];
const least = (items, xform = identity) => (
  firstOfSort(items, (a, b) => xform(a) - xform(b))
);
const greatest = (items, xform = identity) => (
  firstOfSort(items, (a, b) => xform(b) - xform(a))
);

const between = (number, min, max) => number >= min && number < max;

const xor = (a, b) => (a || b) && !(a && b);

const lineToPoints = (x1, y1, x2, y2) => {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;
  const gcd = greatestCommonDivisor(xDiff, yDiff);

  const xSlope = xDiff / gcd;
  const ySlope = yDiff / gcd;

  const points = [];
  let x = x1;
  let y = y1;

  while (true) {
    points.push([x, y]);

    if (x === x2 && y === y2) {
      return points;
    }

    x += xSlope;
    y += ySlope;
  }
};

module.exports = {
  identity,
  sum,
  least,
  greatest,
  between,
  xor,
  leastCommonMultiple,
  greatestCommonDivisor,
  lineToPoints
};
