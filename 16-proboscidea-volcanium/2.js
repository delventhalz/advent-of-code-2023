'use strict';

// --- Part Two ---

const { range } = require('lodash');
const { count, greatest } = require('../lib');


const VALVE_PATTERN = /^Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/;
let WORKING_COUNT = Infinity;

// It turns out JS objects with string keys have a limit of 8 million entries
// and Maps have a limit of 16 million entries. I need more than that.
// An array of maps indexed off the time remaining is a reasonably even spread
// with no extra calculations AND it nearly 30x's my entry limit.
const FOUND = range(0, 27).map(() => new Map());

const parseValve = (valveString) => {
  const [_, id, rateString, tunnelString] = valveString.match(VALVE_PATTERN);

  return {
    id,
    rate: Number(rateString),
    tunnelIds: tunnelString.split(', ')
  };
};

const connectTunnels = (valves) => {
  const valveMap = Object.fromEntries(valves.map(valve => [valve.id, valve]));

  for (const valve of valves) {
    valve.tunnels = valve.tunnelIds.map(id => valveMap[id]);
  }
};

// These two functions are part of a working optimization that can cut time
// down by removing nodes with a rate of zero. Unfortunately, I worked it out
// without realizing that I have no idea how to make the variable time passage
// work with my multi-location approach below.
const __wip__connectTunnels = (valves) => {
  const valveMap = Object.fromEntries(valves.map(valve => [valve.id, valve]));

  for (const valve of valves) {
    valve.tunnels = valve.tunnelIds.map((id) => ({
      id,
      to: valveMap[id],
      time: 1
    }));

    delete valve.tunnelIds;
  }
};

const __wip__disconnectBrokenValves = (valves) => {
  const brokenValves = valves.filter(({ rate }) => rate === 0);

  for (const valve of brokenValves) {
    for (const source of valve.tunnels) {
      for (const dest of valve.tunnels) {
        if (source !== dest) {
          const nextTime = source.time + dest.time;
          let nextTunnel = source.to.tunnels.find(({ id }) => id === dest.id);

          if (!nextTunnel || nextTunnel.time > nextTime) {
            nextTunnel = { ...dest, time: nextTime };
          }

          source.to.tunnels = [
            ...source.to.tunnels.filter(({ id }) => id !== nextTunnel.id && id !== valve.id),
            nextTunnel
          ];
        }
      }
    }
  }
};

const toLabel = (...args) => args.sort().join('');

const findGreatestRelief = (loc1, loc2, time, opened) => {
  if (time <= 0 || opened.size >= WORKING_COUNT) {
    return 0;
  }

  const label = toLabel(loc1.id, loc2.id) + toLabel(...opened);
  if (FOUND[time].has(label)) {
    return FOUND[time].get(label);
  }

  const options1 = [];
  const options2 = [];

  if (loc1.rate > 0 && !opened.has(loc1.id)) {
    options1.push(loc1.rate * (time - 1));
  }
  if (loc2.rate > 0 && !opened.has(loc2.id) && loc1 !== loc2) {
    options2.push(loc2.rate * (time - 1));
  }

  for (const tunnel of loc1.tunnels) {
    options1.push(tunnel);
  }
  for (const tunnel of loc2.tunnels) {
    options2.push(tunnel);
  }

  const branches = [];

  for (const opt1 of options1) {
    for (const opt2 of options2) {
      if (typeof opt1 == 'number' && typeof opt2 === 'number') {
        const nextOpened = new Set([...opened, loc1.id, loc2.id]);
        branches.push(opt1 + opt2 + findGreatestRelief(loc1, loc2, time - 1, nextOpened));
      } else if (typeof opt1 == 'number') {
        const nextOpened = new Set([...opened, loc1.id]);
        branches.push(opt1 + findGreatestRelief(loc1, opt2, time - 1, nextOpened));
      } else if (typeof opt2 === 'number') {
        const nextOpened = new Set([...opened, loc2.id]);
        branches.push(opt2 + findGreatestRelief(opt1, loc2, time - 1, nextOpened));
      } else {
        branches.push(findGreatestRelief(opt1, opt2, time - 1, opened));
      }
    }
  }

  const mostRelief = greatest(branches);
  FOUND[time].set(label, mostRelief);
  return mostRelief;
};


module.exports = (_, rawInput) => {
  const valves = rawInput.split('\n').map(parseValve);
  const start = valves.find(({ id }) => id === 'AA');
  WORKING_COUNT = count(valves, ({ rate }) => rate > 0);

  connectTunnels(valves);
  // __wip__disconnectBrokenValves(valves);

  return findGreatestRelief(start, start, 26, new Set([]));
};
