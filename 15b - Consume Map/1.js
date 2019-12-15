const { Grid, AStarFinder } = require('pathfinding');

const coordsOf = (matrix, item) => {
  for (let y = 0; y < matrix.length; y++) {
    const x = matrix[y].indexOf(item);
    if (x !== -1) {
      return [x, y];
    }
  }

  return null;
};

const toWalkable = (char) => {
  switch(char) {
    case '.':
      return 0; // walkable
    case '#':
      return 1; // not walkable
    case 'O':
      return 0;
    case 'X':
      return 0;
    default:
      throw new Error(`Bad walkable char: ${char}`);
  }
};

module.exports = (inputs) => {
  const start = coordsOf(inputs, 'O');
  const end = coordsOf(inputs, 'X');
  const grid = new Grid(inputs.map(row => row.split('').map(toWalkable)));

  const finder = new AStarFinder();
  const path = finder.findPath(...start, ...end, grid);

  return path.length - 1;
};
