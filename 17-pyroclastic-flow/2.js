'use strict';

// --- Part Two ---

// Calculated manually with ad hoc console code
const REPEATER = 1745;
const REMAINDER = 1010;

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

const isBlocked = (board, shape, x, y) => {
  if (y < 0 || x < 0 || x > 7 - shape.width) {
    return true;
  }

  return shape.points.some(([pX, pY]) => board[y + pY]?.[x + pX]);
};

const shiftShape = (board, shape, x, y, jet) => {
  const nextX = jet === '<' ? x - 1 : x + 1;
  return isBlocked(board, shape, nextX, y) ? x : nextX;
};

const dropShape = (board, shape, x, y) => {
  const nextY = y - 1;
  return isBlocked(board, shape, x, nextY) ? null : nextY;
};

const simulateShape = (board, nextShape, nextJet) => {
  const shape = nextShape();
  let x = 2;
  let y = board.length + 3;

  while (true) {
    x = shiftShape(board, shape, x, y, nextJet());

    const nextY = dropShape(board, shape, x, y);
    if (nextY === null) {
      break;
    }

    y = nextY;
  }

  for (const [pX, pY] of shape.points) {
    const bY = y + pY;

    if (!board[bY]) {
      board[bY] = [];
    }

    board[bY][x + pX] = true;
  }
};

const findBottom = (board) => {
  let openCols = [0, 1, 2, 3, 4, 5, 6];

  for (let y = board.length - 1; y > 0; y -= 1) {
    for (const x of openCols) {
      if (board[y][x]) {
        openCols = openCols.filter(col => col !== x);
      }
    }

    if (openCols.length === 0) {
      return Math.max(0, y - 5);
    }
  }

  return 0;
};


module.exports = (_, rawInput) => {
  const jets = rawInput.split('');

  const nextShape = getIterator(SHAPES);
  const nextJet = getIterator(jets);

  let board = [];
  let offset = 0;

  for (let i = 0; i < REPEATER; i += 1) {
    simulateShape(board, nextShape, nextJet);

    const nextBottom = findBottom(board);
    board = board.slice(nextBottom);
    offset += nextBottom;
  }

  const heightAt1 = board.length + offset;

  for (let i = 0; i < REPEATER; i += 1) {
    simulateShape(board, nextShape, nextJet);

    const nextBottom = findBottom(board);
    board = board.slice(nextBottom);
    offset += nextBottom;
  }

  const heightFor1 = board.length + offset - heightAt1;

  for (let i = 0; i < REMAINDER; i += 1) {
    simulateShape(board, nextShape, nextJet);

    const nextBottom = findBottom(board);
    board = board.slice(nextBottom);
    offset += nextBottom;
  }

  const heightForRemainder = board.length + offset - heightFor1 - heightAt1;

  return heightAt1 + heightForRemainder + heightFor1 * (Math.floor(1000000000000 / REPEATER) - 1)
};
