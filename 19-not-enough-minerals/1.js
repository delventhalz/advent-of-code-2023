'use strict';

// --- Day 19 ---

// const {  } = require('lodash');
const { sum } = require('../lib');

const BLUEPRINT_PATTERN = /^Blueprint \d+: Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\.$/

const parseBluepint = (blueprint) => {
  const [
    oreBotOreCost,
    clayBotOreCost,
    obsBotOreCost,
    obsBotClayCost,
    geoBotOreCost,
    geoBotObsCost,
  ] = blueprint.match(BLUEPRINT_PATTERN).slice(1).map(Number);

  return [
    [oreBotOreCost, 0, 0, 0],
    [clayBotOreCost, 0, 0, 0],
    [obsBotOreCost, obsBotClayCost, 0, 0],
    [geoBotOreCost, 0, geoBotObsCost, 0],
  ];
};

const findMostGeodes = (blueprint) => {
  const branches = [
    [19, [1, 0, 0, 0], [0, 0, 0, 0]],
  ];

  let geodes = 0;

  while (branches.length > 0) {
    const [time, bots, resources] = branches.pop();

    const isTimeToBuildGeodeBot = (bots[2] + 1) * time + resources[2] >= blueprint[3][2];

    if (time <= 0 || bots[3] === 0 && !isTimeToBuildGeodeBot) {
      if (resources[3] > geodes) {
        geodes = resources[3];
      }
      continue;
    }

    const buildable = isTimeToBuildGeodeBot
      ? blueprint
        .map((costs, type) => {
          return costs.every((cost, t) => (cost <= resources[t])) ? type : -1;
        })
        .filter(type => type !== -1)
      : [];


    bots.forEach((count, type) => {
      resources[type] += count;
    });

    branches.push([time - 1, [...bots], [...resources]]);

    buildable.forEach((type) => {
      const nextBots = [...bots];
      nextBots[type] += 1;

      const nextResources = [...resources];
      blueprint[type].forEach((cost, t) => {
        nextResources[t] -= cost;
      });

      branches.push([time - 1, nextBots, nextResources]);
    });
  }

  return geodes;
};

module.exports = (inputs) => {
  const blueprints = inputs.map(parseBluepint);

  const scores = blueprints.slice(0, 1).map((blueprint, i) => findMostGeodes(blueprint) * (i + 1));

  return sum(scores);
};
