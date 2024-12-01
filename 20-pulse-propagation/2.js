/**
 * --- Advent of Code 2023 ---
 *
 * Day 20: Pulse Propagation
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/20#part2
 */

import { uniq } from 'lodash-es';
// import {  } from '../lib/index.js';

const FUNNEL = [
  ['%jr', '%gz', '%zp', '%sj', '%xz', '%lq', '%pp', '%zl', '%hx', '%cm', '%jx', '%zt', '%bn', '%fj', '%fq', '%vm', '%cn', '%np', '%gb', '%ln', '%fb', '%cq', '%cv', '%sx', '%kh', '%qj', '%pf', '%rq', '%nv', '%dx', '%ht', '%hn', '%qn', '%rr', '%cf'],
  ['&mq', '&tz', '&xf', '&tg'],
  ['&lh', '&fk', '&ff', '&mm'],
  ['&nr'],
  ['!rx']
];

const pushButton = (mods) => {
  const pulses = {};

  // A low pulse is false, a high pulse is true
  let modQueue = [['broadcaster', 'button', false]];

  while (modQueue.length > 0) {
    const [key, source, pulse] = modQueue.shift();

    if (!pulses[key]) {
      pulses[key] = [0, 0];
    }

    if (pulse) {
      pulses[key][1] += 1;
    } else {
      pulses[key][1] += 1;
    }

    // Unlisted modules like "output" have no behavior
    const mod = mods[key];
    if (!mod) {
      continue;
    }

    switch (mod.op) {
      case null: {
        for (const output of mod.outputs) {
          modQueue.push([output, key, pulse]);
        }
        break;
      }

      case '%': {
        if (!pulse) {
          mod.state = !mod.state;
          for (const output of mod.outputs) {
            modQueue.push([output, key, mod.state]);
          }
        }
        break;
      }

      case '&': {
        mod.state[source] = pulse;
        const nextPulse = !Object.values(mod.state).every(Boolean);
        if (FUNNEL[1].map(k => k.slice(1)).includes(key)) {
          console.log(key, '-', Object.values(mod.state).filter(Boolean).length, '/', Object.values(mod.state).length);
        }
        for (const output of mod.outputs) {
          modQueue.push([output, key, nextPulse]);
        }
        break;
      }

      default:
        throw new Error(`Bade op: ${mod.op}`);
    }
  }

  // for (const level of FUNNEL) {
  //   const levelEntries = level.map(mod => [mod, pulses[mod.slice(1)]]);
  //   console.log(Object.fromEntries(levelEntries));
  // }

  return pulses.rx;
};

export default function main({ lines }) {
  const modEntries = lines
    .map(line => line.split(' -> '))
    .map(([input, output]) => [
      ...(input === 'broadcaster' ? [null, input] : [input[0], input.slice(1)]),
      output.split(', ')
    ])
    .map(([op, key, outputs]) => [key, { key, op, outputs }])
    .map(([key, mod]) => [key, { ...mod, state: mod.op === '&' ? {} : false }]);

  for (const [key, mod] of modEntries) {
    if (mod.op === '%') {
      mod.state = false;
    }

    if (mod.op === '&') {
      const stateEntries = modEntries
        .filter(([_, input]) => input.outputs.includes(key))
        .map(([inputKey]) => [inputKey, false]);

      mod.state = Object.fromEntries(stateEntries);
    }
  }

  const mods = Object.fromEntries(modEntries);

  // let level = ['rx'];
  // let nextLevel = [];

  // console.log('rx');

  // while (true) {
  //   const key = level.shift();

  //   if (key) {
  //     const inputs = modEntries
  //       .filter(([_, input]) => input.outputs.includes(key))
  //       .map(([inputKey]) => inputKey);
  //     nextLevel = uniq([...nextLevel, ...inputs]);
  //   } else if (nextLevel.length === 0) {
  //     break;
  //   } else {
  //     level = nextLevel;
  //     nextLevel = [];
  //     const labels = level.map(key => mods[key].op + key);
  //     console.log(labels.join(' '));
  //   }
  // }

  let presses = 0;

  while (true) {
    presses += 1

    console.log('-----', presses, '-----');
    const [lowPulses, highPulses] = pushButton(mods);
    // console.log(presses, '-', lowPulses, highPulses);
    if (lowPulses === 1) {
      return presses;
    }
    console.log();
  }
}
