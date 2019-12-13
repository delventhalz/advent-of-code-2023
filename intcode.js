// ----- OPS -----
const getAdder = (state) => function add(x, y, outputRef) {
  state[outputRef] = x + y;
};

const getMultiplier = (state) => function multiply(x, y, outputRef) {
  state[outputRef] = x * y;
};

const getIOInputter = (state, ioInputs, quietIO) => function ioIn(outputRef) {
  const input = ioInputs.pop();

  if (!quietIO) {
    console.log('input:', input);
  }

  state[outputRef] = input;
};

const getIOOutputter = (outputs, quietIO) => function ioOut(x) {
  if (!quietIO) {
    console.log('output:', x);
  }

  outputs.push(x);
};

const jumpIfTrue = function jumpIfTrue(toTest, jumpTo) {
  return toTest ? jumpTo : undefined;
};

const jumpIfFalse = function jumpIfFalse(toTest, jumpTo) {
  return toTest ? undefined : jumpTo;
};

const getLessThanner = (state) => function lessThan(x, y, outputRef) {
  state[outputRef] = x < y ? 1 : 0;
};

const getEqualser = (state) => function equals(x, y, outputRef) {
  state[outputRef] = x === y ? 1 : 0;
};

const getBaseAdjuster = (state) => function adjustRelBase(x) {
  state.relBase += x;
};


// ----- UTILS -----
const parseOpCode = (rawOpCode) => {
  const strOpCode = String(rawOpCode);
  const opCode = Number(strOpCode.slice(-2));
  const paramModes = strOpCode
    .slice(0, -2)
    .split('')
    .reverse()
    .map(Number);

  return { opCode, paramModes };
};

const getInputParser = (state) => (paramModes, inputs) => inputs
  .map((input, i) => [input, paramModes[i] || 0])
  .map(([input, mode]) => {
    switch (mode) {
      case 0:  // positional
        return state[input];
      case 1:  // immediate
        return input;
      case 2:  // relative
        return state[state.relBase + input];
      default:
        throw new Error(`Bad input mode: ${mode}`);
    }
  });

const getOutputParser = (state) => (paramModes, outputs) => outputs
  .map((output, i) => [output, paramModes[i] || 0])
  .map(([output, mode]) => {
    switch (mode) {
      case 0:  // positional
        return output;
      case 1:  // immediate
        return NaN;
      case 2:  // relative
        return state.relBase + output;
      default:
        throw new Error(`Bad output mode: ${mode}`);
    }
  });


const getExecutor = (currentRef, debugMode) => (op, ...params) => {
  if (debugMode) {
    console.log('>>>', op.name, ...params);
  }

  const opOutput = op(...params);
  return opOutput === undefined
    ? currentRef + op.length + 1
    : opOutput;
};


// ----- RUNNER -----
const getRunner = (initialState, options = {}) => {
  const {
    debugMode = false,
    pauseOnInput = false,
    pauseOnOutput = false,
    quietIO = false
  } = options;

  const state = initialState.slice();
  state.relBase = 0;
  let ref = 0;

  const parseInputs = getInputParser(state);
  const parseOutputs = getOutputParser(state);
  const add = getAdder(state);
  const multiply = getMultiplier(state);
  const lessThan = getLessThanner(state);
  const equals = getEqualser(state);
  const adjustRelBase = getBaseAdjuster(state);

  return (...ioInputsInOrder) => {
    const ioInputs = ioInputsInOrder.slice().reverse();
    const outputs = [];
    const ioIn = getIOInputter(state, ioInputs, quietIO);
    const ioOut = getIOOutputter(outputs, quietIO);

    while (true) {
      const { opCode, paramModes } = parseOpCode(state[ref]);
      const exec = getExecutor(ref, debugMode);

      const params = state.slice(ref + 1, ref + 4);
      // eslint-disable-next-line no-unused-vars
      const [x, y, z] = parseInputs(paramModes, params);
      // eslint-disable-next-line no-unused-vars
      const [xOut, yOut, zOut] = parseOutputs(paramModes, params);

      switch (opCode) {
        case 1:
          ref = exec(add, x, y, zOut);
          break;
        case 2:
          ref = exec(multiply, x, y, zOut);
          break;
        case 3:
          if (pauseOnInput && ioInputs.length === 0) return outputs;
          ref = exec(ioIn, xOut);
          break;
        case 4:
          ref = exec(ioOut, x);
          if (pauseOnOutput) return outputs.pop();
          break;
        case 5:
          ref = exec(jumpIfTrue, x, y);
          break;
        case 6:
          ref = exec(jumpIfFalse, x, y);
          break;
        case 7:
          ref = exec(lessThan, x, y, zOut);
          break;
        case 8:
          ref = exec(equals, x, y, zOut);
          break;
        case 9:
          ref = exec(adjustRelBase, x);
          break;
        case 99:
          if (debugMode) console.log('terminate');
          if (pauseOnInput) return outputs.concat(null);
          if (pauseOnOutput) return null;
          return outputs;
        default:
          throw new Error(`Bad opcode ${opCode} generated from: ${state[ref]}`);
      }
    }
  };
};

module.exports = {
  getAdder,
  getMultiplier,
  getIOInputter,
  getIOOutputter,
  jumpIfTrue,
  jumpIfFalse,
  getLessThanner,
  getEqualser,
  parseOpCode,
  getInputParser,
  getExecutor,
  getRunner
};
