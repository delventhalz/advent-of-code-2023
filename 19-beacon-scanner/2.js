'use strict';

// --- Part Two ---

// Sometimes, it's a good idea to appreciate just how big the ocean is. Using
// the Manhattan distance, how far apart do the scanners get?

// In the above example, scanners 2 (1105,-1205,1229) and 3 (-92,-2380,-20) are
// the largest Manhattan distance apart. In total, they are 1197 + 1175 + 1249
// = 3621 units apart.

// What is the largest Manhattan distance between any two scanners?

const { hasProp } = require('../lib');


const dist3d = ([x1, y1, z1], [x2, y2, z2]) => {
  return (z2 - z1) ** 2 + (y2 - y1) ** 2 + (x2 - x1) ** 2;
};

const distManhattan = ([x1, y1, z1], [x2, y2, z2]) => {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
};

const mergeMatch = (sets, threshold) => {
  for (const set of sets) {
    for (const other of sets) {
      if (set !== other) {
        let matches = 0;

        for (const item of set) {
          if (other.has(item)) {
            matches += 1;
          }

          if (matches >= threshold) {
            sets.add(new Set([...set, ...other]));
            sets.delete(set);
            sets.delete(other);
            return true;
          }
        }
      }
    }
  }

  return false;
};

const findMatch = (sets, target) => {
  const partials = new Set(sets);

  for (const item of target) {
    for (const set of partials) {
      if (!set.has(item)) {
        partials.delete(set);
      }

      if (partials.size === 1) {
        return [...partials][0];
      }
    }
  }

  return null;
};


const locateScanner = (scanner, [x, y, z]) => {
  scanner.x = x;
  scanner.y = y;
  scanner.z = z;

  scanner.beacons.forEach((beacon, i) => {
    const [relX, relY, relZ] = scanner.beaconCoords[i];
    beacon.x = x + relX;
    beacon.y = y + relY;
    beacon.z = z + relZ;
  });
}


const fillCoords = (scanners) => {
  let foundEmpty = false;

  scanners.forEach((scanner) => {
    if (!hasProp(scanner, 'x')) {
      foundEmpty = true;
      const { beacons, beaconCoords } = scanner;
      const cipherIndex = beacons.findIndex(beacon => hasProp(beacon, 'x'));

      if (cipherIndex !== -1) {
        const cipher = beacons[cipherIndex];
        const [relX, relY, relZ] = beaconCoords[cipherIndex];

        locateScanner(scanner, [
          cipher.x - relX,
          cipher.y - relY,
          cipher.z - relZ
        ]);
      }
    }
  });

  return foundEmpty;
}

module.exports = (_, rawInput) => {
  const scannerCoords = rawInput
    .split('\n\n')
    .map(scn => (
      scn
        .split('\n')
        .slice(1)
        .map(bcn => bcn.split(',').map(Number))
    ));

  const scannerDists = scannerCoords.map(beacons => {
    const edgeGroups = [];

    for (const beacon of beacons) {
      const edges = new Set();

      for (const other of beacons) {
        if (beacon !== other) {
          edges.add(dist3d(beacon, other));
        }
      }

      edgeGroups.push(edges);
    }

    return edgeGroups;
  });

  const beaconSet = new Set(scannerDists.flat());
  //eslint-disable-next-line no-empty
  while (mergeMatch(beaconSet, 3)) {}

  console.log('Beacon count:', beaconSet.size);

  const scanners = scannerDists.map((dists, i) => ({
    beacons: dists.map(distSet => findMatch(beaconSet, distSet)),
    beaconCoords: scannerCoords[i]
  }));

  locateScanner(scanners[0], [0, 0, 0]);
  //eslint-disable-next-line no-empty
  while (fillCoords(scanners)) {}

  console.log('Scanners locations:\n', scanners.map(({ x, y, z }) => [x, y, z]));

  let farthest = 0;
  let a = null;
  let b = null;

  for (let scanner of scanners) {
    for (let other of scanners) {
      if (scanner !== other) {
        const dist = distManhattan(
          [scanner.x, scanner.y, scanner.z],
          [other.x, other.y, other.z]
        );

        if (dist > farthest) {
          farthest = dist;
          a = scanner;
          b = other;
        }
      }
    }
  }


  console.log('Farthest A:', scanners.indexOf(a), a.x, a.y, a.z);
  console.log('Farthest B:', scanners.indexOf(b), b.x, b.y, b.z);

  return farthest;
};
