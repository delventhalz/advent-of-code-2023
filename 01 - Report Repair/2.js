// --- Part Two ---

// The Elves in accounting are thankful for your help; one of them even offers
// you a starfish coin they had left over from a past vacation. They offer you
// a second one if you can find three numbers in your expense report that meet
// the same criteria.

// Using the above example again, the three entries that sum to 2020 are 979,
// 366, and 675. Multiplying them together produces the answer, 241861950.

// In your expense report, what is the product of the three entries that sum to
// 2020?


module.exports = (inputs) => {
  for (let i = 0; i < inputs.length; i += 1) {
    for (let j = 0; j < inputs.length; j += 1) {
      for (let k = 0; k < inputs.length; k += 1) {
        const isSum = 1 !== j
          && j !== k
          && i !== k
          && inputs[i] + inputs[j] + inputs[k] === 2020;

        if (isSum) {
          return inputs[i] * inputs[j] * inputs[k];
        }
      }
    }
  }

  return null;
};


// Your puzzle answer was 46584630.
