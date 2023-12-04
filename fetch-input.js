import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { dateToTz } from './lib/dates.js';

const { AOC_COOKIE, AOC_REPO, AOC_CONTACT } = process.env;
if (!AOC_COOKIE || !AOC_REPO || !AOC_CONTACT) {
  throw new Error('Must set env variables: AOC_COOKIE, AOC_REPO, AOC_CONTACT');
}

const relPath = process.argv[2] || 'stub/input.txt';
const absPath = resolve(process.cwd(), relPath);

const getInputUrl  = () => {
  const now = dateToTz('America/New_York');
  const isDecember = now.month === 12;

  const day = isDecember ? Math.min(25, now.day) : 25;
  const year = isDecember ? now.year : now.year - 1;

  return `https://adventofcode.com/${year}/day/${day}/input`;
};

const response = await fetch(getInputUrl(), {
  method: 'GET',
  headers: {
    Cookie: AOC_COOKIE,
    'User-Agent': `${AOC_REPO} by ${AOC_CONTACT}`
  }
});

const input = await response.text();
writeFile(absPath, input, { flag:'w' });
