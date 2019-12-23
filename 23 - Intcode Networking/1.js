// --- Day 23 ---

const { range } = require('lodash');
const { getRunner } = require('../lib/intcode.js');


const getNetworkLayer = (runner) => {
  let outputQueue = [];

  return {
    send: (...inputs) => {
      outputQueue.push(...runner(...inputs));
    },
    recv: () => {
      outputQueue.push(...runner(-1));

      if (outputQueue.length < 3) {
        return [];
      }

      const received = outputQueue.slice(0, 3);
      outputQueue = outputQueue.slice(3);
      return received;
    }
  };
};

module.exports = (inputs) => {
  const networks = range(50)
    .map(() => getRunner(inputs, { pauseOnInput: true, quietIO: true }))
    .map(getNetworkLayer);

  networks.forEach(({ send }, i) => send(i));

  while(true) {
    const packets = networks.map(({ recv }) => recv());
    for (const [addr, x, y] of packets) {
      if (addr && x && y) {
        if (addr === 255) {
          return y;
        }
        networks[addr].send(x, y);
      }
    }
  }
};
