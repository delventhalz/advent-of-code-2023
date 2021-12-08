'use strict';

// --- Part Two ---

// Through a little deduction, you should now be able to determine the
// remaining digits. Consider again the first example above:

// acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab |
// cdfeb fcadb cdfeb cdbaf

// After some careful analysis, the mapping between signal wires and segments
// only make sense in the following configuration:

//      dddd
//     e    a
//     e    a
//      ffff
//     g    b
//     g    b
//      cccc

// So, the unique signal patterns would correspond to the following digits:

// - acedgfb: 8
// - cdfbe: 5
// - gcdfa: 2
// - fbcad: 3
// - dab: 7
// - cefabd: 9
// - cdfgeb: 6
// - eafb: 4
// - cagedb: 0
// - ab: 1

// Then, the four digits of the output value can be decoded:

// - cdfeb: 5
// - fcadb: 3
// - cdfeb: 5
// - cdbaf: 3

// Therefore, the output value for this entry is 5353.

// Following this same process for each entry in the second, larger example
// above, the output value of each entry can be determined:

// - fdgacbe cefdb cefbgd gcbe: 8394
// - fcgedb cgb dgebacf gc: 9781
// - cg cg fdcagb cbg: 1197
// - efabcd cedba gadfec cb: 9361
// - gecf egdcabf bgf bfgea: 4873
// - gebdcfa ecba ca fadegcb: 8418
// - cefg dcbef fcge gbcadfe: 4548
// - ed bcgafe cdgba cbgef: 1625
// - gbdfcae bgc cg cgb: 8717
// - fgae cfgab fg bagce: 4315

// Adding all of the output values in this larger example produces 61229.

// For each entry, determine all of the wire/segment connections and decode the
// four-digit output values. What do you get if you add up all of the output
// values?

const { count, sum } = require('../lib');

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const generatePossibleSets = () => {
  const possible = {};
  for (const letter of LETTERS) {
    possible[letter] = new Set(LETTERS);
  }
  return possible;
};

const invertSignal = (signal) => {
  return LETTERS.filter(lett => !signal.includes(lett)).join('');
};

const selectPossibilities = (possible, signal) => {
  return signal.split('').map(lett => possible[lett]);
};

const getPruner = (possible) => (signal, keepers) => {
  const inverted = invertSignal(signal);
  const tossers = invertSignal(keepers);

  for (const signalSet of selectPossibilities(possible, signal)) {
    for (const tosser of tossers) {
      signalSet.delete(tosser);
    }
  }

  for (const invertedSet of selectPossibilities(possible, inverted)) {
    for (const keeper of keepers) {
      invertedSet.delete(keeper);
    }
  }
};

const getCounter = (possibilities) => (signal) => {
  const letters = signal.split('');
  return count(possibilities, set => letters.every(lett => set.has(lett)));
};

const decodeLengthFive = (possible, encoded) => {
  const possibilities = selectPossibilities(possible, encoded);
  const countPossibilitiesWith = getCounter(possibilities);

  if (countPossibilitiesWith('cf') === 2) {
    return 3;
  }
  if (countPossibilitiesWith('bd') === 2) {
    return 5;
  }
  if (countPossibilitiesWith('eg') === 2) {
    return 2;
  }
  throw new Error('Unknown length five signal!');
};

const decodeLengthSix = (possible, encoded) => {
  const possibilities = selectPossibilities(possible, encoded);
  const countPossibilitiesWith = getCounter(possibilities);

  if (countPossibilitiesWith('cf') === 1) {
    return 6;
  }
  if (countPossibilitiesWith('bd') === 1) {
    return 0;
  }
  if (countPossibilitiesWith('eg') === 1) {
    return 9;
  }
  throw new Error('Unknown length five signal!');
};

const decode = ({ noise, output }) => {
  const data = [...noise, ...output];
  const possible = generatePossibleSets();
  const prunePossible = getPruner(possible);

  const one = data.find(sig => sig.length === 2);
  if (one) {
    prunePossible(one, 'cf');
  }

  const seven = data.find(sig => sig.length === 3);
  if (seven) {
    prunePossible(seven, 'acf');
  }

  const four = data.find(sig => sig.length === 4);
  if (four) {
    prunePossible(four, 'bcdf');
  }

  const decoded = [];

  for (const signal of output) {
    if (signal.length === 2) {
      decoded.push(1);
    } else if (signal.length === 3) {
      decoded.push(7);
    } else if (signal.length === 4) {
      decoded.push(4);
    } else if (signal.length === 7) {
      decoded.push(8);
    } else if (signal.length === 5) {
      decoded.push(decodeLengthFive(possible, signal));
    } else if (signal.length === 6) {
      decoded.push(decodeLengthSix(possible, signal));
    } else {
      throw new Error('Weird length!');
    }
  }

  return Number(decoded.join(''));
}


module.exports = (inputs) => {
  const signals = inputs.map(line => {
    const [noise, output] = line.split(' | ');
    return {
      noise: noise.split(' '),
      output: output.split(' ')
    };
  });

  return sum(signals.map(decode));
};

// Your puzzle answer was 974512.
