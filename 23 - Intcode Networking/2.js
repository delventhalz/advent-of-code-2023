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
  let natX = null;
  let natY = null;
  let lastSentY = null;

  while(true) {
    const packets = networks.map(({ recv }) => recv());
    const sent = packets.filter(packet => packet.length > 0);

    if (sent.length === 0 && natX !== null && natY !== null) {
      if (lastSentY === natY) {
        return lastSentY;
      }
      lastSentY = natY;
      console.log('Sent:', 0, natX, natY);
      networks[0].send(natX, natY);
    }

    for (const [addr, x, y] of sent) {
      console.log('Received:', addr, x, y);
      if (addr && x && y) {
        if (addr === 255) {
          natX = x;
          natY = y;
        } else {
          console.log('Sent:', addr, x, y);
          networks[addr].send(x, y);
        }
      }
    }
  }
};
