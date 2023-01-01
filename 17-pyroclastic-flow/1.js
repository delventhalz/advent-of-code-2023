'use strict';

// --- Day 17: Pyroclastic Flow ---

// Your handheld device has located an alternative exit from the cave for you
// and the elephants. The ground is rumbling almost continuously now, but the
// strange valves bought you some time. It's definitely getting warmer in here,
// though.

// The tunnels eventually open into a very tall, narrow chamber. Large,
// oddly-shaped rocks are falling into the chamber from above, presumably due
// to all the rumbling. If you can't work out where the rocks will fall next,
// you might be crushed!

// The five types of rocks have the following peculiar shapes, where # is rock
// and . is empty space:

//     ####

//     .#.
//     ###
//     .#.

//     ..#
//     ..#
//     ###

//     #
//     #
//     #
//     #

//     ##
//     ##

// The rocks fall in the order shown above: first the - shape, then the + shape,
// and so on. Once the end of the list is reached, the same order repeats:
// the - shape falls first, sixth, 11th, 16th, etc.

// The rocks don't spin, but they do get pushed around by jets of hot gas coming
// out of the walls themselves. A quick scan reveals the effect the jets of hot
// gas will have on the rocks as they fall (your puzzle input).

// For example, suppose this was the jet pattern in your cave:

//     >>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>

// In jet patterns, < means a push to the left, while > means a push to the
// right. The pattern above means that the jets will push a falling rock right,
// then right, then right, then left, then left, then right, and so on. If the
// end of the list is reached, it repeats.

// The tall, vertical chamber is exactly seven units wide. Each rock appears so
// that its left edge is two units away from the left wall and its bottom edge
// is three units above the highest rock in the room (or the floor, if there
// isn't one).

// After a rock appears, it alternates between being pushed by a jet of hot gas
// one unit (in the direction indicated by the next symbol in the jet pattern)
// and then falling one unit down. If any movement would cause any part of the
// rock to move into the walls, floor, or a stopped rock, the movement instead
// does not occur. If a downward movement would have caused a falling rock to
// move into the floor or an already-fallen rock, the falling rock stops where
// it is (having landed on something) and a new rock immediately begins
// falling.

// Drawing falling rocks with @ and stopped rocks with #, the jet pattern in the
// example above manifests as follows:

//     The first rock begins falling:
//     |..@@@@.|
//     |.......|
//     |.......|
//     |.......|
//     +-------+

//     Jet of gas pushes rock right:
//     |...@@@@|
//     |.......|
//     |.......|
//     |.......|
//     +-------+

//     Rock falls 1 unit:
//     |...@@@@|
//     |.......|
//     |.......|
//     +-------+

//     Jet of gas pushes rock right, but nothing happens:
//     |...@@@@|
//     |.......|
//     |.......|
//     +-------+

//     Rock falls 1 unit:
//     |...@@@@|
//     |.......|
//     +-------+

//     Jet of gas pushes rock right, but nothing happens:
//     |...@@@@|
//     |.......|
//     +-------+

//     Rock falls 1 unit:
//     |...@@@@|
//     +-------+

//     Jet of gas pushes rock left:
//     |..@@@@.|
//     +-------+

//     Rock falls 1 unit, causing it to come to rest:
//     |..####.|
//     +-------+

//     A new rock begins falling:
//     |...@...|
//     |..@@@..|
//     |...@...|
//     |.......|
//     |.......|
//     |.......|
//     |..####.|
//     +-------+

//     Jet of gas pushes rock left:
//     |..@....|
//     |.@@@...|
//     |..@....|
//     |.......|
//     |.......|
//     |.......|
//     |..####.|
//     +-------+

//     Rock falls 1 unit:
//     |..@....|
//     |.@@@...|
//     |..@....|
//     |.......|
//     |.......|
//     |..####.|
//     +-------+

//     Jet of gas pushes rock right:
//     |...@...|
//     |..@@@..|
//     |...@...|
//     |.......|
//     |.......|
//     |..####.|
//     +-------+

//     Rock falls 1 unit:
//     |...@...|
//     |..@@@..|
//     |...@...|
//     |.......|
//     |..####.|
//     +-------+

//     Jet of gas pushes rock left:
//     |..@....|
//     |.@@@...|
//     |..@....|
//     |.......|
//     |..####.|
//     +-------+

//     Rock falls 1 unit:
//     |..@....|
//     |.@@@...|
//     |..@....|
//     |..####.|
//     +-------+

//     Jet of gas pushes rock right:
//     |...@...|
//     |..@@@..|
//     |...@...|
//     |..####.|
//     +-------+

//     Rock falls 1 unit, causing it to come to rest:
//     |...#...|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     A new rock begins falling:
//     |....@..|
//     |....@..|
//     |..@@@..|
//     |.......|
//     |.......|
//     |.......|
//     |...#...|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

// The moment each of the next few rocks begins falling, you would see this:

//     |..@....|
//     |..@....|
//     |..@....|
//     |..@....|
//     |.......|
//     |.......|
//     |.......|
//     |..#....|
//     |..#....|
//     |####...|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |..@@...|
//     |..@@...|
//     |.......|
//     |.......|
//     |.......|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |..@@@@.|
//     |.......|
//     |.......|
//     |.......|
//     |....##.|
//     |....##.|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |...@...|
//     |..@@@..|
//     |...@...|
//     |.......|
//     |.......|
//     |.......|
//     |.####..|
//     |....##.|
//     |....##.|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |....@..|
//     |....@..|
//     |..@@@..|
//     |.......|
//     |.......|
//     |.......|
//     |..#....|
//     |.###...|
//     |..#....|
//     |.####..|
//     |....##.|
//     |....##.|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |..@....|
//     |..@....|
//     |..@....|
//     |..@....|
//     |.......|
//     |.......|
//     |.......|
//     |.....#.|
//     |.....#.|
//     |..####.|
//     |.###...|
//     |..#....|
//     |.####..|
//     |....##.|
//     |....##.|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |..@@...|
//     |..@@...|
//     |.......|
//     |.......|
//     |.......|
//     |....#..|
//     |....#..|
//     |....##.|
//     |....##.|
//     |..####.|
//     |.###...|
//     |..#....|
//     |.####..|
//     |....##.|
//     |....##.|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

//     |..@@@@.|
//     |.......|
//     |.......|
//     |.......|
//     |....#..|
//     |....#..|
//     |....##.|
//     |##..##.|
//     |######.|
//     |.###...|
//     |..#....|
//     |.####..|
//     |....##.|
//     |....##.|
//     |....#..|
//     |..#.#..|
//     |..#.#..|
//     |#####..|
//     |..###..|
//     |...#...|
//     |..####.|
//     +-------+

// To prove to the elephants your simulation is accurate, they want to know how
// tall the tower will get after 2022 rocks have stopped (but before the 2023rd
// rock begins falling). In this example, the tower of rocks will be 3068 units
// tall.

// How many units tall will the tower of rocks be after 2022 rocks have stopped
// falling?


// Y coordinates are flipped, bottom-left is 0,0
const SHAPES = [
  // ####
  {
    width: 4,
    height: 1,
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },

  //  #
  // ###
  //  #
  {
    width: 3,
    height: 3,
    points: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
  },

  //   #
  //   #
  // ###
  {
    width: 3,
    height: 3,
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },

  // #
  // #
  // #
  // #
  {
    width: 1,
    height: 4,
    points: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },

  // ##
  // ##
  {
    width: 2,
    height: 2,
    points: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
];


const getIterator = (arr) => {
  let i = 0;
  return () => arr[i++ % arr.length];
};

const isBlocked = (board, shape, [x, y]) => {
  if (y < 0 || x < 0 || x > 7 - shape.width) {
    return true;
  }

  return shape.points
    .map(([pX, pY]) => [x + pX, y + pY])
    .some(([pX, pY]) => board[pY]?.[pX]);
};

const shiftShape = (board, shape, [x, y], jet) => {
  const nextX = jet === '<' ? x - 1 : x + 1;

  if (isBlocked(board, shape, [nextX, y])) {
    return [x, y];
  }

  return [nextX, y];
};

const dropShape = (board, shape, [x, y]) => {
  const nextY = y - 1;

  if (isBlocked(board, shape, [x, nextY])) {
    return null;
  }

  return [x, nextY];
};


module.exports = (_, rawInput) => {
  const jets = rawInput.split('');

  const nextShape = getIterator(SHAPES);
  const nextJet = getIterator(jets);

  const board = [];
  let height = 0;

  for (let i = 0; i < 2022; i += 1) {
    let shape = nextShape();
    let coords = [2, board.length + 3];

    while (true) {
      coords = shiftShape(board, shape, coords, nextJet());

      const dropCoords = dropShape(board, shape, coords);
      if (!dropCoords) {
        break;
      }

      coords = dropCoords;
    }

    height = Math.max(height, coords[1] + shape.height);

    shape.points
      .map(([pX, pY]) => [coords[0] + pX, coords[1] + pY])
      .forEach(([pX, pY]) => {
        if (!board[pY]) {
          board[pY] = [];
        }
        board[pY][pX] = true;
      });
  }

  return height;
};

// Your puzzle answer was 3184.
