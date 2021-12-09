const { hasOwnProperty } = Object.prototype;

/**
 * Checks if a value (usually an object) has a property.
 *
 * @param {*} val - the value to check for a property
 * @param {string} prop - the property name to check for
 * @returns {boolean} whether or the property is on the value
 */
const hasProp = (val, prop) => {
  if (val == null) {
    return false;
  }

  return hasOwnProperty.call(val, prop);
};

module.exports = {
  hasProp
};
