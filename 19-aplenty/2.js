/**
 * --- Advent of Code 2023 ---
 *
 * Day 19: Aplenty
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/19#part2
 */

// import {  } from 'lodash-es';
// import { sum } from '../lib/index.js';

const MIN = 1;
const MAX = 4001;

const parseInstruction = (string) => {
  let op = string.includes('<') ? '<' : string.includes('>') ? '>' : null;

  if (!op) {
    return { result: string };
  }

  const [attr, val, result] = string.split(op).flatMap(sect => sect.split(':'));

  return { op, attr, val: Number(val), result };
};

const getWorkflowsByResult = (key, workflowEntries) => {
  return workflowEntries
    .filter(([_, instrs]) => instrs.some(instr => instr.result === key))
    .map(([key]) => key);
};

const workflowToRange = (workflows, key, target, range) => {
  // const range = {
  //   x: [MIN, MAX],
  //   m: [MIN, MAX],
  //   a: [MIN, MAX],
  //   s: [MIN, MAX]
  // };

  const nextRange = structuredClone(range);

  let current = start;
  let target = 'A';

  while (target) {
    const targetIndex = workflows[current].findLastIndex(instr => instr.result === target);
    const workflow = workflows[current];

    for (let i = targetIndex; i >= 0; i -= 1) {
      const { op, attr, val, result } = workflow[i];

      if (op === '<') {
        range[attr][1] = Math.min(range[attr][1], val)
      }

      if (op === '>') {
        range[attr][0] = Math.max(range[attr][0], val + 1)
      }
    }
  }

  return range;
};

export default function main({ input }) {
  const workflowEntries = input.split('\n\n')[0]
    .split('\n')
    .map(line => line.slice(0, -1).split('{'))
    .map(([key, instr]) => [key, instr.split(',').map(parseInstruction)]);

  const workflows = Object.fromEntries(workflowEntries);



  return null;
}
