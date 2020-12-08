// --- Part Two ---

// After some careful analysis, you believe that exactly one instruction is
// corrupted.

// Somewhere in the program, either a jmp is supposed to be a nop, or a nop is
// supposed to be a jmp. (No acc instructions were harmed in the corruption of
// this boot code.)

// The program is supposed to terminate by attempting to execute an instruction
// immediately after the last instruction in the file. By changing exactly one
// jmp or nop, you can repair the boot code and make it terminate correctly.

// For example, consider the same program from above:

//     nop +0
//     acc +1
//     jmp +4
//     acc +3
//     jmp -3
//     acc -99
//     acc +1
//     jmp -4
//     acc +6

// If you change the first instruction from nop +0 to jmp +0, it would create a
// single-instruction infinite loop, never leaving that instruction. If you
// change almost any of the jmp instructions, the program will still eventually
// find another jmp instruction and loop forever.

// However, if you change the second-to-last instruction (from jmp -4 to nop
// -4), the program terminates! The instructions are visited in this order:

//     nop +0  | 1
//     acc +1  | 2
//     jmp +4  | 3
//     acc +3  |
//     jmp -3  |
//     acc -99 |
//     acc +1  | 4
//     nop -4  | 5
//     acc +6  | 6

// After the last instruction (acc +6), the program terminates by attempting to
// run the instruction below the last instruction in the file. With this
// change, after the program terminates, the accumulator contains the value 8
// (acc +1, acc +1, acc +6).

// Fix the program so that it terminates normally by changing exactly one jmp
// (to nop) or nop (to jmp). What is the value of the accumulator after the
// program terminates?

const run = (ops) => {
  const seen = new Set();
  let acc = 0;
  let i = 0;

  while (true) {
    // Return null on repeat, accumulator on complete
    if (seen.has(i)) {
      return null;
    }

    if (i >= ops.length) {
      return acc;
    }

    const [op, val] = ops[i];
    seen.add(i);

    if (op === 'acc') {
      acc += val;
    }

    if (op === 'jmp') {
      i += val;
    } else {
      i += 1;
    }
  }
};


module.exports = (inputs) => {
  const ops = inputs
    .map(line => line.split(' '))
    .map(([op, val]) => [op, Number(val)]);

  for (let i = 0; i < ops.length; i += 1) {
    const [op] = ops[i];

    if (op === 'nop') {
      ops[i][0] = 'jmp';
      const result = run(ops);

      if (result !== null) {
        return result;
      }

      ops[i][0] = 'nop';
    }

    if (op === 'jmp') {
      ops[i][0] = 'nop';
      const result = run(ops);

      if (result !== null) {
        return result;
      }

      ops[i][0] = 'jmp';
    }
  }
};

// Your puzzle answer was 1877.

