'use strict';

// --- Day 6 ---


module.exports = (inputs) => {
  for (let i = 3; i < inputs.length; i += 1) {
    if (new Set(inputs.slice(i - 3, i + 1)).size === 4) {
      return i + 1;
    }
  }

  return null;
};
