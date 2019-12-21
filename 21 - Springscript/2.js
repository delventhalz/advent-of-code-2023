// --- Part Two ---

// There are many areas the springdroid can't reach. You flip through the
// manual and discover a way to increase its sensor range.

// Instead of ending your springcode program with WALK, use RUN. Doing this
// will enable extended sensor mode, capable of sensing ground up to nine tiles
// away. This data is available in five new read-only registers:

// - Register E indicates whether there is ground five tiles away.
// - Register F indicates whether there is ground six tiles away.
// - Register G indicates whether there is ground seven tiles away.
// - Register H indicates whether there is ground eight tiles away.
// - Register I indicates whether there is ground nine tiles away.

// All other functions remain the same.

// Successfully survey the rest of the hull by ending your program with RUN.
// What amount of hull damage does the springdroid now report?

const { getRunner } = require('../lib/intcode.js');


const SPRINGSCRIPT = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
NOT E T
NOT T T
OR H T
AND T J
RUN
`.slice(1);


const asciiToCodes = (ascii) => ascii.split('').map(char => char.charCodeAt(0));
const codesToAscii = (codes) => codes.map(code => String.fromCharCode(code)).join('');

const parseOutputs = (outputs) => {
  const last = outputs[outputs.length - 1];
  if (last > 255) {
    return `${codesToAscii(outputs.slice(0, -1))}\n\nDamage: ${last}`;
  }

  return codesToAscii(outputs);
};


module.exports = (inputs) => {
  const run = getRunner(inputs, { quietIO: true });
  const outputs = run(...asciiToCodes(SPRINGSCRIPT));
  return parseOutputs(outputs);
};


// Your puzzle answer was 1141457530.
