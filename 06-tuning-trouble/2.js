'use strict';

// --- Part Two ---


module.exports = (inputs) => {
  for (let i = 13; i < inputs.length; i += 1) {
    if (new Set(inputs.slice(i - 13, i + 1)).size === 14) {
      return i + 1;
    }
  }

  return null;
};
