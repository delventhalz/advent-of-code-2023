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
    * [Fetch Variables](#fetch-variables)
- [Usage](#usage)
    * [Automated Runner](#automated-runner)
    * [Generate Stub Files](#1-generate-stub-files)
    * [Fetch Puzzle Input](#2-fetch-puzzle-input)
    * [Write Your Solution](#3-write-your-solution)
    * [Run Your Solution](#4-run-your-solution)
    * [Submit Your Answer](#5-submit-your-answer)
    * [Linting](#linting)
    * [Unit Tests](#unit-tests)
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

### Fetch Variables

In order to use any of the automatic fetching tools, go to your `.bash_profile`
or `.zshrc` and export the following three environment variables:

```bash
export AOC_COOKIE="<copy 'Cookie' request header from adventofcode.com in dev tools>"
export AOC_REPO="<URL of repo where fetch-input.js is hosted>"
export AOC_CONTACT="<your email address>"
```

## Usage

### Automated Runner

There is an [automated runner](./go), written in bash which will string together
the following commands and run your whole solve. To use it for today's problem,
just run it:

```bash
./go
```

Note, if used after 11pm EST, the runner will wait for tonight's problem to
start rather than running today's.

To use the runner with a different year and day, specify them as command line args:

```bash
./go 2023 5
```

### 1. Generate Stub Files

Begin your solution by first generating stub files:

```bash
npm run generate
```

This will create a new directory with three files:

- `1.js`
- `2.js`
- `input.txt`

By default, the directory will be named "wip" and be gitignored. The default
can be overridden with a command line arg.

```bash
npm run generate <directory name>
```

The headers in the JavaScript files will be populated with references to the day
and year of the upcoming Advent of Code problem (i.e. tomorrow). You may want to
manually adjust if that isn't valid for the problem you are working on.

### 2. Fetch Puzzle Input

Although it is easy enough to copy and paste puzzle input from the web into the
`input.txt` file, if you want to do it in the command line, you can do that as
well.

```bash
npm run fetch
```

This will fetch your most recent puzzle input and save it to `wip/input.txt`,
overwriting any existing text there.

If you would like to specify a different file path, you can do so with a command
line argument, just beware that any existing files at that path will be
overwritten:

```bash
npm run fetch <relative file path>
```

### 3. Write Your Solution

Once your puzzle inputs are in `input.txt`. The runner will read these inputs,
parse them, and pass them to your solution files.

Each solution file should export a function as a default export.

```javascript
export default function main({ input }) {

    // Calculate solution...

    return solution;
}
```

- **Parameters**
    * **`inputMap`** - An object with different parses of the input string under
        different properties. Destructure the property you need.
        + **`input`** - Raw unparsed string version of `input.txt`.
        + **`lines`** - An array of each line from `input.txt`.
        + **`matrix`** - The `input.txt` characters broken up into a 2D array
            with each character as its own cell.
        + **`parsed`** - An attempt to cleverly parse the `input.txt` file.
            Typically an array, possibly a deeply nested array. The parser
            progressively splits the input string on any sensible delimiters
            (blank lines, new lines, commas), and then parses any numbers. If
            the input contains no sensible delimiters, this is just the raw
            string.
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

### 4. Run Your Solution

Once the solution file is complete, and the input string is in `input.txt`,
running your solution can be done with the `npm start` command, with the path
to the solution file provided as the single argument:

```bash
npm start <path to solution file>
```

### 5. Submit Your Answer

Finally, you need to submit your answer to Advent of Code. This can be done by
copying the answer from the logs and pasting it into the website, or through the command line using the `submit` script:

```bash
./submit 2023 5 1 484023871
```

When calling `submit` directly, you must specify the year, day, part (1 or 2)
and the answer to submit. The answer may also be specified using stdin:

```bash
cat answer-1.txt | ./submit 2023 5 1
```

### Linting

A basic linter is included to catch stupid errors. It will automatically check
all files before running your solution, though errors will _not_ stop the run.
To run the linter manually:

```bash
npm run lint
```

### Unit Tests

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
