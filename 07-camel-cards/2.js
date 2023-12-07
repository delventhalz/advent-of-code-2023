/**
 * --- Advent of Code 2023 ---
 *
 * Day 7: Camel Cards
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/7#part2
 */

import { countGroups, greatest, count, sum } from '../lib/index.js';


const CARDS = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

const toCardValue = card => CARDS.indexOf(card) + 1;

const toCardsValue = hand => hand.slice().reverse()
  .reduce((total, card, index) => total + toCardValue(card) * 100 ** index, 0);

const toHandValue = (hand) => {
  const cardCounts = countGroups(hand);

  const jokerCount = cardCounts.J ?? 0;
  const fixedCounts = Object.entries(cardCounts)
    .filter(([kind]) => kind !== 'J')
    .map(([_, count]) => count)
    .sort((a, b) => b - a);

  fixedCounts[0] = (fixedCounts[0] ?? 0) + jokerCount;

  const highCount = greatest(fixedCounts);

  if (highCount === 5) {
    return 70000000000;
  }
  if (highCount === 4) {
    return 60000000000;
  }
  if (fixedCounts.includes(3) && fixedCounts.includes(2)) {
    return 50000000000;
  }
  if (highCount === 3) {
    return 40000000000;
  }
  if (count(fixedCounts, 2) === 2) {
    return 30000000000;
  }
  if (highCount === 2) {
    return 20000000000;
  }
  if (highCount === 1) {
    return 10000000000;
  }
  throw new Error(`What did I do? (${hand.join('')} -> ${JSON.stringify(cardCounts)}!`);
};


export default function main({ lines }) {
  const hands = lines
    .map(line => line.split(' '))
    .map(([hand, bid]) => [hand.split(''), Number(bid)]);

  hands.sort(([handA], [handB]) => {
    return (toCardsValue(handA) + toHandValue(handA)) - (toCardsValue(handB) + toHandValue(handB))
  });

  return sum(hands.map(([_, bid], index) => bid * (index + 1)));
}
