'use strict';

const { expect } = require('chai');
const {
  isNum,
  findFirstNum,
  findLastNum,
  findFirstPair,
  snailSplode,
  snailSplit,
  snailSum,
  snailMagnitude
} = require('./snails.js');

describe('snails', () => {
  describe('isNum', () => {
    it('checks if a char is a decimal number', () => {
      expect(isNum('7')).to.equal(true);
      expect(isNum('0')).to.equal(true);
      expect(isNum('A')).to.equal(false);
      expect(isNum('e')).to.equal(false);
    });
  });

  describe('findFirstNum', () => {
    it('finds the first number in a string with its index and length', () => {
      const [num, idx, len] = findFirstNum(']]]],[6,[5,[4,[3,2]]]]]');

      expect(num).to.equal(6);
      expect(idx).to.equal(6);
      expect(len).to.equal(1);
    });

    it('finds double-digit first numbers', () => {
      const [num, idx, len] = findFirstNum(']]]],[16,[5,[4,[3,2]]]]]');

      expect(num).to.equal(16);
      expect(idx).to.equal(6);
      expect(len).to.equal(2);
    });

    it('returns an empty array when there is no match', () => {
      const match = findFirstNum(']]]]]');
      expect(match).to.deep.equal([]);
    });
  });

  describe('findLastNum', () => {
    it('finds the last number in a string with its index and length', () => {
      const [num, idx, len] = findLastNum('[[3,[2,[1,[7,3]]]],[');

      expect(num).to.equal(3);
      expect(idx).to.equal(13);
      expect(len).to.equal(1);
    });

    it('finds double-digit last numbers', () => {
      const [num, idx, len] = findLastNum('[[3,[2,[1,[7,13]]]],[');

      expect(num).to.equal(13);
      expect(idx).to.equal(13);
      expect(len).to.equal(2);
    });

    it('finds double-digit last numbers with trailing zeroes', () => {
      const [num, idx, len] = findLastNum('[[3,[2,[1,[7,10]]]],[');

      expect(num).to.equal(10);
      expect(idx).to.equal(13);
      expect(len).to.equal(2);
    });

    it('returns an empty array when there is no match', () => {
      const match = findLastNum('[[');
      expect(match).to.deep.equal([]);
    });
  });

  describe('findFirstPair', () => {
    it('finds the first simple pair number in a string with its index and length', () => {
      const [x, y, idx, len] = findFirstPair('[6,[5,[4,[3,2]]]]]');

      expect(x).to.equal(3);
      expect(y).to.equal(2);
      expect(idx).to.equal(9);
      expect(len).to.equal(5);
    });

    it('finds double-digit first numbers', () => {
      const [x, y, idx, len] = findFirstPair('[6,[5,[4,[13,2]]]]]');

      expect(x).to.equal(13);
      expect(y).to.equal(2);
      expect(idx).to.equal(9);
      expect(len).to.equal(6);
    });

    it('returns an empty array when there is no match', () => {
      const match = findFirstPair(']]]]]');
      expect(match).to.deep.equal([]);
    });
  });

  describe('snailSplode', () => {
    it('splodes pairs nested 4 or more levels deep', () => {
      const sploded = snailSplode('[[6,[5,[4,[3,2]]]],1]');
      expect(sploded).to.equal('[[6,[5,[7,0]]],3]');
    });

    it('splodes with no left number', () => {
      const sploded = snailSplode('[[[[[9,8],1],2],3],4]');
      expect(sploded).to.equal('[[[[0,9],2],3],4]');
    });

    it('splodes with no right number', () => {
      const sploded = snailSplode('[7,[6,[5,[4,[3,2]]]]]');
      expect(sploded).to.equal('[7,[6,[5,[7,0]]]]');
    });

    it('splodes only the left-most pair', () => {
      const sploded = snailSplode('[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]');
      expect(sploded).to.equal('[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]');
    });

    it('splodes with two-digit numbers', () => {
      const sploded = snailSplode('[[6,[5,[4,[3,12]]]],1]');
      expect(sploded).to.equal('[[6,[5,[7,0]]],13]');
    });

    it('splodes with a two-digit left number', () => {
      const sploded = snailSplode('[[[9,[0,14]],[[5,17],[3,0]]],[[[7,9],[16,0]],[[10,[1,2]],[[1,4],2]]]]');
      expect(sploded).to.equal('[[[9,[0,14]],[[5,17],[3,0]]],[[[7,9],[16,0]],[[11,0],[[3,4],2]]]]');
    });

    it('splodes with a two-digit right number', () => {
      const sploded = snailSplode('[[[9,[0,14]],[[5,17],[3,0]]],[[[7,9],[16,0]],[[1,[1,2]],[[10,4],2]]]]');
      expect(sploded).to.equal('[[[9,[0,14]],[[5,17],[3,0]]],[[[7,9],[16,0]],[[2,0],[[12,4],2]]]]');
    });

    it('splodes with no adjacent numbers', () => {
      const sploded = snailSplode('[[7,[6,[[5,4],[3,2]]]],1]');
      expect(sploded).to.equal('[[7,[11,[0,[7,2]]]],1]');
    });

    it('splodes when extra deeply nested', () => {
      const sploded = snailSplode('[7,[[6,[5,[4,[3,2]]]],1]]');
      expect(sploded).to.equal('[7,[[6,[5,[7,0]]],3]]');
    });

    it('returns the same number when there is nothing to splode', () => {
      const sploded = snailSplode('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
      expect(sploded).to.equal('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
    });
  });

  describe('snailSplit', () => {
    it('splits two-digit numbers', () => {
      const splitted = snailSplit('[[[0,7],4],[[7,8],[0,13]]]');
      expect(splitted).to.deep.equal('[[[0,7],4],[[7,8],[0,[6,7]]]]');
    });

    it('splits only the left-most number', () => {
      const splitted = snailSplit('[[[0,7],4],[15,[0,13]]]');
      expect(splitted).to.deep.equal('[[[0,7],4],[[7,8],[0,13]]]');
    });

    it('returns the same array when there is nothing to split', () => {
      const splitted = snailSplit('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
      expect(splitted).to.equal('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');
    });
  });

  describe('snailSum', () => {
    it('nests snailfish numbers in a pair', () => {
      const sum = snailSum('[1,1]', '[2,2]');
      expect(sum).to.equal('[[1,1],[2,2]]');
    });

    it('splodes the resulting sum', () => {
      const sum = snailSum('[[[[1,1],[2,2]],[3,3]],[4,4]]', '[5,5]');
      expect(sum).to.equal('[[[[3,0],[5,3]],[4,4]],[5,5]]');
    });

    it('splits the resulting sum after sploding', () => {
      const sum = snailSum('[[[[3,0],[5,3]],[4,4]],[5,5]]', '[6,6]');
      expect(sum).to.equal('[[[[5,0],[7,4]],[5,5]],[6,6]]');
    });

    it('sums complex snailfish numbers', () => {
      const sum = snailSum('[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]', '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]');
      expect(sum).to.equal('[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]');
    });

    it('sums really complex snailfish numbers', () => {
      const sum = snailSum('[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]', '[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]');
      expect(sum).to.equal('[[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]]');
    });

    it('can sum a series', () => {
      const sum = [
        '[1,1]',
        '[2,2]',
        '[3,3]',
        '[4,4]',
        '[5,5]',
        '[6,6]'
      ].reduce(snailSum);

      expect(sum).to.equal('[[[[5,0],[7,4]],[5,5]],[6,6]]');
    });

    it('can sum a complex series', () => {
      const sum = [
        '[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]',
        '[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]',
        '[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]',
        '[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]',
        '[7,[5,[[3,8],[1,4]]]]',
        '[[2,[2,2]],[8,[8,1]]]',
        '[2,9]',
        '[1,[[[9,3],9],[[9,0],[0,7]]]]',
        '[[[5,[7,4]],7],1]',
        '[[[[4,2],2],6],[8,7]]'
      ].reduce(snailSum);

      expect(sum).to.equal('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]');
    });
  });

  describe('snailMagnitude', () => {
    it('calculates the magnitude for a snailfish number', () => {
      expect(snailMagnitude('[[1,2],[[3,4],5]]')).to.equal(143);
      expect(snailMagnitude('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')).to.equal(1384);
      expect(snailMagnitude('[[[[1,1],[2,2]],[3,3]],[4,4]]')).to.equal(445);
      expect(snailMagnitude('[[[[3,0],[5,3]],[4,4]],[5,5]]')).to.equal(791);
      expect(snailMagnitude('[[[[5,0],[7,4]],[5,5]],[6,6]]')).to.equal(1137);
      expect(snailMagnitude('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')).to.equal(3488);
      expect(snailMagnitude('[[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]]')).to.equal(3993);
    });
  });
});
