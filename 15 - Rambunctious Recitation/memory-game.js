// I was fascinated by the vastly different run times when solving
// this problem with different data types but no changes in logic.
// Very small changes like initializing an array with a length led to
// nearly a 300x difference in speed!!

// In order to play around with that, I built a uniform interface for
// initializing and using five different data types, and ran some tests.

// All tests were run on a 2018 MacBook Air with Node 12.13.0,
// searching for the 30,000,000th number in Part 2.

//        Data Type        | Run Time | Memory Use | Relative Time
// ------------------------+----------+------------+--------------
// []                      |  355 sec |  23000 MB* |          380x
// {}                      |  343 sec |  23000 MB* |          370x
// new Map()               | 6.86 sec |     234 MB |          7.4x
// new Array(length)       | 1.22 sec |     238 MB |          1.3x
// new Uint32Array(length) | 0.93 sec |     116 MB |            1x

// * Memory usage for vanilla JS arrays and objects grew unbounded until
//   execution stopped or the process hit the max-old-space-size for Node.
//   Hitting that size limit would cause memory usage to drop to ~300MB
//   before it started to climb again.

// I also tested unsized arrays against sized arrays at different counts
// of members. The benefits of pre-sizing arrays started to kick in around
// tens of thousands of members, and grew exponentially from there.

//    Count   |         []        | new Array(length) | Difference
// -----------+-------------------+-------------------+-----------
//      1,000 |        <0.001 sec |        <0.001 sec |          -
//     10,000 |         0.004 sec |         0.002 sec |         2x
//    100,000 |         0.025 sec |         0.006 sec |         4x
//  1,000,000 |         0.86  sec |         0.024 sec |        35x
// 10,000,000 |       112.0   sec |         0.35  sec |       320x

const bracketGetter = (source) => (key) => source[key];
const bracketSetter = (source) => (key, value) => {
  source[key] = value;
};

const _initArray = () => {
  const array = [];
  return [
    bracketGetter(array),
    bracketSetter(array)
  ];
};

const _initObject = () => {
  const object = {};
  return [
    bracketGetter(object),
    bracketSetter(object)
  ];
};

const _initMap = () => {
  const map = new Map();

  const get = key => map.get(key);
  const set = (key, value) => map.set(key, value);

  return [get, set];
};

const _initSizedArray = (length) => {
  const sizedArray = new Array(length);
  return [
    bracketGetter(sizedArray),
    bracketSetter(sizedArray)
  ];
};

const _initTypedArray = (length) => {
  const typedArray = new Uint32Array(length);
  return [
    bracketGetter(typedArray),
    bracketSetter(typedArray)
  ];
};


/*** CHANGE THIS VALUE TO CHANGE DATA TYPE ***/
const initMemory = _initTypedArray;


const memoryGame = (startingNumbers, stopAt) => {
  const [getMemory, setMemory] = initMemory(stopAt);

  for (let i = 0; i < startingNumbers.length - 1; i += 1) {
    // TypedArrays are populated with zeros, so we must use one-based indexing
    setMemory(startingNumbers[i], i + 1);
  }

  let last = startingNumbers[startingNumbers.length - 1];

  for (let i = startingNumbers.length; i < stopAt; i += 1) {
    const remembered = getMemory(last);
    setMemory(last, i);
    last = remembered ? i - remembered : 0;
  }

  return last;
};


module.exports = {
  memoryGame
};
