// --- Part Two ---

// Packets sent to address 255 are handled by a device called a NAT (Not Always
// Transmitting). The NAT is responsible for managing power consumption of the
// network by blocking certain packets and watching for idle periods in the
// computers.

// If a packet would be sent to address 255, the NAT receives it instead. The
// NAT remembers only the last packet it receives; that is, the data in each
// packet it receives overwrites the NAT's packet memory with the new packet's
// X and Y values.

// The NAT also monitors all computers on the network. If all computers have
// empty incoming packet queues and are continuously trying to receive packets
// without sending packets, the network is considered idle.

// Once the network is idle, the NAT sends only the last packet it received to
// address 0; this will cause the computers on the network to resume activity.
// In this way, the NAT can throttle power consumption of the network when the
// ship needs power in other areas.

// Monitor packets released to the computer at address 0 by the NAT. What is
// the first Y value delivered by the NAT to the computer at address 0 twice in
// a row?

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


// Your puzzle answer was 14327.
