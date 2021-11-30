const { mkdir, writeFile } = require('fs').promises;
const { resolve } = require('path');


const PART_1_NAME = '1.js';
const PART_1_TEMPLATE = (day) => (
`'use strict';

// --- Day ${day.replace(/^0+/, '')} ---

// const {  } = require('lodash');
// const {  } = require('../lib');


module.exports = (inputs) => {

  return inputs;
};
`
);

const PART_2_NAME = '2.js';
const PART_2_TEMPLATE = () => (
`'use strict';

// --- Part Two ---

// const {  } = require('lodash');
// const {  } = require('../lib');


module.exports = (inputs) => {

  return inputs;
};
`
);

const INPUT_NAME = 'input.txt';
const INPUT_TEMPLATE = () => '';


const main = async () => {
  const day = process.argv[2];

  const dayDir = resolve(process.cwd(), day);
  await mkdir(dayDir);

  writeFile(resolve(dayDir, PART_1_NAME), PART_1_TEMPLATE(day));
  writeFile(resolve(dayDir, PART_2_NAME), PART_2_TEMPLATE(day));
  writeFile(resolve(dayDir, INPUT_NAME), INPUT_TEMPLATE(day));
};


if (require.main === module) {
  main();
}


module.exports = {};
