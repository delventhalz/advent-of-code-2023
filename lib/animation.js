/**
 * Repeatedly runs the passed frameFn at the specified frame duration,
 * until the function returns a falsey value. Loops asynchronously unless
 * passed no frame duration or a frame duration of 0. In that case, the loop
 * will be synchronous and continuous.
 *
 * @param {function} frameFn - called each frame, return falsey value to stop
 * @param {number} [frameDuration] - duration in milliseconds of each frame
 */
export const loop = (frameFn, frameDuration = null) => {
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

/**
 * Clears the console and then prints a passed string to the console in place.
 * Since each print happens on a blank screen, similar print outs with slight
 * variations will appear to animate over time.
 *
 * Optionally accepts headers to print at the top of the screen.
 *
 * @param {function} screen - a string to print
 * @param {Array} [...headers] - optional headers to prepend to screen
 */
export const print = (screen, ...headers) => {
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

/**
 * A promisified version of setTimeout. Returns a Promise which resolves
 * after the specified duration.
 *
 * @param {number} duration - the duration in milliseconds to wait for
 * @returns {Promise} the Promise to await
 */
export const wait = (duration) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, duration);
});
