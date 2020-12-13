// --- Part Two ---

// Before you can give the destination to the captain, you realize that the
// actual action meanings were printed on the back of the instructions the
// whole time.

// Almost all of the actions indicate how to move a waypoint which is relative
// to the ship's position:

// - Action N means to move the waypoint north by the given value.
// - Action S means to move the waypoint south by the given value.
// - Action E means to move the waypoint east by the given value.
// - Action W means to move the waypoint west by the given value.
// - Action L means to rotate the waypoint around the ship left
//   (counter-clockwise) the given number of degrees.
// - Action R means to rotate the waypoint around the ship right (clockwise)
//   the given number of degrees.
// - Action F means to move forward to the waypoint a number of times equal to
//   the given value.

// The waypoint starts 10 units east and 1 unit north relative to the ship. The
// waypoint is relative to the ship; that is, if the ship moves, the waypoint
// moves with it.

// For example, using the same instructions as above:

// - F10 moves the ship to the waypoint 10 times (a total of 100 units east and
//   10 units north), leaving the ship at east 100, north 10. The waypoint
//   stays 10 units east and 1 unit north of the ship.
// - N3 moves the waypoint 3 units north to 10 units east and 4 units north of
//   the ship. The ship remains at east 100, north 10.
// - F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28
//   units north), leaving the ship at east 170, north 38. The waypoint stays
//   10 units east and 4 units north of the ship.
// - R90 rotates the waypoint around the ship clockwise 90 degrees, moving it
//   to 4 units east and 10 units south of the ship. The ship remains at east
//   170, north 38.
// - F11 moves the ship to the waypoint 11 times (a total of 44 units east and
//   110 units south), leaving the ship at east 214, south 72. The waypoint
//   stays 4 units east and 10 units south of the ship.

// After these operations, the ship's Manhattan distance from its starting
// position is 214 + 72 = 286.

// Figure out where the navigation instructions actually lead. What is the
// Manhattan distance between that location and the ship's starting position?

const rotate = (waypointX, waypointY, direction, magnitude) => {
  if (direction === 'L') {
    magnitude = -magnitude;
  }

  switch((360 + magnitude) % 360) {
    case 0:
      return [waypointX, waypointY];
    case 90:
      return [waypointY, -waypointX];
    case 180:
      return [-waypointX, -waypointY];
    case 270:
      return [-waypointY, waypointX];
    default:
      throw new Error(`Bad magnitude: ${magnitude}`);
  }
};

const move = ([x, y, waypointX, waypointY], [direction, magnitude]) => {
  switch(direction) {
    case 'N':
      return [x, y, waypointX, waypointY + magnitude];
    case 'E':
      return [x, y, waypointX + magnitude, waypointY];
    case 'S':
      return [x, y, waypointX, waypointY - magnitude];
    case 'W':
      return [x, y, waypointX - magnitude, waypointY];
    case 'F':
      return [
        x + waypointX * magnitude,
        y + waypointY * magnitude,
        waypointX,
        waypointY
      ];
    case 'L':
    case 'R':
      return [x, y, ...rotate(waypointX, waypointY, direction, magnitude)];
    default:
      throw new Error(`Bad direction: ${direction}`);
  }
};


module.exports = (inputs) => {
  const instructions = inputs.map(line => [line[0], Number(line.slice(1))]);

  let x = 0;
  let y = 0;
  let waypointX = 10;
  let waypointY = 1;

  for (const instruction of instructions) {
    [x, y, waypointX, waypointY] = move([x, y, waypointX, waypointY], instruction);
  }

  return Math.abs(x) + Math.abs(y);
};

// Your puzzle answer was 54404.
