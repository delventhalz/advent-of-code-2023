const toOxygenMap = (char) => {
  switch(char) {
    case 'O':
      return '.';
    case 'X':
      return 'O';
    default:
      return char;
  }
};

const markSquare = (map, x, y) => {
  if (map[y] && map[y][x] === '.') {
    map[y][x] = 'X';
  }
};

const markSurrounding = (map, x, y) => {
  markSquare(map, x - 1, y);
  markSquare(map, x, y - 1);
  markSquare(map, x + 1, y);
  markSquare(map, x, y + 1);
}

const spreadOxygen = (map) => {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (map[y][x] === 'O') {
        markSurrounding(map, x, y);
      }
    }
  }

  let didSpread = false;

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (map[y][x] === 'X') {
        map[y][x] = 'O';
        didSpread = true;
      }
    }
  }

  return didSpread;
};

const animate = (frameFn, frameLength) => {
  setTimeout(() => {
    const shouldContinue = frameFn();

    if (shouldContinue) {
      animate(frameFn, frameLength);
    }
  }, frameLength);
};

const printMap = (map, minutes) => {
  const screen = map
    .map(row => row.join(''))
    .join('\n');

  console.clear();
  console.log('MINUTES:', minutes)
  console.log();
  console.log(screen);
};

module.exports = (inputs) => {
  const map = inputs.map(row => row.split('').map(toOxygenMap));
  let minutes = 0;

  animate(() => {
    const didSpread = spreadOxygen(map);
    if (!didSpread) {
      return false;
    }

    minutes += 1;
    printMap(map, minutes);

    return true;
  }, 20);

  return minutes;
};
