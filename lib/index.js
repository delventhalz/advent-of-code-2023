const animation = require('./animation.js');
const arrays = require('./arrays.js');
const math = require('./math.js');
const objects = require('./objects.js');
const string = require('./strings.js');

module.exports = {
  ...animation,
  ...arrays,
  ...math,
  ...objects,
  ...string,
};
