import lcm from 'compute-lcm';


/**
 * Returns the least common multiple for two or more numbers.
 * Can be specified as separate parameters or an array of numbers.
 *
 * Full docs:
 *   - https://github.com/compute-io/lcm
 *
 * @param {number[]} ...numbers - two or more numbers
 * @returns {number} the least common multiple
 */
export const leastCommonMultiple = lcm;

/**
 * Returns the greatest common divisor for two numbers.
 *
 * @param {number} x - the first number
 * @param {number} y - the second number
 * @returns {number} the greatest common divisor
 */
export const greatestCommonDivisor = (x, y) => {
  if (!y) {
    return Math.abs(x);
  }
  return greatestCommonDivisor(y, x % y);
};

/**
 * Accepts a numerator and denominator and returns a tuple with a reduced
 * numerator/denominator pair.
 *
 * @param {number} numerator
 * @param {number} denominator
 * @returns {number[]} a reduced numerator and denominator
 */
 const reduceFraction = (numerator, denominator) => {
  const gcd = greatestCommonDivisor(numerator, denominator);

  return [
    numerator / gcd,
    denominator / gcd
  ];
};

/**
 * Returns the same value back again.
 *
 * @param {*} x - the value
 * @returns {*} the same value
 */
export const identity = x => x;

/**
 * Sums an array of numbers.
 *
 * @param {number[]} nums - an array of numbers
 * @returns {number} the sum of all numbers
 */
export const sum = nums => nums.reduce((total, num) => total + num, 0);

const firstOfSort = (items, sortFn) => items.slice().sort(sortFn)[0];

/**
 * Returns the least item in an array. Accepts an optional mapping function
 * to transform each item before comparing.
 *
 * @param {Array} items - an array of values to compare
 * @param {function} [xform] - a mapping function
 * @returns {*} the least item in the array
 */
export const least = (items, xform = identity) => (
  firstOfSort(items, (a, b) => xform(a) - xform(b))
);

/**
 * Returns the greatest item in an array. Accepts an optional mapping function
 * to transform each item before comparing.
 *
 * @param {Array} items - an array of values to compare
 * @param {function} [xform] - a mapping function
 * @returns {*} the greatest item in the array
 */
export const greatest = (items, xform = identity) => (
  firstOfSort(items, (a, b) => xform(b) - xform(a))
);

/**
 * Checks if a number is between a min (inclusive) and max (non-inclusive).
 *
 * @param {number} number - the number to check
 * @param {number} min - the start of the valid range
 * @param {number} min - the end of the valid range (non-inclusive)
 * @returns {boolean} whether the number is between the min and max
 */
export const between = (number, min, max) => number >= min && number < max;

/**
 * Runs an exclusive-OR (XOR) operation on two values.
 *
 * @param {*} a - the first value
 * @param {*} b - the second value
 * @returns {boolean} whether the values pass the XOR
 */
export const xor = (a, b) => (a || b) && !(a && b);

/**
 * Takes a line defined by four points and returns an array of X/Y tuples.
 * Each pair of coordinates corresponds to a point on the line
 * (including both the start and end points).
 *
 * Note that points are only included if they have whole integer coordinates.
 *
 * @param {number} x1 - the X of the start point
 * @param {number} y1 - the Y of the start point
 * @param {number} x2 - the X of the end point
 * @param {number} y2 - the Y of the end point
 * @returns {Array<Array<number>>} an array of X/Y tuples
 */
export const lineToPoints = (x1, y1, x2, y2) => {
  const [ySlope, xSlope] = reduceFraction(y2 - y1, x2 - x1);
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
