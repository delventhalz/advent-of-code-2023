'use strict';

// --- Part Two ---

const PAIR_PATTERN = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

const getDistance = (x1, y1, x2, y2) => Math.abs(y2 - y1) + Math.abs(x2 - x1);

const parseSensor = (sensorString) => {
  const captures = sensorString.match(PAIR_PATTERN);
  const [sensorX, sensorY, beaconX, beaconY] = captures.slice(1).map(Number);
  const range = getDistance(sensorX, sensorY, beaconX, beaconY);

  return [sensorX, sensorY, range];
};

const getStrongestSensor = (x, y, sensors) => {
  let strength = -1;
  let strongest = null;

  for (const sensor of sensors) {
    const [sensorX, sensorY, range] = sensor;
    const nextStrength = range - getDistance(x, y, sensorX, sensorY);

    if (nextStrength > strength) {
      strongest = sensor;
    }
  }

  return strongest;
};

const findEmptySpot = (sensors) => {
  for (let y = 0; y <= 4000000; y += 1) {
    for (let x = 0; x <= 4000000; x += 1) {
      const strongest = getStrongestSensor(x, y, sensors);

      if (!strongest) {
        return [x, y];
      }

      const [sensorX, sensorY, range] = strongest;
      x = sensorX + range - Math.abs(sensorY - y);
    }
  }

  return null;
};


module.exports = (_, rawInput) => {
  const sensors = rawInput.split('\n').map(parseSensor);
  const [x, y] = findEmptySpot(sensors);

  return x * 4000000 + y;
};
