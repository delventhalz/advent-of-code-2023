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

const parseRecipes = (recipeStrings) => Object.fromEntries(
  recipeStrings
    .map(row => row.split('=>'))
    .map(([inputs, output]) => [
      inputs.split(',').map(parseIngredient),
      parseIngredient(output)
    ])
    .map(([inputs, { name, needed }]) => [name, { yields: needed, inputs }])
);

const tallyProducts = (name, needed, recipes, inventory = {}) => {
  if (needed === 0) {
    return inventory;
  }
  if (!recipes[name]) {
    inventory[name] = (inventory[name] || 0) - needed;
    return inventory;
  }

  const { yields, inputs } = recipes[name];
  const batches = Math.ceil(needed / yields);

  for (const input of inputs) {
    const inputName = input.name;
    let inputNeeded = input.needed * batches;
    const inputExtras = inventory[inputName];

    if (inputExtras > 0) {
      if (inputExtras >= inputNeeded) {
        inventory[inputName] -= inputNeeded;
        inputNeeded = 0;
      } else {
        inputNeeded -= inputExtras;
        inventory[inputName] = 0;
      }
    }

    tallyProducts(inputName, inputNeeded, recipes, inventory);
  }

  inventory[name] = (inventory[name] || 0) + batches * yields - needed;
  return inventory;
};


module.exports = (inputs) => {
  const recipes = parseRecipes(
    inputs.map(row => Array.isArray(row) ? row.join(',') : row)
  );

  let fuel = 1;
  let { ORE } = tallyProducts('FUEL', fuel, recipes);

  while (ORE > -1000000000000) {
    fuel *= 2;
    ({ ORE } = tallyProducts('FUEL', fuel, recipes));
  }

  fuel /= 2;
  ({ ORE } = tallyProducts('FUEL', fuel, recipes));

  while (ORE > -1000000000000) {
    fuel += 1000;
    ({ ORE } = tallyProducts('FUEL', fuel, recipes));
  }

  fuel -= 1000;
  ({ ORE } = tallyProducts('FUEL', fuel, recipes));

  while (ORE > -1000000000000) {
    fuel += 1;
    ({ ORE } = tallyProducts('FUEL', fuel, recipes));
  }

  return fuel - 1;
};


// Your puzzle answer was 7863863.
