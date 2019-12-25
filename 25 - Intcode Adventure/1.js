// --- Day 25: Cryostasis ---

// As you approach Santa's ship, your sensors report two important details:

// First, that you might be too late: the internal temperature is -40 degrees.

// Second, that one faint life signature is somewhere on the ship.

// The airlock door is locked with a code; your best option is to send in a
// small droid to investigate the situation. You attach your ship to Santa's,
// break a small hole in the hull, and let the droid run in before you seal it
// up again. Before your ship starts freezing, you detach your ship and set it
// to automatically stay within range of Santa's ship.

// This droid can follow basic instructions and report on its surroundings; you
// can communicate with it through an Intcode program (your puzzle input)
// running on an ASCII-capable computer.

// As the droid moves through its environment, it will describe what it
// encounters. When it says Command?, you can give it a single instruction
// terminated with a newline (ASCII code 10). Possible instructions are:

// - Movement via north, south, east, or west.
// - To take an item the droid sees in the environment, use the command take
//   <name of item>. For example, if the droid reports seeing a red ball, you
//   can pick it up with take red ball.
// - To drop an item the droid is carrying, use the command drop <name of
//   item>. For example, if the droid is carrying a green ball, you can drop it
//   with drop green ball.
// - To get a list of all of the items the droid is currently carrying, use the
//   command inv (for "inventory").

// Extra spaces or other characters aren't allowed - instructions must be
// provided precisely.

// Santa's ship is a Reindeer-class starship; these ships use
// pressure-sensitive floors to determine the identity of droids and crew
// members. The standard configuration for these starships is for all droids to
// weigh exactly the same amount to make them easier to detect. If you need to
// get past such a sensor, you might be able to reach the correct weight by
// carrying items from the environment.

// Look around the ship and see if you can find the password for the main
// airlock.

const readline = require('readline');
const combinatorics = require('js-combinatorics');
const { getRunner } = require('../lib/intcode.js');


const ITEMS = [
  'manifold',
  'whirled peas',
  'space heater',
  'dark matter',
  'antenna',
  'bowl of rice',
  'klein bottle',
  'spool of cat6'
];

const autopilot = () => [
  'east',
  'take manifold',
  'south',
  'take whirled peas',
  'north',
  'west',
  'south',
  'take space heater',
  'south',
  'take dark matter',
  'north',
  'east',
  'north',
  'west',
  'south',
  'take antenna',
  'north',
  'east',
  'south',
  'east',
  'take bowl of rice',
  'north',
  'take klein bottle',
  'north',
  'take spool of cat6',
  'west'
].join('\n') + '\n';

const bruteForce = () => combinatorics
  .power(ITEMS)
  .map(combo => [
    ...ITEMS.map(item => `drop ${item}`),
    ...combo.map(item => `take ${item}`),
    'north'
  ])
  .flat()
  .join('\n') + '\n';


const prompt = (message) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(message + ' ', (response) => {
    resolve(response + '\n');
    rl.close();
  });
});

const asciiToCodes = (ascii) => ascii.split('').map(char => char.charCodeAt(0));
const codesToAscii = (codes) => codes.map(code => String.fromCharCode(code)).join('');


module.exports = async (inputs) => {
  const run = getRunner(inputs, { pauseOnInput: true, quietIO: true });

  const initialOutput = run();
  console.log(codesToAscii(initialOutput));

  while (true) {
    let input = await prompt('>');

    // Note: only works from starting location
    if (input.trim() === 'autopilot') {
      input = autopilot();
      console.log(input);
    }

    // Note: only works from security checkpoint with all eight items
    if (input.trim() === 'brute force') {
      input = bruteForce();
      console.log(input);
    }

    const output = run(...asciiToCodes(input));
    console.log(codesToAscii(output));

    if (output[output.length - 1] === null) {
      break;
    }
  }
};


// Your puzzle answer was 8462464.
