const english2Number = require('english2Number');

/**
 * Repeatedly split a string based on multiple delimiters,
 * producing more and more deeply nested arrays.
 *
 * @param {string} string - the string to split
 * @param {string[]} delimiters - characters to split on
 * @returns {Array} the split string
 */
const splitNested = (string, delimiters) => {
  if (delimiters.length === 0) {
    return string;
  }

  const nextDelimiters = delimiters.slice(1);

  return string
    .split(delimiters[0])
    .map(item => splitNested(item, nextDelimiters));
};

/**
 * Parses valid number strings, leaving other strings unchanged.
 *
 * @param {string} string - the string to parse
 * @returns {string|number} the original string OR a parsed number
 */
const parseIfNumber = (string) => {
  if (typeof string !== 'string' || string.trim() === '') {
    return string;
  }

  const parsed = Number(string);

  return Number.isNaN(parsed) ? string : parsed;
};

/**
 * Parses numbers written as plain English strings. Returns NaN if string is
 * not a valid number.
 *
 * @param {string} string - the string to parse
 * @returns {number} the parsed number
 */
const parseEnglishNumber = (string) => {
  try {
    return english2Number(string.trim().toLowerCase());
  } catch (_) {
    return NaN;
  }
};

/**
 * Reverses the characters in a string.
 *
 * @param {string} string - the string to reverse
 * @returns {string} the reversed string
 */
const reverseString = str => str.split('').reverse().join('');


module.exports = {
  splitNested,
  parseIfNumber,
  parseEnglishNumber,
  reverseString
};
