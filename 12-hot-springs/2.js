/**
 * --- Advent of Code 2023 ---
 *
 * Day 12: Hot Springs
 * (Part 2)
 *
 * https://adventofcode.com/2023/day/12#part2
 */

import { isEmpty, memoize } from 'lodash-es';
import { sum } from '../lib/index.js';


const toMemoKey = (row, counts) => row.join('') + '|' + counts.join();


// Count the number of possible permutations if we start the row with a dot
const countDotPermutations = memoize((row, counts) => {
  // Last cell a dot and there are no more counts, this is a valid permutation
  if (row.length === 1 && isEmpty(counts)) {
    return 1;
  }

  // You can remove the leading dot without changing the valid permutations
  return countPermutations(row.slice(1), counts);
}, toMemoKey);


// Count the number of possible permutations if we start the row with a hash
const countHashPermutations = memoize((row, counts) => {
  const [next, ...rest] = counts;

  // Row is too short to satisfy counts, no valid permutations
  if (row.length < next) {
    return 0;
  }

  // A dot in the section we need for hashes, no valid permutations
  if (row.slice(0, next).some(tile => tile === '.')) {
    return 0;
  }

  // A hash where we need a border between hash sections, no valid permutations
  if (row[next] === '#') {
    return 0;
  }

  // At the end of row and counts and we can build one valid permutation
  if (isEmpty(rest) && (row.length === next || row.length === next + 1)) {
    return 1;
  }

  // We can satisfy the next count and the row isn't done, so valid permutations
  // is equal to those with the remainder of the row and the rest of the counts
  return countPermutations(row.slice(next + 1), rest);
}, toMemoKey);


// Count the total number of permutations for this row
const countPermutations = memoize((row, counts) => {
  // No row, no valid permutations
  if (isEmpty(row)) {
    return 0;
  }

  if (isEmpty(counts)) {
    // No more counts but hashes remain, no valid permutations
    if (row.some(tile => tile === '#')) {
      return 0;
    }

    // No more counts and no remaining hashes, one valid permutation
    return 1;
  }

  // We can short circuit if row is too short to satisfy the remaining counts
  if (row.length < sum(counts)) {
    return 0;
  }

  // First tile is a dot, count the dot permutations
  if (row[0] === '.') {
    return countDotPermutations(row, counts);
  }

  // First tile is a hash, count the hash permutations
  if (row[0] === '#') {
    return countHashPermutations(row, counts);
  }

  // First tile is a question mark, add the dot and hash permutations together
  return countDotPermutations(row, counts) + countHashPermutations(row, counts);
}, toMemoKey);


export default function main({ lines }) {
  const list = lines
    .map(line => line.split(' '))
    .map(([row, counts]) => [
      Array(5).fill(row).join('?').split(''),
      Array(5).fill(counts).join(',').split(',').map(Number)
    ]);

  const arrangementCounts = list.map(([row, counts]) => countPermutations(row, counts));

  return sum(arrangementCounts);
}
