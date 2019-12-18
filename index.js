'use strict';
const { readFile } = require('fs').promises;
const { dirname, resolve } = require('path');


const INPUT_FILENAME = 'input.txt';

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
  console.log(await solution(inputs), '\n');
};


if (require.main === module) {
  main();
}


module.exports = {
  getSolutionPath,
  parseIfNumber,
  parseInputs
};
