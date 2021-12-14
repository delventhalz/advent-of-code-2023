'use strict';

// --- Part Two ---

// The resulting polymer isn't nearly strong enough to reinforce the submarine.
// You'll need to run more steps of the pair insertion process; a total of 40
// steps should do it.

// In the above example, the most common element is B (occurring 2192039569602
// times) and the least common element is H (occurring 3849876073 times);
// subtracting these produces 2188189693529.

// Apply 40 steps of pair insertion to the polymer template and find the most
// and least common elements in the result. What do you get if you take the
// quantity of the most common element and subtract the quantity of the least
// common element?

const { last } = require('lodash');
const { chunkOverlap, mergeReduced } = require('../lib');


const RULES = {};
const RESULTS = {};


const countOutputs = (pair, toDepth) => {
  if (!RESULTS[pair]) {
    RESULTS[pair] = [];
  }

  if (RESULTS[pair][toDepth]) {
    return RESULTS[pair][toDepth];
  }

  if (toDepth === 0) {
    return { [pair[1]]: 1 };
  }

  const childCounts = RULES[pair].map(out => countOutputs(out, toDepth - 1));
  const counts = mergeReduced(childCounts, (sum, count) => sum + count);

  RESULTS[pair][toDepth] = counts;
  return counts;
};


module.exports = (_, rawInput) => {
  const [template, rules] = rawInput.split('\n\n');
  const pairs = chunkOverlap(template, 2);

  for (const [input, output] of rules.split('\n').map(r => r.split (' -> '))) {
    RULES[input] = [
      input[0] + output,
      output + input[1]
    ];
  }

  const counts = pairs.map(pair => countOutputs(pair, 40))

  const totals = mergeReduced(counts, (total, count) => total + count);
  totals[template[0]] += 1

  const sortedTotals = Object.values(totals).sort((a, b) => a - b)
  return last(sortedTotals) - sortedTotals[0];
};

// Your puzzle answer was 4332887448171.
