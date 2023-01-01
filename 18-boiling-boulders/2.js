'use strict';

// --- Part Two ---

// Something seems off about your calculation. The cooling rate depends on
// exterior surface area, but your calculation also included the surface area
// of air pockets trapped in the lava droplet.

// Instead, consider only cube sides that could be reached by the water and
// steam as the lava droplet tumbles into the pond. The steam will expand to
// reach as much as possible, completely displacing any air on the outside of
// the lava droplet but never expanding diagonally.

// In the larger example above, exactly one cube of air is trapped within the
// lava droplet (at 2,2,5), so the exterior surface area of the lava droplet is
// 58.

// What is the exterior surface area of your scanned lava droplet?

const { greatest, least } = require('../lib');


const getStart = (coordList) => {
  const [x, y, z] = greatest(coordList, ([x]) => x);
  return [x + 1, y, z];
};

const getAdjacent = ([x, y, z]) => {
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];
};

const isInBounds = ([x, y, z], bounds) => {
  if (x < bounds.left || x > bounds.right) {
    return false;
  }
  if (y < bounds.top || y > bounds.bottom) {
    return false;
  }
  if (z < bounds.in || z > bounds.out) {
    return false;
  }

  return true;
};


module.exports = (inputs) => {
  const voxels = new Set(inputs.map(coords => coords.join()));

  const bounds = {
    left: least(inputs.map(([x]) => x)) - 1,
    right: greatest(inputs.map(([x]) => x)) + 1,
    top: least(inputs.map(([_, y]) => y)) - 1,
    bottom: greatest(inputs.map(([_, y]) => y)) + 1,
    in: least(inputs.map(([_, __, z]) => z)) - 1,
    out: greatest(inputs.map(([_, __, z]) => z)) + 1,
  };

  const toVisit = [getStart(inputs)];
  const visited = new Set();
  let surface = 0;

  while(toVisit.length > 0) {
    const coords = toVisit.pop();
    if (visited.has(coords.join())) {
      continue;
    }

    visited.add(coords.join());

    for (const adjacent of getAdjacent(coords)) {
      const adjacentLabel = adjacent.join();

      if (voxels.has(adjacentLabel)) {
        surface += 1;
      } else if (!visited.has(adjacentLabel) && isInBounds(adjacent, bounds)) {
        toVisit.push(adjacent);
      }
    }
  }

  return surface;
};

// Your puzzle answer was 2010.
