import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';


const PART_1_NAME = '1.js';
const PART_1_TEMPLATE = ({ day, year }) => (
`/**
 * --- Advent of Code ${year} ---
 *
 * Day ${day}: TBD
 * (Part 1)
 *
 * https://adventofcode.com/${year}/day/${day}
 */

// import {  } from 'lodash-es';
// import {  } from '../lib/index.js';


export default function main(inputs) {

  return inputs;
}
`
);

const PART_2_NAME = '2.js';
const PART_2_TEMPLATE = ({ day, year }) => (
`/**
 * --- Advent of Code ${year} ---
 *
 * Day ${day}: TBD
 * (Part 2)
 *
 * https://adventofcode.com/${year}/day/${day}#part2
 */

// import {  } from 'lodash-es';
// import {  } from '../lib/index.js';


export default function main(inputs) {

  return inputs;
}
`
);

const INPUT_NAME = 'input.txt';
const INPUT_TEMPLATE = () => '';

const etDayString = new Date().toLocaleString([], { timeZone: 'America/New_York', day: 'numeric' });
const day = Number(etDayString) % 30 + 1;
const year = new Date().getFullYear();

const dirName = process.argv[2] || 'stub';

const dir = resolve(process.cwd(), dirName);
await mkdir(dir);

writeFile(resolve(dir, PART_1_NAME), PART_1_TEMPLATE({ day, year }));
writeFile(resolve(dir, PART_2_NAME), PART_2_TEMPLATE({ day, year }));
writeFile(resolve(dir, INPUT_NAME), INPUT_TEMPLATE());
