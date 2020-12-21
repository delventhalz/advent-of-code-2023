// --- Part Two ---

// You manage to answer the child's questions and they finish part 1 of their
// homework, but get stuck when they reach the next section: advanced math.

// Now, addition and multiplication have different precedence levels, but
// they're not the ones you're familiar with. Instead, addition is evaluated
// before multiplication.

// For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are
// now as follows:

//     1 + 2 * 3 + 4 * 5 + 6
//       3   * 3 + 4 * 5 + 6
//       3   *   7   * 5 + 6
//       3   *   7   *  11
//          21       *  11
//              231

// Here are the other examples from above:

//     1 + (2 * 3) + (4 * (5 + 6)) still becomes 51.
//     2 * 3 + (4 * 5) becomes 46.
//     5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 1445.
//     5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 669060.
//     ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 23340.

// What do you get if you add up the results of evaluating the homework
// problems using these new rules?

const { sum, parseIfNumber } = require('../lib');


const SYMBOLS = new Set(['+', '*', '(', ')']);


const toSymbols = (line) => {
  const symbols = [];
  let buffer = '';

  const pushBuffer = () => {
    if (buffer !== '') {
      symbols.push(buffer);
      buffer = '';
    }
  };

  for (const char of line) {
    if (char === ' ') {
      pushBuffer();
    } else if (SYMBOLS.has(char)) {
      pushBuffer();
      symbols.push(char);
    } else {
      buffer += char;
    }
  }

  pushBuffer();

  return symbols.map(parseIfNumber);
};


const deepPush = (arr, value, depth) => {
  if (depth === 0) {
    arr.push(value);
  } else {
    deepPush(arr[arr.length - 1], value, depth - 1);
  }
};

const toExpressions = (symbols) => {
  const expressions = [];
  let depth = 0;

  for (const symbol of symbols) {
    if (symbol === '(') {
      deepPush(expressions, [], depth);
      depth += 1;
    } else if (symbol === ')') {
      depth -= 1;
    } else {
      deepPush(expressions, symbol, depth);
    }
  }

  return expressions;
};


const evaluate = (expression) => {
  const flat = expression.map((member) => (
    Array.isArray(member)
      ? evaluate(member)
      : member
  ));

  const added = [];

  for (let i = 0; i < flat.length; i += 1) {
    if (flat[i] === '+') {
      added[added.length - 1] += flat[i + 1];
      i += 1;
    } else  {
      added.push(flat[i]);
    }
  }

  return added
    .filter(num => num !== '*')
    .reduce((prod, num) => prod * num);
};


module.exports = (inputs) => {
  const outputs = inputs
    .map(toSymbols)
    .map(toExpressions)
    .map(evaluate);

  return sum(outputs);
};

// Your puzzle answer was 231235959382961.
