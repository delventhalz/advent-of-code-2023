# Advent of Code 2019 Solutions and Runner

Been having a lot of fun with [Advent of Code](https://adventofcode.com/2019)
this year. In addition to solutions, I have written some Node.js CLI tools to
help run and debug my work. Both the solution code and CLI tools are
included in this repo. Mostly for myself, but also for anyone who wishes to
reference or utilize them.

## Contents

- [Setup](#setup)
- [Usage](#usage)
    * [Generate Stub Files](#1-generate-stub-files)
    * [Complete Your Solution](#2-complete-your-solution)
    * [Run Your Solution](#3-run-your-solution)
    * [Test Your Solution](#4-optional-test-your-solution)
    * [Linting](#linting)
- [Solutions](#solutions)
    * [Intcode](#intcode)
        + [API](#api)
        + [Examples](#examples)
- [Leaderboard](#leaderboard)
- [License](#license)

## Setup

Ensure you have a recent version of [Node.js](https://nodejs.org/en/)
installed, then run in your terminal:

```bash
git clone https://github.com/delventhalz/AdventOfCode2019.git
cd AdventOfCode2019/
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

Lodash, an Intcode runner, and a few other utilities are available as CommonJS
modules. Import with `require`:

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

All of my solutions are in numbered directories, and should run correctly with
the tools above.

### Intcode

A repeated feature of this year's Advent of Code is an assembly-style
instruction interpreter called "Intcode". After the first few nights, I
abstracted mine into a top-level module located at `intcode.js`. If you wish to
use it, first import the `getRunner` function into your solution file:

```javascript
const { getRunner } = require('../intcode.js');
```

#### API

- **`getRunner(program, [options])`**
    * `program`: An array of numbers, the Intcode program
    * `options`: Options object to toggle certain modes, all default to false
        + _pauseOnOutput_ - each `run` call outputs a single value and pauses
        + _pauseOnInput_ - pauses whenever it runs out of inputs
        + _quietIO_ - turns off logging for input and output events
        + _debugMode_ - turns on logging for every single opcode
    * _**returns** a run function_
- **`run(...inputs)`** _(default mode)_
    * `inputs`: one or more numbers can be provided as inputs
    * _**returns** an array of output values upon reaching a terminate opcode_
- **`run(...inputs)`** _(pauseOnOutput mode)_
    * `inputs`: one or more numbers can be provided as inputs
    * _**returns** a single output value upon reaching an output opcode_
    * _**returns** `null` upon reaching a terminate opcode_
    * Can be run repeatedly with new inputs
- **`run(...inputs)`** _(pauseOnInput mode)_
    * `inputs`: one or more numbers can be provided as inputs
    * _**returns** an array of output values, with `null` in the final position
      if a terminate opcode has been reached_
    * Can be run repeatedly with new inputs

#### Examples

```javascript
const run = getRunner(program);

const outputs = run(0, 1);
```

```javascript
const run = getRunner(program, { pauseOnOutput: true, quietIO: true });

let output = run(0, 1);

while (output !== null) {
  output = run(output);
}
```

## Leaderboard

Join me on [caderek's](https://github.com/caderek) leaderboard with this code:

```
107172-b51ab08f
```

## License

[Advent of Code](https://adventofcode.com/2019/about) and all Advent of Code
2019 puzzle text and content were created by and belong to
[Eric Wastl](http://was.tl/), and are reproduced here for reference purposes
only.

All solution code and associated tools were written by me, Zac Delventhal,
and are made available under the [MIT](./LICENSE) open source license.
