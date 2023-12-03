import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';

import { splitNested, parseIfNumber } from './lib/index.js';


const INPUT_FILENAME = 'input.txt';
const DELIMITERS = ['\n\n', '\n', ','];

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

const getSolutionPath = () => {
  const relativePath = process.argv[2];

  if (!relativePath) {
    console.error('Must provide a path to a solution file!');
    process.exit(1);
  }

  return resolve(process.cwd(), relativePath);
};

const nestedMap = (arr, fn) => arr.map((item, i, arr) => (
  Array.isArray(item) ? nestedMap(item, fn) : fn(item, i, arr)
));

const toInputString = (inputBytes) => {
  const inputString = inputBytes.toString();

  // Remove that trailing newline that the text editor adds
  return inputString[inputString.length - 1] === '\n'
    ? inputString.slice(0, -1)
    : inputString;
};

// Sensibly parses most AoC inputs, leaving edge cases as a string.
//
// Steps:
//   - Split on blank lines (if any)
//   - Split on newlines (if any)
//   - Split on commas (if any)
//   - If any delimiters were found, parse numbers
//
// Examples:
//   "1,2,3\n4,5,6\n"   -> [[1, 2, 3], [4, 5, 6]]
//   "ab\nbc\n\ncd\nde" -> [['ab', 'bc'], ['cd', 'de']]
//   "foo,bar,baz\n"    -> ['foo', 'bar', 'baz']
//   "qux\nquux\nquz"   -> ['qux', 'quux', 'quz']
//   "corge\n"          -> 'corge'
//   "12345"            -> '12345'
const parseInputs = (inputString) => {
  const validDelimiters = DELIMITERS
    .filter(delim => inputString.includes(delim));

  // If there are no clearly delimited groups, just return raw string
  if (validDelimiters.length === 0) {
    return inputString;
  }

  const split = splitNested(inputString, validDelimiters);
  return nestedMap(split, parseIfNumber);
};


const solutionPath = getSolutionPath();
const inputsPath = resolve(dirname(solutionPath), INPUT_FILENAME);

const solution = (await import(solutionPath)).default;
const input = toInputString(await readFile(inputsPath));

const lines = input.split('\n');
const matrix = lines.map(line => line.split(''));
const parsed = parseInputs(input);

const relPath = process.argv[2];
console.log(relPath, '\n'.padEnd(relPath.length + 1, '-'), '\n');

const start = Date.now();
const outputs = await solution({ input, lines, matrix, parsed });
const stop = Date.now();

const duration = `in ${toTimeString(stop - start)}`;
console.log(outputs, '\n');
console.log(''.padEnd(duration.length + 1, '-'));
console.log(duration, '\n');
