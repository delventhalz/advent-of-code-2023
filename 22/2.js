// --- Part Two ---

const playHand = (deck1, deck2) => {
  const card1 = deck1.shift();
  const card2 = deck2.shift();

  const isDeck1Win = deck1.length >= card1 && deck2.length >= card2
    ? playGame(deck1.slice(card1), deck2.slice(card2))
    : card1 > card2;

  if (isDeck1Win) {
    deck1.push(card1, card2);
  } else {
    deck2.push(card2, card1);
  }
};

const playGame = (deck1, deck2) => {
  const seen = new Set()

  while (deck1.length > 0 && deck2.length > 0) {
    const snapshot = deck1.join() + '|' + deck2.join();

    if (seen.has(snapshot)) {
      return true;
    }

    seen.add(snapshot);

    playHand(deck1, deck2);
  }

  return deck1.length > 0;
};

const scoreDeck = deck => (
  deck
    .slice()
    .reverse()
    .reduce((points, card, i) => (i + 1) * card + points, 0)
);

module.exports = (inputs) => {
  const deck1 = inputs[0].slice(1);
  const deck2 = inputs[1].slice(1);

  const isDeck1Win = playGame(deck1, deck2);

  return scoreDeck(isDeck1Win ?deck1 : deck2);
};
