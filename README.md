# Advent of Code 2023 Solutions and Runner

Merry [Advent of Code](https://adventofcode.com/2023) to those who celebrate!

This is a copy of my
[2022 AoC Runner](https://github.com/delventhalz/advent-of-code-2022), without
last year's solutions. It is mostly aimed at streamlining developing JavaScript
solutions, but I am starting to experiment with
[supporting other languages](#using-other-languages). I expect the project to
evolve and change over the month depending on my needs.

## Contents

- [Setup](#setup)
- [Usage](#usage)
    * [Generate Stub Files](#1-generate-stub-files)
    * [Write Your Solution](#2-write-your-solution)
    * [Run Your Solution](#3-run-your-solution)
    * [Test Your Solution](#4-optional-test-your-solution)
    * [Linting](#linting)
- [Solutions](#solutions)
- [Helper Utils](#helper-utils)
- [Using Other Languages](#using-other-languages)
- [Leaderboard](#leaderboard)
- [License](#license)

## Setup

Ensure you have a recent version of [Node.js](https://nodejs.org/en/)
installed, then run in your terminal:

```bash
git clone https://github.com/delventhalz/advent-of-code-2023.git
cd advent-of-code-2023/
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

### 2. Write Your Solution

Copy your puzzle inputs and paste them into `input.txt`. The runner will
read these inputs, parse them, and pass them to your solution file.

The solution file should export a function as a default export.

```javascript
export default function main(inputs, rawInput) {

    // Calculate solution...

    return solution;
}
```

- **Parameters**
    * **`inputs`** - The parsed `input.txt` file. Typically an array, possibly a
      nested array. The runner progressively splits the input string on any
      sensible delimiters (blank lines, new lines, commas), and then parses any
      numbers. If the input contains no sensible delimiters, will just be the
      raw string.
    * **`rawInput`** _(optional)_ - Always the raw unparsed string version of
      `input.txt`. Useful if the input is formatted in such a way that the
      default parser creates something erroneous or unhelpful. Usually if I
      have to use this parameter, I end up refactoring the parser the next day
      ;).
- **Returns**
    * The solution you calculated. Will be logged to the console by the runner.

Lodash and a few custom utilities are available as ES modules as well.

```javascript
import { chunk } from 'lodash-es';
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

For particularly troublesome problems,
[Mocha](https://mochajs.org/)/[Chai](https://www.chaijs.com/api/bdd/) is
available. Simply create a unit test file in your solution folder and name it
with the `.test.js` suffix.

To run all `.test.js` files:

```bash
npm test
```

To test only a single file, use the `--` option to pass the path to the test
file as a command line argument to the npm script:

```bash
npm test -- <path to test file>
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
can all be imported from [lib/index.js](./lib/index.js):

```javascript
import { sum } from '../lib/index.js';

const nums = [1, 2, 3];
console.log(sum(nums));  // 6
```

## Using Other Languages

For this year I am playing around more with languages other than JavaScript. To
that end I have created a simple [run script](./run) which can compile and run
solution files:

```bash
./run <path to solution file>
```

Currently the script supports:

- **JavaScript** - requires `node`
- **Python** - requires `python`
- **C** - requires `gcc`
- **Rust** - requires `rustc`
  ([install here](https://www.rust-lang.org/tools/install))
- **Clojure** - requires `clj`
  ([install here](https://clojure.org/guides/getting_started))

For non-JS languages, the support is very basic. There is no parsing of
`input.txt` and no logging of the solution. The source file is simply compiled
and then run.

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

"Advent of Code" and all Advent of Code related content are property of Advent
of Code and protected by copyright:

https://adventofcode.com/2023/about#legal

All solution code and associated tools were written by me, Zac Delventhal,
and are made available under the [MIT](./LICENSE) open source license.
