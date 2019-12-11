// --- Day 3: Crossed Wires ---

// The gravity assist was successful, and you're well on your way to the Venus
// refuelling station. During the rush back on Earth, the fuel management
// system wasn't completely installed, so that's next on the priority list.

// Opening the front panel reveals a jumble of wires. Specifically, two wires
// are connected to a central port and extend outward on a grid. You trace the
// path each wire takes as it leaves the central port, one wire per line of
// text (your puzzle input).

// The wires twist and turn, but the two wires occasionally cross paths. To fix
// the circuit, you need to find the intersection point closest to the central
// port. Because the wires are on a grid, use the Manhattan distance for this
// measurement. While the wires do technically cross right at the central port
// where they both start, this point does not count, nor does a wire count as
// crossing with itself.

// For example, if the first wire's path is R8,U5,L5,D3, then starting from the
// central port (o), it goes right 8, up 5, left 5, and finally down 3:

// ...........
// ...........
// ...........
// ....+----+.
// ....|....|.
// ....|....|.
// ....|....|.
// .........|.
// .o-------+.
// ...........

// Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down
// 4, and left 4:

// ...........
// .+-----+...
// .|.....|...
// .|..+--X-+.
// .|..|..|.|.
// .|.-X--+.|.
// .|..|....|.
// .|.......|.
// .o-------+.
// ...........

// These wires cross at two locations (marked X), but the lower-left one is
// closer to the central port: its distance is 3 + 3 = 6.

// Here are a few more examples:

// - R75,D30,R83,U83,L12,D49,R71,U7,L72
//   U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
// - R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
//   U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135

// What is the Manhattan distance from the central port to the closest
// intersection?


const {
  checkIntersection,
  colinearPointWithinSegment
} = require('line-intersect');

const stepsToSegments = (steps) => {
  const segments = [];
  let lastPoint = [0, 0];

  for (const step of steps) {
    const direction = step[0]
    const delta = Number(step.slice(1));

    if (direction === 'R') {
      const [x, y] = lastPoint;
      lastPoint = [x + delta, y];
      segments.push([x, y, ...lastPoint]);
    } else if (direction === 'U') {
      const [x, y] = lastPoint;
      lastPoint = [x, y + delta];
      segments.push([x, y, ...lastPoint]);
    } else if (direction === 'L') {
      const [x, y] = lastPoint;
      lastPoint = [x - delta, y];
      segments.push([x, y, ...lastPoint]);
    } else if (direction === 'D') {
      const [x, y] = lastPoint;
      lastPoint = [x, y - delta];
      segments.push([x, y, ...lastPoint]);
    } else {
      throw new Error('Bad direction: ' + direction);
    }
  }

  return segments;
};

const getIntersections = (firstSegments, secondSegments) => {
  const intersections = [];

  for (const firstSegment of firstSegments) {
    for (const secondSegment of secondSegments) {
      const { type, point } = checkIntersection(...firstSegment, ...secondSegment);

      if (type === 'intersecting') {
        intersections.push([point.x, point.y]);
      } else if (type === 'colinear') {
        const pointA = firstSegment.slice(0, 2);
        const pointB = firstSegment.slice(2)
        if (colinearPointWithinSegment(...pointA, ...secondSegment)) {
          intersections.push(pointA);
        }
        if (colinearPointWithinSegment(...pointB, ...secondSegment)) {
          intersections.push(pointB);
        }
      }
    }
  }

  return intersections;
}

const manhattanToOrigin = ([x, y]) => Math.abs(x) + Math.abs(y);

module.exports = ([firstSteps, secondSteps]) => {
  const firstSegments = stepsToSegments(firstSteps);
  const secondSegments = stepsToSegments(secondSteps);
  const intersections = getIntersections(firstSegments, secondSegments);

  return intersections
    .map(manhattanToOrigin)
    .sort((a, b) => a - b)[1];
};


// Your puzzle answer was 709.

