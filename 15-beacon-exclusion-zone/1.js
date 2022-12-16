'use strict';

// --- Day 15 ---

const { range } = require('lodash');


const PAIR_PATTERN = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

const parsePair = (pairString) => {
  const [_, sensorX, sensorY, beaconX, beaconY] = pairString.match(PAIR_PATTERN);

  return [
    [Number(sensorX), Number(sensorY)],
    [Number(beaconX), Number(beaconY)]
  ];
};

const getDistance = ([x1, y1], [x2, y2]) => Math.abs(y2 - y1) + Math.abs(x2 - x1);

const toCoordsString = ([x, y]) => `${x},${y}`;

const getEmptiesAt = (row) => ([sensor, beacon]) => {
  const [sensorX] = sensor;

  const beaconDistance = getDistance(sensor, beacon);
  const rowDistance = getDistance(sensor, [sensorX, row]);

  if (rowDistance > beaconDistance) {
    return [];
  }

  const span = beaconDistance - rowDistance;
  return range(sensorX - span, sensorX + span + 1).map(x => toCoordsString([x, row]));
}


module.exports = (_, rawInput) => {
  const pairs = rawInput.split('\n').map(parsePair);
  const empties = new Set(pairs.flatMap(getEmptiesAt(2000000)));

  for (const [_, beacon] of pairs) {
    empties.delete(toCoordsString(beacon));
  }

  return empties.size;
};
