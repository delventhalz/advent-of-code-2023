// --- Part Two ---

// The final step in breaking the XMAS encryption relies on the invalid number
// you just found: you must find a contiguous set of at least two numbers in
// your list which sum to the invalid number from step 1.

// Again consider the above example:

//     35
//     20
//     15
//     25
//     47
//     40
//     62
//     55
//     65
//     95
//     102
//     117
//     150
//     182
//     127
//     219
//     299
//     277
//     309
//     576

// In this list, adding up all of the numbers from 15 through 40 produces the
// invalid number from step 1, 127. (Of course, the contiguous set of numbers
// in your actual list might be much longer.)

// To find the encryption weakness, add together the smallest and largest
// number in this contiguous range; in this example, these are 15 and 47,
// producing 62.

// What is the encryption weakness in your XMAS-encrypted list of numbers?

const { sum, greatest, least } = require('../lib');

const TARGET = 14144619;

module.exports = (inputs) => {
  for (let i = 0; i < inputs.length - 1; i += 1) {
    for (let j = i + 1; j < inputs.length; j += 1) {
      const test = inputs.slice(i, j + 1);
      const total = sum(test);

      if (total > TARGET) {
        break;
      }

      if (total === TARGET) {
        return greatest(test) + least(test);
      }
    }
  }
};

// Your puzzle answer was 1766397.
