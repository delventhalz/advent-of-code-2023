/**
 * --- Advent of Code 2023 ---
 *
 * Day 7: Camel Cards
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/7
 */

import { countGroups, greatest, count, sum } from '../lib/index.js';


const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const toCardValue = card => CARDS.indexOf(card) + 1;

// The high-card value for a hand is the value of each card summed together,
// but with the preceding card scores multiplied by orders of magnitude.
// Examples:
//   - 23456 ->   102,030,405
//   - AKQJT -> 1,312,111,009
const scoreHighCards = (hand) => {
  const placeValues = hand
    .slice()
    .reverse()
    .map((card, index) => toCardValue(card) * 100 ** index);

  return sum(placeValues);
}

// Hand types are always more valuable than high cards, so the get values the
// next order of magnitude above the best high card value.
const scoreHandType = (hand) => {
  const cardCounts = countGroups(hand);
  const counts = Object.values(cardCounts);
  const highCount = greatest(counts);

  if (highCount === 5) {
    return 70_000_000_000;
  }
  if (highCount === 4) {
    return 60_000_000_000;
  }
  if (counts.includes(3) && counts.includes(2)) {
    return 50_000_000_000;
  }
  if (highCount === 3) {
    return 40_000_000_000;
  }
  if (count(counts, 2) === 2) {
    return 30_000_000_000;
  }
  if (highCount === 2) {
    return 20_000_000_000;
  }
  return 10_000_000_000;
};

// Every hand ends up with a unique numerical value down to the last high card
const scoreHand = hand => scoreHandType(hand) + scoreHighCards(hand);


export default function main({ lines }) {
  const hands = lines
    .map(line => line.split(' '))
    .map(([hand, bid]) => [hand.split(''), Number(bid)]);

  const winnings = hands
    .slice()
    .sort(([handA], [handB]) => scoreHand(handA) - scoreHand(handB))
    .map(([_, bid], index) => bid * (index + 1));

  return sum(winnings);
}
