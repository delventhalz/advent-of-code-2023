/**
 * --- Advent of Code 2023 ---
 *
 * Day 19: Aplenty
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/19
 */

// import {  } from 'lodash-es';
import { sum } from '../lib/index.js';


const parseInstruction = (string) => {
  let op = string.includes('<') ? '<' : string.includes('>') ? '>' : null;

  if (!op) {
    return { result: string };
  }

  const [attr, val, result] = string.split(op).flatMap(sect => sect.split(':'));

  return { op, attr, val: Number(val), result };
};

const isAccepted = (part, workflows) => {
  let current = 'in';

  while (current !== 'R' && current !== 'A') {
    const workflow = workflows[current];

    for (const { op, attr, val, result } of workflow) {
      if (op === '<') {
        if (part[attr] < val) {
          current = result;
          break;
        }
      } else if (op === '>') {
        if (part[attr] > val) {
          current = result;
          break;
        }
      } else {
        current = result;
        break;
      }
    }
  }

  return current === 'A';
}

export default function main({ input }) {
  const [workflowString, partString] = input.split('\n\n');

  const workflowEntries = workflowString
    .split('\n')
    .map(line => line.slice(0, -1).split('{'))
    .map(([key, instr]) => [key, instr.split(',').map(parseInstruction)]);

  const workflows = Object.fromEntries(workflowEntries);

  const parts = partString
    .split('\n')
    .map(line => line.slice(1, -1).split(','))
    .map(attrs => attrs.map(attr => attr.split('=')))
    .map(attrs => attrs.map(([key, val]) => [key, Number(val)]))
    .map(Object.fromEntries);

  const accepted = parts.filter(part => isAccepted(part, workflows));


  return sum(accepted.map(part => sum(Object.values(part))));
}
