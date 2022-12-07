'use strict';

// --- Part Two ---

const STORAGE = 70000000;
const UPDATE = 30000000;

const getDirSizes = (name, dir) => {
  let size = 0;
  const childSizes = [];

  for (const [name, file] of Object.entries(dir)) {
    if (name !== '..') {
      if (typeof file === 'number') {
        size += file;
      } else {
        const nestedSizes = getDirSizes(name, file);
        size += nestedSizes[0][1];
        childSizes.push(...nestedSizes);
      }
    }
  }

  return [[name, size], ...childSizes];
}


module.exports = (inputs) => {
  const root = {};
  let curr = root;

  for (const input of inputs) {
    if (input === '$ cd /') {
      curr = root;
    } else if (input === '$ cd ..') {
      curr = curr['..'];
    } else if (input.startsWith('$ cd ')) {
      const dirname = input.slice(5);
      curr = curr[dirname];
    } else if (input === '$ ls') {
      // Nothing to do
    } else if (input.startsWith('dir ')) {
      const dirname = input.slice(4);
      if (!curr[dirname]) {
        curr[dirname] = { '..': curr };
      }
    } else {
      const [size, filename] = input.split(' ');
      if (!curr[filename]) {
        curr[filename] = Number(size);
      } else if (curr[filename] !== Number(size)) {
        throw new Error('Bad input:', input);
      }
    }
  }

  const dirSizes = getDirSizes('/', root).sort(([_, a], [__, b]) => b - a);
  const free = STORAGE - dirSizes[0][1];
  const needed = UPDATE - free;

  return dirSizes.slice().reverse().find(([_, size]) => size >= needed)[1];
};
