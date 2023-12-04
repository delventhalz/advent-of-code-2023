import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { dateToTz } from './lib/dates.js';


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


export default function main({ input }) {

  return input;
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


export default function main({ input }) {

  return input;
}
`
);

const INPUT_NAME = 'input.txt';
const INPUT_TEMPLATE = () => '';

const now = dateToTz('America/New_York');
const isStart = now.month === 11 && now.day > 23;
const isDecember = now.month === 12;

const day = isStart ? 1 : isDecember ? Math.min(25, now.day + 1) : 25;
const year = isStart || isDecember ? now.year : now.year - 1;

const dirName = process.argv[2] || 'stub';

const dir = resolve(process.cwd(), dirName);
await mkdir(dir);

writeFile(resolve(dir, PART_1_NAME), PART_1_TEMPLATE({ day, year }));
writeFile(resolve(dir, PART_2_NAME), PART_2_TEMPLATE({ day, year }));
writeFile(resolve(dir, INPUT_NAME), INPUT_TEMPLATE());
