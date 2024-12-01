/**
 * --- Advent of Code 2023 ---
 *
 * Day 20: Pulse Propagation
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/20
 */

// import {  } from 'lodash-es';
// import {  } from '../lib/index.js';

const pushButton = (mods) => {
  let lowPulses = 0;
  let highPulses = 0;

  // A low pulse is false, a high pulse is true
  let modQueue = [['broadcaster', 'button', false]];

  while (modQueue.length > 0) {
    const [key, source, pulse] = modQueue.shift();

    if (pulse) {
      highPulses += 1;
    } else {
      lowPulses += 1;
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
        for (const output of mod.outputs) {
          modQueue.push([output, key, nextPulse]);
        }
        break;
      }

      default:
        throw new Error(`Bade op: ${mod.op}`);
    }
  }

  return [lowPulses, highPulses];
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

  let lowPulses = 0;
  let highPulses = 0;

  for (let i = 0; i < 1000; i += 1) {
    const counts = pushButton(mods);
    // console.log(i, '-', counts[0], counts[1]);
    lowPulses += counts[0];
    highPulses += counts[1];
  }

  // lowPulses -= 1;
  // highPulses += 1;

  console.log(lowPulses, highPulses);

  return lowPulses * highPulses;
}
