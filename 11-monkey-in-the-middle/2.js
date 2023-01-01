'use strict';

// --- Part Two ---

// You're worried you might not ever get your items back. So worried, in fact,
// that your relief that a monkey's inspection didn't damage an item no longer
// causes your worry level to be divided by three.

// Unfortunately, that relief was all that was keeping your worry levels from
// reaching ridiculous levels. You'll need to find another way to keep your
// worry levels manageable.

// At this rate, you might be putting up with these monkeys for a very long
// time - possibly 10000 rounds!

// With these new rules, you can still figure out the monkey business after
// 10000 rounds. Using the same example above:

//     == After round 1 ==
//     Monkey 0 inspected items 2 times.
//     Monkey 1 inspected items 4 times.
//     Monkey 2 inspected items 3 times.
//     Monkey 3 inspected items 6 times.

//     == After round 20 ==
//     Monkey 0 inspected items 99 times.
//     Monkey 1 inspected items 97 times.
//     Monkey 2 inspected items 8 times.
//     Monkey 3 inspected items 103 times.

//     == After round 1000 ==
//     Monkey 0 inspected items 5204 times.
//     Monkey 1 inspected items 4792 times.
//     Monkey 2 inspected items 199 times.
//     Monkey 3 inspected items 5192 times.

//     == After round 2000 ==
//     Monkey 0 inspected items 10419 times.
//     Monkey 1 inspected items 9577 times.
//     Monkey 2 inspected items 392 times.
//     Monkey 3 inspected items 10391 times.

//     == After round 3000 ==
//     Monkey 0 inspected items 15638 times.
//     Monkey 1 inspected items 14358 times.
//     Monkey 2 inspected items 587 times.
//     Monkey 3 inspected items 15593 times.

//     == After round 4000 ==
//     Monkey 0 inspected items 20858 times.
//     Monkey 1 inspected items 19138 times.
//     Monkey 2 inspected items 780 times.
//     Monkey 3 inspected items 20797 times.

//     == After round 5000 ==
//     Monkey 0 inspected items 26075 times.
//     Monkey 1 inspected items 23921 times.
//     Monkey 2 inspected items 974 times.
//     Monkey 3 inspected items 26000 times.

//     == After round 6000 ==
//     Monkey 0 inspected items 31294 times.
//     Monkey 1 inspected items 28702 times.
//     Monkey 2 inspected items 1165 times.
//     Monkey 3 inspected items 31204 times.

//     == After round 7000 ==
//     Monkey 0 inspected items 36508 times.
//     Monkey 1 inspected items 33488 times.
//     Monkey 2 inspected items 1360 times.
//     Monkey 3 inspected items 36400 times.

//     == After round 8000 ==
//     Monkey 0 inspected items 41728 times.
//     Monkey 1 inspected items 38268 times.
//     Monkey 2 inspected items 1553 times.
//     Monkey 3 inspected items 41606 times.

//     == After round 9000 ==
//     Monkey 0 inspected items 46945 times.
//     Monkey 1 inspected items 43051 times.
//     Monkey 2 inspected items 1746 times.
//     Monkey 3 inspected items 46807 times.

//     == After round 10000 ==
//     Monkey 0 inspected items 52166 times.
//     Monkey 1 inspected items 47830 times.
//     Monkey 2 inspected items 1938 times.
//     Monkey 3 inspected items 52013 times.

// After 10000 rounds, the two most active monkeys inspected items 52166 and
// 52013 times. Multiplying these together, the level of monkey business in
// this situation is now 2713310158.

// Worry levels are no longer divided by three after each item is inspected;
// you'll need to find another way to keep your worry levels manageable.
// Starting again from the initial state in your puzzle input, what is the
// level of monkey business after 10000 rounds?

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

// Your puzzle answer was 20683044837.
