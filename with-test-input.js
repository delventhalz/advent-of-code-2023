const {
  getSolutionPath,
  parseInputs
} = require('./index.js');


const main = () => {
  const solution = require(getSolutionPath());
  const testInputs = process.argv.slice(3);

  for (const inputs of testInputs) {
    console.log(solution(parseInputs(inputs + '\n')));
  }
};


if (require.main === module) {
  main();
}


module.exports = {};
