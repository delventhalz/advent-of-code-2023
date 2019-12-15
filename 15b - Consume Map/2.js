// --- Part Two ---

// You quickly repair the oxygen system; oxygen gradually fills the area.

// Oxygen starts in the location containing the repaired oxygen system. It
// takes one minute for oxygen to spread to all open locations that are
// adjacent to a location that already contains oxygen. Diagonal locations are
// not adjacent.

// In the example above, suppose you've used the droid to explore the area
// fully and have the following map (where locations that currently contain
// oxygen are marked O):

//      ##
//     #..##
//     #.#..#
//     #.O.#
//      ###

// Initially, the only location which contains oxygen is the location of the
// repaired oxygen system. However, after one minute, the oxygen spreads to all
// open (.) locations that are adjacent to a location containing oxygen:

//      ##
//     #..##
//     #.#..#
//     #OOO#
//      ###

// After a total of two minutes, the map looks like this:

//      ##
//     #..##
//     #O#O.#
//     #OOO#
//      ###

// After a total of three minutes:

//      ##
//     #O.##
//     #O#OO#
//     #OOO#
//      ###

// And finally, the whole region is full of oxygen after a total of four
// minutes:

//      ##
//     #OO##
//     #O#OO#
//     #OOO#
//      ###

// So, in this example, all locations contain oxygen after 4 minutes.

// Use the repair droid to get a complete map of the area. How many minutes
// will it take to fill with oxygen?

const toOxygenMap = (char) => {
  switch(char) {
    case 'O':
      return '.';
    case 'X':
      return 'O';
    default:
      return char;
  }
};

const markSquare = (map, x, y) => {
  if (map[y] && map[y][x] === '.') {
    map[y][x] = 'X';
  }
};

const markSurrounding = (map, x, y) => {
  markSquare(map, x - 1, y);
  markSquare(map, x, y - 1);
  markSquare(map, x + 1, y);
  markSquare(map, x, y + 1);
}

const spreadOxygen = (map) => {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (map[y][x] === 'O') {
        markSurrounding(map, x, y);
      }
    }
  }

  let didSpread = false;

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (map[y][x] === 'X') {
        map[y][x] = 'O';
        didSpread = true;
      }
    }
  }

  return didSpread;
};

const animate = (frameFn, frameLength) => {
  setTimeout(() => {
    const shouldContinue = frameFn();

    if (shouldContinue) {
      animate(frameFn, frameLength);
    }
  }, frameLength);
};

const printMap = (map, minutes) => {
  const screen = map
    .map(row => row.join(''))
    .join('\n');

  console.clear();
  console.log('MINUTES:', minutes)
  console.log();
  console.log(screen);
};

module.exports = (inputs) => {
  const map = inputs.map(row => row.split('').map(toOxygenMap));
  let minutes = 0;

  animate(() => {
    const didSpread = spreadOxygen(map);
    if (!didSpread) {
      return false;
    }

    minutes += 1;
    printMap(map, minutes);

    return true;
  }, 20);

  return minutes;
};


// Your puzzle answer was 398.
