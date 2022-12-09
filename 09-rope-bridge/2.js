'use strict';

// --- Part Two ---

const { last, range } = require('lodash');


const moveTail = ([headX, headY], [tailX, tailY]) => {
  if (Math.abs(tailY - headY) < 2 && Math.abs(tailX - headX) < 2) {
    return [tailX, tailY];
  }

  if (headX === tailX) {
    if (tailY < headY) {
      return [tailX, headY - 1];
    } else {
      return [tailX, headY + 1];
    }
  }

  if (headY === tailY) {
    if (tailX < headX) {
      return [headX - 1, tailY];
    } else {
      return [headX + 1, tailY];
    }
  }

  if (tailX < headX) {
    if (tailY < headY) {
      return [tailX + 1, tailY + 1];
    } else {
      return [tailX + 1, tailY - 1];
    }
  }

  if (tailX > headX) {
    if (tailY > headY) {
      return [tailX - 1, tailY - 1];
    } else {
      return [tailX - 1, tailY + 1];
    }
  }
};


module.exports = (inputs) => {
  const commands = inputs
    .map(line => line.split(' '))
    .map(([dir, amount]) => [dir, Number(amount)]);

  const visited = new Set(['0,0']);
  const segments = range(0, 10).map(() => [0, 0]);

  for (const [direction, amount] of commands) {
    for (let i = 0; i < amount; i += 1) {
      if (direction === 'U') {
        segments[0][1] -= 1;
      } else if (direction === 'R') {
        segments[0][0] += 1;
      } else if (direction === 'D') {
        segments[0][1] += 1;
      } else if (direction === 'L') {
        segments[0][0] -= 1;
      }

      for (let j = 1; j < segments.length; j += 1) {
        segments[j] = moveTail(segments[j - 1], segments[j]);
      }

      visited.add(`${last(segments)[0]},${last(segments)[1]}`);
    }
  }

  return visited.size;
};
