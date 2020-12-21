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

module.exports = {
  identity,
  sum,
  least,
  greatest,
  between,
  xor
};
