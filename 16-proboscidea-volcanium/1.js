'use strict';

// --- Day 16 ---

const { greatest } = require('../lib');


const VALVE_PATTERN = /^Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/;
const FOUND = {};

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

const findGreatestRelief = (valve, time, opened = new Set()) => {
  if (time === 0) {
    return 0;
  }

  const { id, rate, tunnels } = valve;
  const label = `${id}|${time}|${[...opened].sort().join()}`;

  if (FOUND[label] !== undefined) {
    return FOUND[label];
  }

  const branches = [];

  if (rate > 0 && !opened.has(id)) {
    branches.push(rate * (time - 1) + findGreatestRelief(valve, time - 1, new Set([...opened, id])));
  }

  for (const tunnel of tunnels) {
    branches.push(findGreatestRelief(tunnel, time - 1, opened));
  }

  const mostPressure = greatest(branches);
  FOUND[label] = mostPressure;

  return mostPressure;
};


module.exports = (_, rawInput) => {
  const valves = rawInput.split('\n').map(parseValve);
  const start = valves.find(({ id }) => id === 'AA');
  connectTunnels(valves);

  return findGreatestRelief(start, 30);
};
