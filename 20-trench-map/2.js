'use strict';

// --- Part Two ---

// You still can't quite make out the details in the image. Maybe you just
// didn't enhance it enough.

// If you enhance the starting input image in the above example a total of 50
// times, 3351 pixels are lit in the final output image.

// Start again with the original input image and apply the image enhancement
// algorithm 50 times. How many pixels are lit in the resulting image?

const { get, range } = require('lodash');
const { count, mapMatrix } = require('../lib');


const getBox = (matrix, [x, y], edge) => {
  const box = [];

  box.push(get(matrix, [y - 1, x - 1], edge));
  box.push(get(matrix, [y - 1, x], edge));
  box.push(get(matrix, [y - 1, x + 1], edge));
  box.push(get(matrix, [y, x - 1], edge));
  box.push(get(matrix, [y, x], edge));
  box.push(get(matrix, [y, x + 1], edge));
  box.push(get(matrix, [y + 1, x - 1], edge));
  box.push(get(matrix, [y + 1, x], edge));
  box.push(get(matrix, [y + 1, x + 1], edge));

  return box;
};

const pxToDecimal = pixels => {
  const binary = pixels.map(px => px === '#' ? 1 : 0).join('');
  return parseInt(binary, 2);
};

const getEnhanceFn = (enhancer) => (matrix, edge) => {
  return mapMatrix(matrix, (_, loc) => {
    const idx = pxToDecimal(getBox(matrix, loc, edge));
    return enhancer[idx];
  });
};

const padMatrix = (matrix, padding) => {
  return [
    range(matrix[0].length + 2).fill(padding),
    ...matrix.map(row => [padding, ...row, padding]),
    range(matrix[0].length + 2).fill(padding)
  ];
};


module.exports = (inputs) => {
  const [[enhancer], inputRows] = inputs;
  const enhance = getEnhanceFn(enhancer);
  let image = inputRows.map(row => row.split(''));

  for (let i = 0; i < 50; i += 1) {
    const edge = i % 2 === 0 ? '.' : '#';
    image = padMatrix(image, edge);
    image = enhance(image, edge);
  }

  return count(image.flat(), '#');
};

// Your puzzle answer was 15714.
