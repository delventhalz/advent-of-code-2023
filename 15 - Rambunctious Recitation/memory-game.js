// I was fascinated by the vastly different run times when solving
// this problem with different data types but no changes in logic.
// Very small changes like initializing an array with a length led to
// nearly a 300x difference in speed!!

// In order to play around with that, I built a uniform interface for
// initializing and using five different data types, and ran some tests.

// All tests were run on a 2018 MacBook Air with Node 12.13.0,
// searching for the 30,000,000th number in Part 2.

// Data Type            | Run Time | Memory Use | Relative Time
// ---------------------+----------+------------+--------------
// []                   |  355 sec |  23000 MB* |          380x
// {}                   |  343 sec |  23000 MB* |          370x
// new Map()            | 6.86 sec |     234 MB |          7.4x
// new Array(length)    | 1.22 sec |     238 MB |          1.3x
// new Uint32Array(...) | 0.93 sec |     116 MB |            1x

// * Memory usage for vanilla JS arrays and objects grew unbounded until
//   execution stopped or the process hit the max-old-space-size for Node.
//   Hitting that size limit would cause memory usage to drop to ~300MB
//   before it started to climb again.

const _initArray = () => {
  const array = [];

  const get = index => array[index];
  const set = (index, value) => {
    array[index] = value;
  };

  return [get, set];
};

const _initObject = () => {
  const object = [];

  const get = key => object[key];
  const set = (key, value) => {
    object[key] = value;
  };

  return [get, set];
};

const _initMap = () => {
  const map = new Map();

  const get = key => map.get(key);
  const set = (key, value) => map.set(key, value);

  return [get, set];
};

const _initSizedArray = (length) => {
  const sizedArray = new Array(length);

  const get = index => sizedArray[index];
  const set = (index, value) => {
    sizedArray[index] = value;
  };

  return [get, set];
};

const _initTypedArray = (length) => {
  const typedArray = new Uint32Array(new ArrayBuffer(length * 4));

  const get = index => typedArray[index];
  const set = (index, value) => {
    typedArray[index] = value;
  };

  return [get, set];
};


/*** CHANGE THIS VALUE TO CHANGE DATA TYPE ***/
const initMemory = _initTypedArray;


const memoryGame = (startingNumbers, stopAt) => {
  const [getMemory, setMemory] = initMemory(stopAt);
  const startingLength = startingNumbers.length;
  let last;

  // TypedArrays are populated with zeros, so we must use one-based indexing
  for (let i = 1; i <= startingLength; i += 1) {
    setMemory(startingNumbers[i - 1], i);
  }

  for (let i = startingLength + 1; i <= stopAt; i += 1) {
    const remembered = getMemory(last);
    const next = remembered ? i - 1 - remembered : 0;

    setMemory(last, i - 1);
    last = next;
  }

  return last;
};


module.exports = {
  memoryGame
};
