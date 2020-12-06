// Repeatedly split a string based on multiple delimiters,
// producing more and more deeply nested arrays.
const splitNested = (string, delimiters) => {
  if (delimiters.length === 0) {
    return string;
  }

  const nextDelimiters = delimiters.slice(1);

  return string
    .split(delimiters[0])
    .map(item => splitNested(item, nextDelimiters));
};

module.exports = {
  splitNested
};
