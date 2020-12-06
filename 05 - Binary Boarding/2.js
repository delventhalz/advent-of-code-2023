// --- Part Two ---

// Ding! The "fasten seat belt" signs have turned on. Time to find your seat.

// It's a completely full flight, so your seat should be the only missing
// boarding pass in your list. However, there's a catch: some of the seats at
// the very front and back of the plane don't exist on this aircraft, so
// they'll be missing from your list as well.

// Your seat wasn't at the very front or back, though; the seats with IDs +1
// and -1 from yours will be in your list.

// What is the ID of your seat?


const getRow = (rowString, min = 0, max = 128) => {
  if (rowString.length === 0) {
    return min;
  }

  const range = max - min;
  const mid = range / 2 + min;

  if (rowString[0] === 'F') {
    return getRow(rowString.slice(1), min, mid);
  } else {
    return getRow(rowString.slice(1), mid, max);
  }
};

const getCol = (colString, min = 0, max = 8) => {
  if (colString.length === 0) {
    return min;
  }

  const range = max - min;
  const mid = range / 2 + min;

  if (colString[0] === 'L') {
    return getCol(colString.slice(1), min, mid);
  } else {
    return getCol(colString.slice(1), mid, max);
  }
};

module.exports = (inputs) => {
  const seats = inputs
    .map(seat => {
      const row = getRow(seat.slice(0, 7));
      const col = getCol(seat.slice(7));
      return row * 8 + col;
    })
    .sort((a, b) => a - b);

    let last = seats[0];

    for (const seat of seats.slice(1, -1)) {
      if (seat !== last + 1) {
        return seat - 1;
      } else {
        last = seat;
      }
    }

    return null;
};

// Your puzzle answer was 603.
