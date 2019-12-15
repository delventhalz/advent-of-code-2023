const loop = (frameFn, frameDuration = null) => {
  if (!frameDuration) {
    // eslint-disable-next-line no-empty
    while (frameFn()) {}
  } else {
    setTimeout(() => {
      if (frameFn()) {
        loop(frameFn, frameDuration);
      }
    }, frameDuration);
  }
};

const print = (screen, ...headers) => {
  console.clear();

  for (const header of headers) {
    if (Array.isArray(header)) {
      console.log(...header);
    } else {
      console.log(header);
    }
  }

  if (headers.length > 0) {
    console.log();
  }

  console.log(screen);
};

module.exports = {
  loop,
  print,
};
