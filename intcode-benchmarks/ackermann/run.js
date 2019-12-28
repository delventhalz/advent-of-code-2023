const { getRunner } = require('../../lib/intcode.js');

module.exports = (inputs) => {
  const run = getRunner(inputs, { quietIO: true });
  return run(3, 6)[0];
};
