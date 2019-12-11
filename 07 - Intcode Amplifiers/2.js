// --- Part Two ---

// It's no good - in this configuration, the amplifiers can't generate a large
// enough output signal to produce the thrust you'll need. The Elves quickly
// talk you through rewiring the amplifiers into a feedback loop:

//           O-------O  O-------O  O-------O  O-------O  O-------O
//     0 -+->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-.
//        |  O-------O  O-------O  O-------O  O-------O  O-------O |
//        |                                                        |
//        '--------------------------------------------------------+
//                                                                 |
//                                                                 v
//                                                          (to thrusters)

// Most of the amplifiers are connected as they were before; amplifier A's
// output is connected to amplifier B's input, and so on. However, the output
// from amplifier E is now connected into amplifier A's input. This creates the
// feedback loop: the signal will be sent through the amplifiers many times.

// In feedback loop mode, the amplifiers need totally different phase settings:
// integers from 5 to 9, again each used exactly once. These settings will
// cause the Amplifier Controller Software to repeatedly take input and produce
// output many times before halting. Provide each amplifier its phase setting
// at its first input instruction; all further input/output instructions are
// for signals.

// Don't restart the Amplifier Controller Software on any amplifier during this
// process. Each one should continue receiving and sending signals until it
// halts.

// All signals sent or received in this process will be between pairs of
// amplifiers except the very first signal and the very last signal. To start
// the process, a 0 signal is sent to amplifier A's input exactly once.

// Eventually, the software on the amplifiers will halt after they have
// processed the final loop. When this happens, the last output signal from
// amplifier E is sent to the thrusters. Your job is to find the largest output
// signal that can be sent to the thrusters using the new phase settings and
// feedback loop arrangement.

// Here are some example programs:

// - Max thruster signal 139629729 (from phase setting sequence 9,8,7,6,5):
//   3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
// - Max thruster signal 18216 (from phase setting sequence 9,7,8,5,6):
//   3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10

// Try every combination of the new phase settings on the amplifier feedback
// loop. What is the highest signal that can be sent to the thrusters?


const { getRunner } = require('../intcode.js');
const { greatest } = require('../math.js');


const loopAmplifiers = (program, a, b, c, d, e) => {
  const runA = getRunner(program, { pauseOnOutput: true, quietIO: true });
  const runB = getRunner(program, { pauseOnOutput: true, quietIO: true });
  const runC = getRunner(program, { pauseOnOutput: true, quietIO: true });
  const runD = getRunner(program, { pauseOnOutput: true, quietIO: true });
  const runE = getRunner(program, { pauseOnOutput: true, quietIO: true });

  let loopOutput = runE(e, runD(d, runC(c, runB(b, runA(a, 0)))));
  let lastLoopOutput;

  while (loopOutput !== null) {
    lastLoopOutput = loopOutput;
    loopOutput = runE(runD(runC(runB(runA(loopOutput)))));
  }

  return lastLoopOutput;
};

module.exports = (inputs) => {
  const outputs = [];

  for (let i = 5; i < 10; i++) {
    for (let j = 5; j < 10; j++) {
      if (j === i) continue;

      for (let k = 5; k < 10; k++) {
        if (k === i || k === j) continue;

        for (let l = 5; l < 10; l++) {
          if (l === k || l === j || l === i) continue;

          for (let m = 5; m < 10; m++) {
            if (m === l || m === k || m === j || m === i) continue;
            outputs.push(loopAmplifiers(inputs, i, j, k, l, m));
          }
        }
      }
    }
  }

  return greatest(outputs);
};


// Your puzzle answer was 58285150.

