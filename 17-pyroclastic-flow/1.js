'use strict';

// --- Day 17 ---

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
