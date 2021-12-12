'use strict';

// --- Part Two ---

// After reviewing the available paths, you realize you might have time to
// visit a single small cave twice. Specifically, big caves can be visited any
// number of times, a single small cave can be visited at most twice, and the
// remaining small caves can be visited at most once. However, the caves named
// start and end can only be visited exactly once each: once you leave the
// start cave, you may not return to it, and once you reach the end cave, the
// path must end immediately.

// Now, the 36 possible paths through the first example above are:

//     start,A,b,A,b,A,c,A,end
//     start,A,b,A,b,A,end
//     start,A,b,A,b,end
//     start,A,b,A,c,A,b,A,end
//     start,A,b,A,c,A,b,end
//     start,A,b,A,c,A,c,A,end
//     start,A,b,A,c,A,end
//     start,A,b,A,end
//     start,A,b,d,b,A,c,A,end
//     start,A,b,d,b,A,end
//     start,A,b,d,b,end
//     start,A,b,end
//     start,A,c,A,b,A,b,A,end
//     start,A,c,A,b,A,b,end
//     start,A,c,A,b,A,c,A,end
//     start,A,c,A,b,A,end
//     start,A,c,A,b,d,b,A,end
//     start,A,c,A,b,d,b,end
//     start,A,c,A,b,end
//     start,A,c,A,c,A,b,A,end
//     start,A,c,A,c,A,b,end
//     start,A,c,A,c,A,end
//     start,A,c,A,end
//     start,A,end
//     start,b,A,b,A,c,A,end
//     start,b,A,b,A,end
//     start,b,A,b,end
//     start,b,A,c,A,b,A,end
//     start,b,A,c,A,b,end
//     start,b,A,c,A,c,A,end
//     start,b,A,c,A,end
//     start,b,A,end
//     start,b,d,b,A,c,A,end
//     start,b,d,b,A,end
//     start,b,d,b,end
//     start,b,end

// The slightly larger example above now has 103 paths through it, and the even
// larger example now has 3509 paths through it.

// Given these new rules, how many paths through this cave system are there?


const isSmall = (cave) => cave.toLowerCase() === cave;

const mapConnections = (pairs) => {
  const map = {};

  for (const [a, b] of pairs) {
    if (!map[a]) {
      map[a] = [];
    }
    if (!map[b]) {
      map[b] = [];
    }

    map[a].push(b);
    map[b].push(a);
  }

  return map;
};

const traverse = (map, room, path, blocked, double) => {
  const nextPath = [...path, room]
  if (room === 'end') {
    return [nextPath];
  }

  const nextBlocked = new Set(blocked);
  if (isSmall(room)) {
    nextBlocked.add(room);
  }

  return map[room]
    .filter(connect => connect !== 'start')
    .filter(connect => !double || !nextBlocked.has(connect))
    .flatMap((connect) => {
      return nextBlocked.has(connect)
        ? traverse(map, connect, nextPath, nextBlocked, connect)
        : traverse(map, connect, nextPath, nextBlocked, double);
    });
};

module.exports = (inputs) => {
  const map = mapConnections(inputs.map(connect => connect.split('-')));
  const paths = traverse(map, 'start', [], new Set(), null);
  return paths.length;
};

// Your puzzle answer was 153592.
