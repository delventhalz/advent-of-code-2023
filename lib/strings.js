import english2Number from 'english2Number';
import { uniq } from 'lodash-es';
import { hasProp } from './objects.js';

/**
 * Repeatedly split a string based on multiple delimiters,
 * producing more and more deeply nested arrays.
 *
 * @param {string} string - the string to split
 * @param {string[]} delimiters - characters to split on
 * @returns {Array} the split string
 */
export const splitNested = (string, delimiters) => {
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
export const parseIfNumber = (string) => {
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
export const parseEnglishNumber = (string) => {
  try {
    return english2Number(string.trim().toLowerCase());
  } catch (_) {
    return NaN;
  }
};

/**
 * Parses a string of one or more tokens into an array of values, based on a
 * token map object.
 *
 * @param {string} string - the string to parse
 * @param {Object} tokenMap - an object mapping string tokens to their values
 * @returns {Array} an array containing the found token values (if any)
 */
export const parseTokens = (string, tokenMap) => {
  const tokenLengths = uniq(Object.keys(tokenMap).map(token => token.length));
  tokenLengths.sort((a, b) => a - b);

  const parsed = [];

  for (let i = 0; i < string.length; i += 1) {
    for (const length of tokenLengths) {
      if (i + length > string.length) {
        break;
      }

      const slice = string.slice(i, i + length);

      if (hasProp(tokenMap, slice)) {
        parsed.push(tokenMap[slice]);
        i += slice.length - 1;
        break;
      }
    }
  }

  return parsed;
};



/**
 * Reverses the characters in a string.
 *
 * @param {string} string - the string to reverse
 * @returns {string} the reversed string
 */
export const reverseString = str => str.split('').reverse().join('');
