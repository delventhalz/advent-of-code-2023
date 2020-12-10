// --- Part Two ---

// To completely determine whether you have enough adapters, you'll need to
// figure out how many different ways they can be arranged. Every arrangement
// needs to connect the charging outlet to your device. The previous rules
// about when adapters can successfully connect still apply.

// The first example above (the one that starts with 16, 10, 15) supports the
// following arrangements:

//     (0), 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, (22)
//     (0), 1, 4, 5, 6, 7, 10, 12, 15, 16, 19, (22)
//     (0), 1, 4, 5, 7, 10, 11, 12, 15, 16, 19, (22)
//     (0), 1, 4, 5, 7, 10, 12, 15, 16, 19, (22)
//     (0), 1, 4, 6, 7, 10, 11, 12, 15, 16, 19, (22)
//     (0), 1, 4, 6, 7, 10, 12, 15, 16, 19, (22)
//     (0), 1, 4, 7, 10, 11, 12, 15, 16, 19, (22)
//     (0), 1, 4, 7, 10, 12, 15, 16, 19, (22)

// (The charging outlet and your device's built-in adapter are shown in
// parentheses.) Given the adapters from the first example, the total number of
// arrangements that connect the charging outlet to your device is 8.

// The second example above (the one that starts with 28, 33, 18) has many
// arrangements. Here are a few:

//     (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
//     32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49, (52)

//     (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
//     32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 49, (52)

//     (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
//     32, 33, 34, 35, 38, 39, 42, 45, 46, 48, 49, (52)

//     (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
//     32, 33, 34, 35, 38, 39, 42, 45, 46, 49, (52)

//     (0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
//     32, 33, 34, 35, 38, 39, 42, 45, 47, 48, 49, (52)

//     (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
//     46, 48, 49, (52)

//     (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
//     46, 49, (52)

//     (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
//     47, 48, 49, (52)

//     (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
//     47, 49, (52)

//     (0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
//     48, 49, (52)

// In total, this set of adapters can connect the charging outlet to your
// device in 19208 distinct arrangements.

// You glance back down at your bag and try to remember why you brought so many
// adapters; there must be more than a trillion valid ways to arrange them!
// Surely, there must be an efficient way to count the arrangements.

// What is the total number of distinct ways you can arrange the adapters to
// connect the charging outlet to your device?


const SEEN_COMBOS = [];

const countCombos = (adapters, current) => {
  if (SEEN_COMBOS[current] !== undefined) {
    return SEEN_COMBOS[current];
  }
  if (current === adapters.length - 1)  {
    return 1;
  }

  const maxJoltage = adapters[current] + 3;
  let i = current + 1;
  let combos = 0;

  while (adapters[i] <= maxJoltage) {
    combos += countCombos(adapters, i);
    i += 1;
  }

  SEEN_COMBOS[current] = combos;
  return combos;
};

module.exports = (inputs) => {
  // We'll include the 0-joltage outlet in the array, but since the last path
  // will always go through the final adapter, there is no need to include the
  // joltage of the final device.
  const adapters = [0, ...inputs.sort((a, b) => a - b)];

  return countCombos(adapters, 0);
};

// Your puzzle answer was 4049565169664.
