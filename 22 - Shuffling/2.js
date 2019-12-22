// --- Part Two ---

// After a while, you realize your shuffling skill won't improve much more with
// merely a single deck of cards. You ask every 3D printer on the ship to make
// you some more cards while you check on the ship repairs. While reviewing the
// work the droids have finished so far, you think you see Halley's Comet fly
// past!

// When you get back, you discover that the 3D printers have combined their
// power to create for you a single, giant, brand new, factory order deck of
// 119315717514047 space cards.

// Finally, a deck of cards worthy of shuffling!

// You decide to apply your complete shuffle process (your puzzle input) to the
// deck 101741582076661 times in a row.

// You'll need to be careful, though - one wrong move with this many cards and
// you might overflow your entire ship!

// After shuffling your new, giant, factory order deck that many times, what
// number is on the card that ends up in position 2020?

const intoStackDealer = (length) => {
  const last = length - 1;
  return (index) => last - index;
};

const nCardCutter = (length, n) => {
  if (n < 0) {
    return nCardCutter(length, length + n);
  }

  const shift = length - n;

  return (index) => index < n ? shift + index : index - n;
};

const withNDealer = (length, n) => (index) => index * n % length;

const parseShuffles = (length, instructions) => instructions.map(text => {
  if (text === 'deal into new stack') {
    return intoStackDealer(length);
  }

  if (text.slice(0, 3) === 'cut') {
    return nCardCutter(length, Number(text.slice(4)));
  }

  if (text.slice(0, 19) === 'deal with increment') {
    return withNDealer(length, Number(text.slice(20)));
  }

  throw new Error(`Bad instruction text: ${text}`);
});


module.exports = (inputs) => {
  const DECK_LENGTH = 119315717514047;
  const REPETITIONS = 101741582076661;

  const shuffles = parseShuffles(DECK_LENGTH, inputs);
  let index = 2020;

  for (let r = 0; r < REPETITIONS; r++) {
    for (const shuffle of shuffles) {
      index = shuffle(index);
    }
  }

  return index;
};
