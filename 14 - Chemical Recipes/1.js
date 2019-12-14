// --- Day 14 ---

const parseIngredient = (ingredient) => {
  const [needed, name] = ingredient.trim().split(' ');
  return { name, needed: Number(needed) };
};

const gatherIngredients = (recipes, name, needed, state = { needs: {}, extras: {} }) => {
  if (needed === 0) {
    return state;
  }
  if (!recipes[name]) {
    state.needs[name] = (state.needs[name] || 0) + needed;
    return state;
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
  return state;
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

  return gatherIngredients(recipes, 'FUEL', 1);
};
