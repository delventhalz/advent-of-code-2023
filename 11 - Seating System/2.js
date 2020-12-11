// --- Part Two ---

// As soon as people start to arrive, you realize your mistake. People don't
// just care about adjacent seats - they care about the first seat they can see
// in each of those eight directions!

// Now, instead of considering just the eight immediately adjacent seats,
// consider the first seat in each of those eight directions. For example, the
// empty seat below would see eight occupied seats:

//     .......#.
//     ...#.....
//     .#.......
//     .........
//     ..#L....#
//     ....#....
//     .........
//     #........
//     ...#.....

// The leftmost empty seat below would only see one empty seat, but cannot see
// any of the occupied ones:

//     .............
//     .L.L.#.#.#.#.
//     .............

// The empty seat below would see no occupied seats:

//     .##.##.
//     #.#.#.#
//     ##...##
//     ...L...
//     ##...##
//     #.#.#.#
//     .##.##.

// Also, people seem to be more tolerant than you expected: it now takes five
// or more visible occupied seats for an occupied seat to become empty (rather
// than four or more from the previous rules). The other rules still apply:
// empty seats that see no occupied seats become occupied, seats matching no
// rule don't change, and floor never changes.

// Given the same starting layout as above, these new rules cause the seating
// area to shift around as follows:

//     L.LL.LL.LL
//     LLLLLLL.LL
//     L.L.L..L..
//     LLLL.LL.LL
//     L.LL.LL.LL
//     L.LLLLL.LL
//     ..L.L.....
//     LLLLLLLLLL
//     L.LLLLLL.L
//     L.LLLLL.LL

//     #.##.##.##
//     #######.##
//     #.#.#..#..
//     ####.##.##
//     #.##.##.##
//     #.#####.##
//     ..#.#.....
//     ##########
//     #.######.#
//     #.#####.##

//     #.LL.LL.L#
//     #LLLLLL.LL
//     L.L.L..L..
//     LLLL.LL.LL
//     L.LL.LL.LL
//     L.LLLLL.LL
//     ..L.L.....
//     LLLLLLLLL#
//     #.LLLLLL.L
//     #.LLLLL.L#

//     #.L#.##.L#
//     #L#####.LL
//     L.#.#..#..
//     ##L#.##.##
//     #.##.#L.##
//     #.#####.#L
//     ..#.#.....
//     LLL####LL#
//     #.L#####.L
//     #.L####.L#

//     #.L#.L#.L#
//     #LLLLLL.LL
//     L.L.L..#..
//     ##LL.LL.L#
//     L.LL.LL.L#
//     #.LLLLL.LL
//     ..L.L.....
//     LLLLLLLLL#
//     #.LLLLL#.L
//     #.L#LL#.L#

//     #.L#.L#.L#
//     #LLLLLL.LL
//     L.L.L..#..
//     ##L#.#L.L#
//     L.L#.#L.L#
//     #.L####.LL
//     ..#.#.....
//     LLL###LLL#
//     #.LLLLL#.L
//     #.L#LL#.L#

//     #.L#.L#.L#
//     #LLLLLL.LL
//     L.L.L..#..
//     ##L#.#L.L#
//     L.L#.LL.L#
//     #.LLLL#.LL
//     ..#.L.....
//     LLL###LLL#
//     #.LLLLL#.L
//     #.L#LL#.L#

// Again, at this point, people stop shifting around and the seating area
// reaches equilibrium. Once this occurs, you count 26 occupied seats.

// Given the new visibility method and the rule change for occupied seats
// becoming empty, once equilibrium is reached, how many seats end up occupied?

const {
  mapMatrix,
  filterMatrix,
  matrixToString,
  loop,
  print,
} = require('../lib');


const isEmpty = spot => spot === 'L';
const isOccupied = spot => spot === '#';

const countLine = (lastX, lastY, map, getNext) => {
  const [x, y] = getNext(lastX, lastY);

  if (!map[y] || !map[y][x] || isEmpty(map[y][x])) {
    return 0;
  }

  if (isOccupied(map[y][x])) {
    return 1;
  }

  return countLine(x, y, map, getNext);
};

const countVisible = ([x, y], map) => {
  let count = 0;

  count += countLine(x, y, map, (x, y) => [x - 1, y - 1]);
  count += countLine(x, y, map, (x, y) => [x, y - 1]);
  count += countLine(x, y, map, (x, y) => [x + 1, y - 1]);
  count += countLine(x, y, map, (x, y) => [x - 1, y]);
  count += countLine(x, y, map, (x, y) => [x + 1, y]);
  count += countLine(x, y, map, (x, y) => [x - 1, y + 1]);
  count += countLine(x, y, map, (x, y) => [x, y + 1]);
  count += countLine(x, y, map, (x, y) => [x + 1, y + 1]);

  return count;
};

const xformSpot = (spot, coords, map) => {
  const visible = countVisible(coords, map);

  if (isEmpty(spot) && visible === 0) {
    return '#';
  }

  if (isOccupied(spot) && visible >= 5) {
    return 'L';
  }

  return spot;
};


module.exports = (inputs) => {
  let map = inputs.map(line => line.split(''));
  let count = 0;

  // Clear out initial synchronous log from runner
  setTimeout(() => {
    print(matrixToString(map), `OCCUPIED SEATS: ${count}`);
  }, 0);

  setTimeout(() => {
    loop(() => {
      map = mapMatrix(map, xformSpot);
      const nextCount = filterMatrix(map, isOccupied).length;

      if (count === nextCount) {
        return false;
      }
      count = nextCount;

      print(matrixToString(map), `OCCUPIED SEATS: ${count}`);
      return true;
    }, 250);
  }, 1500);
};

// Your puzzle answer was 1944.
