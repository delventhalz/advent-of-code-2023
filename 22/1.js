// --- Part Two ---

// const {  } = require('lodash');
// const {  } = require('../lib');

const playHand = (deck1, deck2) => {
  const card1 = deck1.shift();
  const card2 = deck2.shift();

  if (card1 > card2) {
    deck1.push(card1, card2);
  } else {
    deck2.push(card2, card1);
  }
};

module.exports = (inputs) => {
  const deck1 = inputs[0].slice(1);
  const deck2 = inputs[1].slice(1);

  while (deck1.length > 0 && deck2.length > 0) {
    playHand(deck1, deck2);
  }

  return deck1.reverse().reduce((points, card, i) => (i + 1) * card + points, 0);
};
