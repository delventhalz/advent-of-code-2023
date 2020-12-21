// --- Part Two ---

// Ding! The "fasten seat belt" signs have turned on. Time to find your seat.

// It's a completely full flight, so your seat should be the only missing
// boarding pass in your list. However, there's a catch: some of the seats at
// the very front and back of the plane don't exist on this aircraft, so
// they'll be missing from your list as well.

// Your seat wasn't at the very front or back, though; the seats with IDs +1
// and -1 from yours will be in your list.

// What is the ID of your seat?

const toBinaryValue = (bits, isOne = Boolean) => {
  let min = 0;
  let max = 2 ** bits.length;

  for (const bit of bits) {
    const mid = (max - min) / 2 + min;

    if (isOne(bit)) {
      min = mid;
    } else {
      max = mid;
    }
  }

  return min;
};


const getRow = (rowString) => (
  toBinaryValue(rowString, letter => letter === 'B')
);

const getCol = (colString) => (
  toBinaryValue(colString, letter => letter === 'R')
);


module.exports = (inputs) => {
  const seatIds = inputs
    .map((seat) => {
      const row = getRow(seat.slice(0, 7));
      const col = getCol(seat.slice(7));
      return row * 8 + col;
    })
    .sort((a, b) => a - b);

    let expected = seatIds[0];

    for (const seatId of seatIds.slice(1, -1)) {
      expected += 1;

      if (seatId !== expected) {
        return seatId - 1;
      }
    }

    return null;
};

// Your puzzle answer was 603.
