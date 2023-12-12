/**
 * --- Advent of Code 2023 ---
 *
 * Day 12: Hot Springs
 * (Part 1)
 *
 * https://adventofcode.com/2023/day/12
 */

import { isEmpty } from 'lodash-es';
import { count, sum } from '../lib/index.js';


const isValidPermutation = (permutation, brokenCounts) => {
  if (isEmpty(permutation)) {
    return isEmpty(brokenCounts);
  }
  if (isEmpty(brokenCounts)) {
    return permutation.every(tile => tile !== '#');
  }

  const [count] = brokenCounts;
  let start = permutation.indexOf('#');

  for (let i = 0; i < count; i += 1) {
    if (permutation[start + i] !== '#') {
      return false;
    }
  }

  if (permutation[start + count] === '#') {
    return false;
  }

  return isValidPermutation(permutation.slice(start + count), brokenCounts.slice(1));
};

const getPermutations = (row) => {
  const headPermutations = [];

  if (row[0] === '?') {
    headPermutations.push('.', '#');
  } else {
    headPermutations.push(row[0]);
  }

  if (row.length === 1) {
    return headPermutations;
  }

  const tailPermutations = getPermutations(row.slice(1));

  return headPermutations.flatMap(head => tailPermutations.map(tail => head + tail));
}


export default function main({ lines }) {
  const list = lines
    .map(line => line.split(' '))
    .map(([row, counts]) => [
      row.split(''),
      counts.split(',').map(Number)
    ]);

  const validCounts = list.map(([row, counts]) => {
    return count(getPermutations(row), (perm) => {
      return isValidPermutation(perm.split(''), counts);
    });
  });

  return sum(validCounts);
}
