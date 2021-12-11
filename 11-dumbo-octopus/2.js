'use strict';

// --- Part Two ---

// It seems like the individual flashes aren't bright enough to navigate.
// However, you might have a better option: the flashes seem to be
// synchronizing!

// In the example above, the first time all octopuses flash simultaneously is
// step 195:

// After step 193:

//     5877777777
//     8877777777
//     7777777777
//     7777777777
//     7777777777
//     7777777777
//     7777777777
//     7777777777
//     7777777777
//     7777777777

// After step 194:

//     6988888888
//     9988888888
//     8888888888
//     8888888888
//     8888888888
//     8888888888
//     8888888888
//     8888888888
//     8888888888
//     8888888888

// After step 195:

//     0000000000
//     0000000000
//     0000000000
//     0000000000
//     0000000000
//     0000000000
//     0000000000
//     0000000000
//     0000000000
//     0000000000

// If you can calculate the exact moments when the octopuses will all flash
// simultaneously, you should be able to navigate through the cavern. What is
// the first step during which all octopuses flash?

const { eachMatrix, mapMatrix, eachSurrounding } = require('../lib');


let HAS_FLASHED = new Set()

const flashNeighbors = (octos, coords) => {
  eachSurrounding(octos, coords, (_, [x, y]) => {
    octos[y][x] += 1;
  })

  eachSurrounding(octos, coords, (_, [x, y]) => {
    if (octos[y][x] > 9 && !HAS_FLASHED.has(`${x},${y}`)) {
      HAS_FLASHED.add(`${x},${y}`)
      flashNeighbors(octos, [x, y])
    }
  })

}

module.exports = (_, rawInput) => {
  let octos = rawInput.split('\n').map(row => row.split('').map(Number));

  for (let i = 0 ; i < 1000000; i += 1) {
    octos = mapMatrix(octos, octo => octo + 1)
    HAS_FLASHED = new Set()

    const toFlash = []
    eachMatrix(octos, (octo, coords) => {
      if (octo === 10) {
        toFlash.push(coords)
      }
    })

    for (const coords of toFlash) {
      if (!HAS_FLASHED.has(String(coords))) {
        HAS_FLASHED.add(String(coords))
        flashNeighbors(octos, coords)
      }
    }

    if (octos.flat().every(o => o > 9)) {
      return i
    }

    octos = mapMatrix(octos, octo => octo > 9 ? 0 : octo)
  }

  return '???';
};

// Your puzzle answer was 440.
