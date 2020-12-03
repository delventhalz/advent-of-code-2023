'use strict';
const { readFile } = require('fs').promises;
const { dirname, resolve } = require('path');


const INPUT_FILENAME = 'input.txt';

const roundToPlaces = (num, maxPlaces) => {
  const factor = 10 ** maxPlaces;
  return Math.floor(num * factor) / factor;
};

const toTimeString = (ms) => {
  if (ms > 3600000) {
    return `${roundToPlaces(ms / 3600000, 3)} hours`;
  }
  if (ms > 60000) {
    return `${roundToPlaces(ms / 60000, 3)} minutes`;
  }
  if (ms < 1) {
    return `<0.001 seconds`;
  }
  return `${roundToPlaces(ms / 1000, 3)} seconds`;
};

const flattenSingleElementArrays = (input) => {
  if (!Array.isArray(input)) {
    return input;
  }

  if (input.length === 1) {
    return flattenSingleElementArrays(input[0]);
  }

  return input.map(flattenSingleElementArrays);
};

const getSolutionPath = () => {
  const relativePath = process.argv[2];

  if (!relativePath) {
    console.error('Must provide a path to a solution file!');
    process.exit(1);
  }

  return resolve(process.cwd(), relativePath);
}

const nestedMap = (arr, fn) => arr.map((item, i, arr) => (
  Array.isArray(item) ? nestedMap(item, fn) : fn(item, i, arr)
));

const parseIfNumber = (str) => {
  const num = Number(str);
  return Number.isNaN(num) ? str : num;
};

// Sensibly parses most AoC inputs, leaving edge cases as a string.
//
// Steps:
//   - Remove any trailing newline
//   - Split on newlines
//   - Split on commas
//   - Remove any wrapping arrays with only a single element
//   - If any arrays remain, parse any number elements
//
// Examples:
//   "1,2,3\n4,5,6\n" -> [[1, 2, 3], [4, 5, 6]]
//   "foo,bar,baz\n"  -> ['foo', 'bar', 'baz']
//   "qux\nquux\nquz" -> ['qux', 'quux', 'quz']
//   "corge\n"        -> 'corge'
//   "12345"          -> '12345'
const parseInputs = (inputBuffer) => {
  const inputString = inputBuffer.toString();
  const trimmed = inputString[inputString.length - 1] === '\n'
    ? inputString.slice(0, -1)
    : inputString;

  const split = trimmed
    .split('\n')
    .map(line => line.split(','));

  const flattened = flattenSingleElementArrays(split);

  return Array.isArray(flattened)
    ? nestedMap(flattened, parseIfNumber)
    : flattened;
};


const main = async () => {
  const solutionPath = getSolutionPath();
  const inputsPath = resolve(dirname(solutionPath), INPUT_FILENAME);

  const solution = require(solutionPath);
  const inputs = parseInputs(await readFile(inputsPath));

  const relPath = process.argv[2]
  console.log(relPath, '\n'.padEnd(relPath.length + 1, '-'), '\n');

  const start = Date.now()
  console.log(await solution(inputs), '\n');
  const duration = `in ${toTimeString(Date.now() - start)}`;
  console.log(''.padEnd(duration.length + 1, '-'));
  console.log(duration, '\n');
};


if (require.main === module) {
  main();
}


module.exports = {
  getSolutionPath,
  parseIfNumber,
  parseInputs
};
