'use strict';

const { reverseString } = require('../lib');

const isNum = str => /\d/.test(str);

const findFirstNum = (str) => {
  let match = str.match(/\d+/);

  if (!match) {
    return [];
  }

  return [
    Number(match[0]),
    match.index,
    match[0].length
  ];
};

const findLastNum = (str) => {
  let match = reverseString(str).match(/\d+/);

  if (!match) {
    return [];
  }

  return [
    Number(reverseString(match[0])),
    str.length - match.index - match[0].length,
    match[0].length
  ];
};

const findFirstPair = (str) => {
  let match = str.match(/\[(\d+),(\d+)\]/);

  if (!match) {
    return [];
  }

  return [
    Number(match[1]),
    Number(match[2]),
    match.index,
    match[0].length
  ];
};

const snailSplode = (snailNum) => {
  let snailDepth = 0;

  for (let i = 0; i < snailNum.length; i += 1) {
    let snailChar = snailNum[i];

    if (snailChar === '[' && snailDepth >= 4) {
      let [x, y, idx, len] = findFirstPair(snailNum.slice(i));

      if (len && idx === 0) {
        let [prev, prevIdx, prevLen] = findLastNum(snailNum.slice(0, i));
        let [next, nextIdx, nextLen] = findFirstNum(snailNum.slice(i + len));
        nextIdx += i + len;

        if (!prevLen) {
          return [
            snailNum.slice(0, i),
            0,
            snailNum.slice(i + len, nextIdx),
            y + next,
            snailNum.slice(nextIdx + nextLen)
          ].join('');
        }

        if (!nextLen) {
          return [
            snailNum.slice(0, prevIdx),
            x + prev,
            snailNum.slice(prevIdx + prevLen, i),
            0,
            snailNum.slice(i + len)
          ].join('');
        }

        return [
          snailNum.slice(0, prevIdx),
          x + prev,
          snailNum.slice(prevIdx + prevLen, i),
          0,
          snailNum.slice(i + len, nextIdx),
          y + next,
          snailNum.slice(nextIdx + nextLen)
        ].join('');
      }
    }

    if (snailChar === '[') {
      snailDepth += 1;
    }
    if (snailChar === ']') {
      snailDepth -= 1;
    }
  }

  return snailNum;
};

const snailSplit = (snailNum) => {
  for (let i = 0; i < snailNum.length; i += 1) {
    let snailChar = snailNum[i];
    let nextChar = snailNum[i + 1];

    if (isNum(snailChar) && isNum(nextChar)) {
      let num = Number(snailChar + nextChar);

      return [
        snailNum.slice(0, i),
        '[',
        Math.floor(num / 2),
        ',',
        Math.ceil(num / 2),
        ']',
        snailNum.slice(i + 2)
      ].join('');
    }
  }

  return snailNum;
};

const snailReduce = (snailNum) => {
  let sploded = snailSplode(snailNum);
  if (sploded !== snailNum) {
    return snailReduce(sploded);
  }

  let splitted = snailSplit(sploded);
  if (splitted !== sploded) {
    return snailReduce(splitted);
  }

  return snailNum;
};

const snailSum = (snailNumA, snailNumB) => {
  let sum = [
    '[',
    snailNumA,
    ',',
    snailNumB,
    ']'
  ].join('');

  return snailReduce(sum);
};

const snailMagnitude = (snailNum) => {
  const snailVals = JSON.parse(snailNum);

  if (!Array.isArray(snailVals)) {
    return snailVals;
  }

  let x = JSON.stringify(snailVals[0]);
  let y = JSON.stringify(snailVals[1]);

  return 3 * snailMagnitude(x) + 2 * snailMagnitude(y);
};


module.exports = {
  isNum,
  findFirstNum,
  findLastNum,
  findFirstPair,
  snailSplode,
  snailSplit,
  snailSum,
  snailMagnitude
};
