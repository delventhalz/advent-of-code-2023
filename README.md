# Advent of Code 2021 Solutions and Runner

Merry [Advent of Code](https://adventofcode.com/2021) to those who celebrate!

This is a fork of my
[2020 AoC Runner](https://github.com/delventhalz/advent-of-code-2020), without
last year's solutions. I expect it to evolve and change over the month.

## Contents

- [Setup](#setup)
- [Usage](#usage)
    * [Generate Stub Files](#1-generate-stub-files)
    * [Complete Your Solution](#2-complete-your-solution)
    * [Run Your Solution](#3-run-your-solution)
    * [Test Your Solution](#4-optional-test-your-solution)
    * [Linting](#linting)
- [Solutions](#solutions)
- [Helper Utils](#helper-utils)
- [Leaderboard](#leaderboard)
- [License](#license)

## Setup

Ensure you have a recent version of [Node.js](https://nodejs.org/en/)
installed, then run in your terminal:

```bash
git clone https://github.com/delventhalz/advent-of-code-2021.git
cd advent-of-code-2021/
npm install
```

## Usage

### 1. Generate Stub Files

Begin your solution by first generating stub files:

```bash
npm run generate <directory name>
```

This will create a new directory with three files:

- `1.js`
- `2.js`
- `input.txt`

### 2. Complete Your Solution

Each solution file should export a single function which takes parsed puzzle
inputs and returns a solution to log to the console.

Puzzle inputs should be copied and pasted into `input.txt`. The runner will
read these inputs, parse them, and pass them to the exported solution
functions.

Lodash and a few custom utilities are available as CommonJS modules. Import
with `require`:

```javascript
const { chunk } = require('lodash');
```

Of course new modules can be installed with NPM:

```bash
npm install <module name>
```

### 3. Run Your Solution

Once the solution file is complete, and the input string is in `input.txt`,
running your solution can be done with the `npm start` command, with the path
to the solution file provided as the single argument:

```bash
npm start <path to solution file>
```

### 4. (Optional) Test Your Solution

Advent of Code often provides shortened example inputs which can be useful to
debug failing solutions. These can be substituted for the inputs at `input.txt`
directly from the command line using the `npm test` command. In addition to the
path to the solution file, provide one or more example input strings as further
arguments:

```bash
npm test <path to solution file> "<example input 1>" "<example input 2>"
```

### Linting

A basic linter is included to catch stupid errors. It will automatically check
all files before running your solution, though errors will _not_ stop the run.
To run the linter manually:

```bash
npm run lint
```

## Solutions

Any solutions of mine will be in numbered directories, and should run correctly
with the tools above. Reference or run them as you will.

## Helper Utils

For the most part I just copied and pasted the code I reused. But if a
particular function was repeatedly useful across multiple nights, I pulled it
out into a module, and put that module in the [lib/ directory](./lib/). These
can be imported by using `require` on the lib directory:

```javascript
const { sum } = require('../lib');

const nums = [1, 2, 3];
console.log(sum(nums));  // 6
```

## Leaderboard

In past years I have competed on [caderek's](https://github.com/caderek)
leaderboard. Assuming it is still active, I will stay on it this year as well,
and you can join yourself with this code:

```
107172-b51ab08f
```

I am also using my own leaderboard with a few friends, which you can join with
this code:

```
472347-2b04474b
```

## License

[Advent of Code](https://adventofcode.com/2020/about) and all Advent of Code
2021 puzzle text and content were created by and belong to
[Eric Wastl](http://was.tl/), and are reproduced here for reference purposes
only.

All solution code and associated tools were written by me, Zac Delventhal,
and are made available under the [MIT](./LICENSE) open source license.
