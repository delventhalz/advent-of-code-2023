// --- Part Two ---

// An Elf just remembered one more important detail: the two adjacent matching
// digits are not part of a larger group of matching digits.

// Given this additional criterion, but still ignoring the range rule, the
// following are now true:

// - 112233 meets these criteria because the digits never decrease and all
//   repeated digits are exactly two digits long.
// - 123444 no longer meets the criteria (the repeated 44 is part of a larger
//   group of 444).
// - 111122 meets the criteria (even though 1 is repeated more than twice, it
//   still contains a double 22).

// How many different passwords within the range given in your puzzle input
// meet all of the criteria?


const isIncreasing = (num) => {
  const digits = String(num);
  let lastDigit = digits[0];

  for (const digit of digits.slice(1)) {
    if (digit < lastDigit) {
      return false;
    }
    lastDigit = digit;
  }

  return true;
};

const containsJustDouble = (num) => {
  const digits = String(num);
  let lastDigit = digits[0];
  let matchLength = 1;

  for (const digit of digits.slice(1)) {
    if (digit === lastDigit) {
      matchLength += 1;
    } else {
      if (matchLength === 2) {
        return true;
      }
      matchLength = 1;
    }
    lastDigit = digit;
  }

  return matchLength === 2;
}

module.exports = () => {
  let matches = 0;

  for (let i = 123257; i <= 647015; i++) {
    if (isIncreasing(i) && containsJustDouble(i)) {
      matches++;
    }
  }

  return matches;
};


// Your puzzle input was 123257-647015.

// Your puzzle answer was 1515.
