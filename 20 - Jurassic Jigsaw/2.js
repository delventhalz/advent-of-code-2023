// --- Part Two ---

// Now, you're ready to check the image for sea monsters.

// The borders of each tile are not part of the actual image; start by removing
// them.

// In the example above, the tiles become:

//     .#.#..#. ##...#.# #..#####
//     ###....# .#....#. .#......
//     ##.##.## #.#.#..# #####...
//     ###.#### #...#.## ###.#..#
//     ##.#.... #.##.### #...#.##
//     ...##### ###.#... .#####.#
//     ....#..# ...##..# .#.###..
//     .####... #..#.... .#......

//     #..#.##. .#..###. #.##....
//     #.####.. #.####.# .#.###..
//     ###.#.#. ..#.#### ##.#..##
//     #.####.. ..##..## ######.#
//     ##..##.# ...#...# .#.#.#..
//     ...#..#. .#.#.##. .###.###
//     .#.#.... #.##.#.. .###.##.
//     ###.#... #..#.##. ######..

//     .#.#.### .##.##.# ..#.##..
//     .####.## #.#...## #.#..#.#
//     ..#.#..# ..#.#.#. ####.###
//     #..####. ..#.#.#. ###.###.
//     #####..# ####...# ##....##
//     #.##..#. .#...#.. ####...#
//     .#.###.. ##..##.. ####.##.
//     ...###.. .##...#. ..#..###

// Remove the gaps to form the actual image:

//     .#.#..#.##...#.##..#####
//     ###....#.#....#..#......
//     ##.##.###.#.#..######...
//     ###.#####...#.#####.#..#
//     ##.#....#.##.####...#.##
//     ...########.#....#####.#
//     ....#..#...##..#.#.###..
//     .####...#..#.....#......
//     #..#.##..#..###.#.##....
//     #.####..#.####.#.#.###..
//     ###.#.#...#.######.#..##
//     #.####....##..########.#
//     ##..##.#...#...#.#.#.#..
//     ...#..#..#.#.##..###.###
//     .#.#....#.##.#...###.##.
//     ###.#...#..#.##.######..
//     .#.#.###.##.##.#..#.##..
//     .####.###.#...###.#..#.#
//     ..#.#..#..#.#.#.####.###
//     #..####...#.#.#.###.###.
//     #####..#####...###....##
//     #.##..#..#...#..####...#
//     .#.###..##..##..####.##.
//     ...###...##...#...#..###

// Now, you're ready to search for sea monsters! Because your image is
// monochrome, a sea monster will look like this:

//                       #
//     #    ##    ##    ###
//      #  #  #  #  #  #

// When looking for this pattern in the image, the spaces can be anything; only
// the # need to match. Also, you might need to rotate or flip your image
// before it's oriented correctly to find sea monsters. In the above image,
// after flipping and rotating it to the appropriate orientation, there are two
// sea monsters (marked with O):

//     .####...#####..#...###..
//     #####..#..#.#.####..#.#.
//     .#.#...#.###...#.##.O#..
//     #.O.##.OO#.#.OO.##.OOO##
//     ..#O.#O#.O##O..O.#O##.##
//     ...#.#..##.##...#..#..##
//     #.##.#..#.#..#..##.#.#..
//     .###.##.....#...###.#...
//     #.####.#.#....##.#..#.#.
//     ##...#..#....#..#...####
//     ..#.##...###..#.#####..#
//     ....#.##.#.#####....#...
//     ..##.##.###.....#.##..#.
//     #...#...###..####....##.
//     .#.##...#.##.#.#.###...#
//     #.###.#..####...##..#...
//     #.###...#.##...#.##O###.
//     .O##.#OO.###OO##..OOO##.
//     ..O#.O..O..O.#O##O##.###
//     #.#..##.########..#..##.
//     #.#####..#.#...##..#....
//     #....##..#.#########..##
//     #...#.....#..##...###.##
//     #..###....##.#...##.##.#

// Determine how rough the waters are in the sea monsters' habitat by counting
// the number of # that are not part of a sea monster. In the above example,
// the habitat's water roughness is 273.

// How many # are not part of a sea monster?

const { head, last, intersection } = require('lodash');
const {
  reverseString,
  eachMatrix,
  mapMatrix,
  matrixToString,
  flipMatrix,
  rotateMatrix,
} = require('../lib');


// Manually worked out that 2011 can be the top left with no rotation
const TOP_LEFT = '2011';


const parseId = (tileLines) => tileLines[0].match(/Tile (\d+):/)[1];

const parseBorders = (tileLines) => {
  const tile = tileLines.slice(1);

  const borders = [
    tile[0],
    tile.map(last).join(''),
    last(tile),
    tile.map(head).join('')
  ]

  return borders.concat(borders.map(reverseString));
};

const parseOrientations = (tileLines) => {
  const at0 = tileLines.slice(1).map(line => line.split(''));
  const at90 = rotateMatrix(at0);
  const at180 = rotateMatrix(at90);
  const at270 = rotateMatrix(at180);

  const flip0 = flipMatrix(at0);
  const flip90 = rotateMatrix(flip0);
  const flip180 = rotateMatrix(flip90);
  const flip270 = rotateMatrix(flip180);

  return [
    at0,
    at90,
    at180,
    at270,
    flip0,
    flip90,
    flip180,
    flip270
  ];
};


const findMatches = ({ id, borders }, tiles) => (
  tiles
    .filter(target => target.id !== id)
    .filter(target => intersection(borders, target.borders).length > 0)
);


const isAtRight = (tileA, tileB) => (
  tileA.map(last).join('') === tileB.map(head).join('')
);
const isAtBottom = (tileA, tileB) => (
  last(tileA).join('') === head(tileB).join('')
);

const getNeighborOrientation = (tile, neighbor, borderFn) => {
  const orientation = neighbor
    .orientations
    .find(orientation => borderFn(tile.orientation, orientation));

  if (!orientation) {
    return null;
  }

  // Naughty Mutation Stuff
  neighbor.orientation = orientation;
  neighbor.matches = neighbor.matches.filter(({ id }) => id !== tile.id);
  tile.matches = tile.matches.filter(({ id }) => id !== neighbor.id);

  return neighbor;
};


const hasDragon = (pic, x, y) => (
  pic[y][x + 18] === '#'
    && pic[y + 1][x] === '#'
    && pic[y + 1][x + 5] === '#'
    && pic[y + 1][x + 6] === '#'
    && pic[y + 1][x + 11] === '#'
    && pic[y + 1][x + 12] === '#'
    && pic[y + 1][x + 17] === '#'
    && pic[y + 1][x + 18] === '#'
    && pic[y + 1][x + 19] === '#'
    && pic[y + 2][x + 1] === '#'
    && pic[y + 2][x + 4] === '#'
    && pic[y + 2][x + 7] === '#'
    && pic[y + 2][x + 10] === '#'
    && pic[y + 2][x + 13] === '#'
    && pic[y + 2][x + 16] === '#'
);

const markDragon = (pic, x, y) => {
  pic[y][x + 18] = 'O';
  pic[y + 1][x] = 'O';
  pic[y + 1][x + 5] = 'O';
  pic[y + 1][x + 6] = 'O';
  pic[y + 1][x + 11] = 'O';
  pic[y + 1][x + 12] = 'O';
  pic[y + 1][x + 17] = 'O';
  pic[y + 1][x + 18] = 'O';
  pic[y + 1][x + 19] = 'O';
  pic[y + 2][x + 1] = 'O';
  pic[y + 2][x + 4] = 'O';
  pic[y + 2][x + 7] = 'O';
  pic[y + 2][x + 10] = 'O';
  pic[y + 2][x + 13] = 'O';
  pic[y + 2][x + 16] = 'O';
};


module.exports = (inputs) => {
  /** FIND ALL MATCHES AND ALL POSSIBLE ORIENTATIONS **/
  const tileArray = inputs.map((tileLines) => ({
    id: parseId(tileLines),
    borders: parseBorders(tileLines),
    orientations: parseOrientations(tileLines)
  }));

  for (const tile of tileArray) {
    tile.matches = findMatches(tile, tileArray);
  }

  const tiles = Object.fromEntries(tileArray.map(tile => [tile.id, tile]));


  /** FILL IN FIRST ROW **/
  const topLeft = tiles[TOP_LEFT];
  topLeft.orientation = topLeft.orientations[0];

  const arranged = [[topLeft], []];

  for (let x = 0; true; x += 1) {
    const tile = arranged[0][x];

    const bottom = tile.matches
      .find(match => getNeighborOrientation(tile, match, isAtBottom));
    arranged[1][x] = bottom;

    // If a tile has no more matches after doing the bottom, we hit the edge
    if (tile.matches.length === 0) {
      break;
    }

    const right = tile.matches
      .find(match => getNeighborOrientation(tile, match, isAtRight));
    arranged[0][x + 1] = right;
  }


  /** FILL IN REMAINING ROWS **/
  for (let y = 1; true; y +=1) {
    // If row starts with a tile with one match, it's a corner piece, we're done
    if (arranged[y][0].matches.length === 1) {
      break;
    }

    arranged[y + 1] = [];

    for (let x = 0; x < arranged[0].length; x += 1) {
      const tile = arranged[y][x];

      const bottom = tile.matches
        .find(match => getNeighborOrientation(tile, match, isAtBottom));
      arranged[y + 1][x] = bottom;
    }
  }


  /** BUILD PICTURE **/
  const arrangedTiles = mapMatrix(arranged, ({ orientation }) => orientation);
  const arrangedPieces = mapMatrix(arrangedTiles, tile => (
    tile
      .slice(1, -1)
      .map(line => line.slice(1, -1))
  ));

  let picture = [];

  eachMatrix(arrangedPieces, (piece, [x, y]) => {
    if (x === 0) {
      for (const row of piece) {
        picture.push(row);
      }
    } else {
      for (let yP = 0; yP < piece.length; yP += 1) {
        const yIndex = y * piece.length + yP;
        picture[yIndex] = picture[yIndex].concat(piece[yP]);
      }
    }
  });


  /** FIND DRAGONS **/
  // In my case the picture needed to be rotated once to find any dragons
  picture = rotateMatrix(picture);

  for (let y = 0; y < picture.length - 3; y += 1) {
    for (let x = 0; x < picture[0].length - 20; x += 1) {
      if (hasDragon(picture, x, y)) {
        markDragon(picture, x, y);
        x += 19;
      }
    }
  }

  console.log(matrixToString(picture), '\n');


  /** COUNT REMAINING WAVES **/
  let count = 0;

  eachMatrix(picture, (pixel) => {
    if (pixel === '#') {
      count += 1;
    }
  });

  return count;
};

// Your puzzle answer was 2155.
