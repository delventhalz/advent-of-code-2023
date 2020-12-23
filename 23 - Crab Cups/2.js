// --- Part Two ---

// Due to what you can only assume is a mistranslation (you're not exactly
// fluent in Crab), you are quite surprised when the crab starts arranging many
// cups in a circle on your raft - one million (1000000) in total.

// Your labeling is still correct for the first few cups; after that, the
// remaining cups are just numbered in an increasing fashion starting from the
// number after the highest number in your list and proceeding one by one until
// one million is reached. (For example, if your labeling were 54321, the cups
// would be numbered 5, 4, 3, 2, 1, and then start counting up from 6 until one
// million is reached.) In this way, every number from one through one million
// is used exactly once.

// After discovering where you made the mistake in translating Crab Numbers,
// you realize the small crab isn't going to do merely 100 moves; the crab is
// going to do ten million (10000000) moves!

// The crab is going to hide your stars - one each - under the two cups that
// will end up immediately clockwise of cup 1. You can have them if you predict
// what the labels on those cups will be when the crab is finished.

// In the above example (389125467), this would be 934001 and then 159792;
// multiplying these together produces 149245887792.

// Determine which two cups will end up immediately clockwise of cup 1. What do
// you get if you multiply their labels together?

const CUP_COUNT = 1000000;
const MOVE_COUNT = 10000000;
const REMOVE_COUNT = 3;

const LOWEST = [1, 2, 3, 4];
const HIGHEST = [CUP_COUNT, CUP_COUNT - 1, CUP_COUNT - 2, CUP_COUNT - 3];

const lowestPresent = removed => LOWEST.find(num => !removed.includes(num));
const highestPresent = removed => HIGHEST.find(num => !removed.includes(num));


const move = (nexts, current) => {
  const removed = [];

  let nextToRemove = current;
  for (let i = 0; i < REMOVE_COUNT; i += 1) {
    nextToRemove = nexts[nextToRemove];
    removed.push(nextToRemove);
  }

  let destination = current - 1;
  while (removed.includes(destination)) {
    destination -= 1;
  }

  if (destination < lowestPresent(removed)) {
    destination = highestPresent(removed);
  }

  const removedNext = nexts[nextToRemove];
  const destinationNext = nexts[destination];

  nexts[current] = removedNext;
  nexts[destination] = removed[0];
  nexts[nextToRemove] = destinationNext;

  return nexts[current];
};


module.exports = (inputs) => {
  const ogCups = inputs.split('').map(Number);
  const ogCount = ogCups.length;

  // An array of pointers to the next cup, where the key is the cup value
  const nexts = new Uint32Array(CUP_COUNT + 1);

  // Add original cup values to array of pointers
  for (let i = 0; i < ogCount - 1; i += 1) {
    nexts[ogCups[i]] = ogCups[i + 1];
  }
  nexts[ogCups[ogCount - 1]] = ogCount + 1;

  // Add generated cup values to array of pointers
  for (let i = ogCount + 1; i < CUP_COUNT; i += 1) {
    nexts[i] = i + 1;
  }
  nexts[CUP_COUNT] = ogCups[0];

  // Move cups
  let current = ogCups[0];
  for (let i = 0; i < MOVE_COUNT; i += 1) {
    current = move(nexts, current);
  }

  return nexts[1] * nexts[nexts[1]];
};

// Your puzzle answer was 170836011000.
