// --- Part Two ---

// After collecting ORE for a while, you check your cargo hold: 1 trillion
// (1000000000000) units of ORE.

// With that much ore, given the examples above:

// - The 13312 ORE-per-FUEL example could produce 82892753 FUEL.
// - The 180697 ORE-per-FUEL example could produce 5586022 FUEL.
// - The 2210736 ORE-per-FUEL example could produce 460664 FUEL.

// Given 1 trillion ORE, what is the maximum amount of FUEL you can produce?


const parseIngredient = (ingredient) => {
  const [needed, name] = ingredient.trim().split(' ');
  return { name, needed: Number(needed) };
};

const gatherIngredients = (recipes, name, needed, state = { needs: {}, extras: {} }) => {
  if (needed === 0) {
    return state.needs;
  }
  if (!recipes[name]) {
    state.needs[name] = (state.needs[name] || 0) + needed;
    return state.needs;
  }

  const { extras } = state;
  const { yields, inputs } = recipes[name];
  const batches = Math.ceil(needed / yields);

  for (const input of inputs) {
    const inputName = input.name;
    let inputNeeded = input.needed * batches;
    const inputExtras = extras[inputName]

    if (inputExtras) {
      if (inputExtras >= inputNeeded) {
        extras[inputName] -= inputNeeded
        inputNeeded = 0;
      } else {
        inputNeeded -= inputExtras;
        extras[inputName] = 0;
      }
    }

    gatherIngredients(recipes, inputName, inputNeeded, state);
  }

  extras[name] = (extras[name] || 0) + batches * yields - needed;
  return state.needs;
}


module.exports = (programInputs) => {
  const recipes = Object.fromEntries(
    programInputs
      .map(row => Array.isArray(row) ? row.join(',') : row)
      .map(row => row.split('=>'))
      .map(([inputs, output]) => [
        inputs.split(',').map(parseIngredient),
        parseIngredient(output)
      ])
      .map(([inputs, { name, needed }]) => [name, { yields: needed, inputs }])
  );

  let fuel = 7863304;
  let { ORE } = gatherIngredients(recipes, 'FUEL', fuel);
  while (ORE < 1000000000000) {
    fuel += 1;
    ({ ORE } = gatherIngredients(recipes, 'FUEL', fuel));
  }

  return fuel - 1;
};


// Your puzzle answer was 7863863.
