import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';


const PART_1_NAME = '1.js';
const PART_1_TEMPLATE = (day) => (
`// --- Day ${day.replace(/^0+/, '')} ---

// import {  } from 'lodash-es';
// import {  } from '../lib/index.js';


export default function main(inputs) {

  return inputs;
}
`
);

const PART_2_NAME = '2.js';
const PART_2_TEMPLATE = () => (
`// --- Part Two ---

// import {  } from 'lodash-es';
// import {  } from '../lib/index.js';


export default function main(inputs) {

  return inputs;
}
`
);

const INPUT_NAME = 'input.txt';
const INPUT_TEMPLATE = () => '';

const day = process.argv[2];

const dayDir = resolve(process.cwd(), day);
await mkdir(dayDir);

writeFile(resolve(dayDir, PART_1_NAME), PART_1_TEMPLATE(day));
writeFile(resolve(dayDir, PART_2_NAME), PART_2_TEMPLATE(day));
writeFile(resolve(dayDir, INPUT_NAME), INPUT_TEMPLATE(day));
