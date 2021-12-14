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

/**
 * Shallowly merges an array of objects using a reducer function.
 * Basically the array reduce if each property were its own accumulator.
 *
 * Also differs from lodash's merge and mergeWith in a few key ways:
 *   - Returns a new object rather than mutating the first one
 *   - It is possible to pass in an initialValue for props
 *   - If a prop is missing from previous objects, the reducer will be called
 *     as if this prop were the first item, rather than with undefined
 *
 * @param {Array<Object>} objs - an array of the objects to merge
 * @param {function} reducer - receives the current prop value and next prop
 *                             value, returns the value to set to the prop
 * @param {*} [initialValue] - optional initial value for each prop
 * @returns {Object} the merged object
 */
const mergeReduced = (objs, reducer, initialValue) => {
  const merged = {};

  for (const obj of objs) {
    for (const [key, val] of Object.entries(obj)) {
      if (hasProp(merged, key)) {
        merged[key] = reducer(merged[key], val, key, merged, objs);
      } else if (initialValue !== undefined) {
        merged[key] = reducer(initialValue, val, key, merged, objs);
      } else {
        merged[key] = val;
      }
    }
  }

  return merged;
};

module.exports = {
  hasProp,
  mergeReduced
};
