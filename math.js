const identity = x => x;
const sum = nums => nums.reduce((total, num) => total + num, 0);

const firstOfSort = (items, sortFn) => items.slice().sort(sortFn)[0];
const least = (items, xform = identity) => (
  firstOfSort(items, (a, b) => xform(a) - xform(b))
);
const greatest = (items, xform = identity) => (
  firstOfSort(items, (a, b) => xform(b) - xform(a))
);

module.exports = {
  identity,
  sum,
  least,
  greatest
};
