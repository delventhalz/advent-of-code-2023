// --- Part Two ---

// You aren't sure how large Santa's ship is. You aren't even sure if you'll
// need to use this thing on Santa's ship, but it doesn't hurt to be prepared.
// You figure Santa's ship might fit in a 100x100 square.

// The beam gets wider as it travels away from the emitter; you'll need to be a
// minimum distance away to fit a square of that size into the beam fully.
// (Don't rotate the square; it should be aligned to the same axes as the drone
// grid.)

// For example, suppose you have the following tractor beam readings:

//     #.......................................
//     .#......................................
//     ..##....................................
//     ...###..................................
//     ....###.................................
//     .....####...............................
//     ......#####.............................
//     ......######............................
//     .......#######..........................
//     ........########........................
//     .........#########......................
//     ..........#########.....................
//     ...........##########...................
//     ...........############.................
//     ............############................
//     .............#############..............
//     ..............##############............
//     ...............###############..........
//     ................###############.........
//     ................#################.......
//     .................########OOOOOOOOOO.....
//     ..................#######OOOOOOOOOO#....
//     ...................######OOOOOOOOOO###..
//     ....................#####OOOOOOOOOO#####
//     .....................####OOOOOOOOOO#####
//     .....................####OOOOOOOOOO#####
//     ......................###OOOOOOOOOO#####
//     .......................##OOOOOOOOOO#####
//     ........................#OOOOOOOOOO#####
//     .........................OOOOOOOOOO#####
//     ..........................##############
//     ..........................##############
//     ...........................#############
//     ............................############
//     .............................###########

// In this example, the 10x10 square closest to the emitter that fits entirely
// within the tractor beam has been marked O. Within it, the point closest to
// the emitter (the only highlighted O) is at X=25, Y=20.

// Find the 100x100 square closest to the emitter that fits entirely within the
// tractor beam; within that square, find the point closest to the emitter.
// What value do you get if you take that point's X coordinate, multiply it by
// 10000, then add the point's Y coordinate? (In the example above, this would
// be 250020.)

const { getRunner } = require('../lib/intcode.js');


module.exports = (inputs) => {
  const isPulled = (x, y) => Boolean(getRunner(inputs, { quietIO: true})(x, y)[0]);
  const getNextLeadingSquare = (previousX, previousY) => {
    const y = previousY + 1;
    let x = previousX;

    while(isPulled(x, y)) {
      x += 1;
    }

    return [x - 1, y];
  };

  // First leading square on tractor beam that could possibly contain ship
  let x = 100;
  let y = 111;

  while (!isPulled(x - 99, y + 99)) {
    ([x, y] = getNextLeadingSquare(x, y));
  }

  return (x - 99) * 10000 + y;
};


// Your puzzle answer was 8071006.
