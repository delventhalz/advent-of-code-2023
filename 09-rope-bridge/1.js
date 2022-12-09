'use strict';

// --- Day 9 ---

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
  let head = [0, 0];
  let tail = [0, 0];

  for (const [direction, amount] of commands) {
    for (let i = 0; i < amount; i += 1) {
      if (direction === 'U') {
        head[1] -= 1;
      } else if (direction === 'R') {
        head[0] += 1;
      } else if (direction === 'D') {
        head[1] += 1;
      } else if (direction === 'L') {
        head[0] -= 1;
      }

      tail = moveTail(head, tail);
      visited.add(`${tail[0]},${tail[1]}`);
    }
  }

  return visited.size;
};
