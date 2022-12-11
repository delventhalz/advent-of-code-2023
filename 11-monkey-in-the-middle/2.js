'use strict';

// --- Part Two ---

const MAGIC_NUMBER = 9699690;

const MONKEYS = [
  {
    id: 0,
    items: [84, 66, 62, 69, 88, 91, 91],
    operate: old => old * 11,
    test: item => item % 2 === 0,
    passTo: 4,
    failTo: 7,
    inspections: 0,
  },
  {
    id: 1,
    items: [98, 50, 76, 99],
    operate: old => old * old,
    test: item => item % 7 === 0,
    passTo: 3,
    failTo: 6,
    inspections: 0,
  },
  {
    id: 2,
    items: [72, 56, 94],
    operate: old => old + 1,
    test: item => item % 13 === 0,
    passTo: 4,
    failTo: 0,
    inspections: 0,
  },
  {
    id: 3,
    items: [55, 88, 90, 77, 60, 67],
    operate: old => old + 2,
    test: item => item % 3 === 0,
    passTo: 6,
    failTo: 5,
    inspections: 0,
  },
  {
    id: 4,
    items: [69, 72, 63, 60, 72, 52, 63, 78],
    operate: old => old * 13,
    test: item => item % 19 === 0,
    passTo: 1,
    failTo: 7,
    inspections: 0,
  },
  {
    id: 5,
    items: [89, 73],
    operate: old => old + 5,
    test: item => item % 17 === 0,
    passTo: 2,
    failTo: 0,
    inspections: 0,
  },
  {
    id: 6,
    items: [78, 68, 98, 88, 66],
    operate: old => old + 6,
    test: item => item % 11 === 0,
    passTo: 2,
    failTo: 5,
    inspections: 0,
  },
  {
    id: 7,
    items: [70],
    operate: old => old + 7,
    test: item => item % 5 === 0,
    passTo: 1,
    failTo: 3,
    inspections: 0,
  },
];

module.exports = () => {
  for (let i = 0; i < 10000; i += 1) {
    for (const monkey of MONKEYS) {
      while(monkey.items.length > 0) {
        let item = monkey.items.shift();
        item = monkey.operate(item);
        item = item % MAGIC_NUMBER;

        if (monkey.test(item)) {
          MONKEYS[monkey.passTo].items.push(item);
        } else {
          MONKEYS[monkey.failTo].items.push(item);
        }

        monkey.inspections += 1;
      }
    }
  }

  const scores = MONKEYS.map(monkey => monkey.inspections).sort((a, b) => b - a);
  return scores[0] * scores[1];
};
