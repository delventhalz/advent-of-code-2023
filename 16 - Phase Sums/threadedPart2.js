// --- Day 16 ---

const { Worker } = require('worker_threads');
const { range } = require('lodash');
const { loop, print, wait } = require('../lib/animation.js');

const PHASE_COUNT = 100;
const THREAD_COUNT = 8;
const PRINT_FREQUENCY = 100;

const dispatch = (digits, start, stop) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./16/worker.js', {
      workerData: { digits, start, stop }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code: ${code}`));
      }
    });
  });
}

const getMessage = (digits, offset = 0) => (
  Number(digits.slice(offset, offset + 8).join(''))
);


module.exports = async (inputs) => {
  // let digits = inputs.split('').map(Number);
  // const offset = 0;

  const initialDigits = inputs.split('').map(Number);
  const offset = Number(initialDigits.slice(0, 7).join(''));
  let digits = range(10000).flatMap(() => initialDigits);

  let times = 0;

  // Print status
  loop(() => {
    const indicators = ['|', '/', '-', '\\'];
    const indicator = indicators[Math.floor(Date.now() / PRINT_FREQUENCY) % 4];

    print(`${indicator} : ${times} : ${getMessage(digits, offset)}`);
    return times < PHASE_COUNT;
  }, PRINT_FREQUENCY);

  // Run
  while (times < PHASE_COUNT) {
    const responses = await Promise.all(range(THREAD_COUNT).map((i) => {
      const start = Math.floor(i * digits.length / THREAD_COUNT) + 1;
      const stop = Math.floor((i + 1) * digits.length / THREAD_COUNT) + 1;
      return dispatch(digits, start, stop);
    }));

    digits = responses.flat();
    // eslint-disable-next-line require-atomic-updates
    times += 1;
  }

  // Wait for print-loop to terminate before returning
  await wait(PRINT_FREQUENCY * 2);
  return getMessage(digits, offset);
};
