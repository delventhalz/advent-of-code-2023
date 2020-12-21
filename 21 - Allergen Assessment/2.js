// --- Part Two ---

// Now that you've isolated the inert ingredients, you should have enough
// information to figure out which ingredient contains which allergen.

// In the above example:

// - mxmxvkd contains dairy.
// - sqjhc contains fish.
// - fvjkl contains soy.

// Arrange the ingredients alphabetically by their allergen and separate them
// by commas to produce your canonical dangerous ingredient list. (There should
// not be any spaces in your canonical dangerous ingredient list.) In the above
// example, this would be mxmxvkd,sqjhc,fvjkl.

// Time to stock your raft with supplies. What is your canonical dangerous
// ingredient list?

const { intersection } = require('lodash');


const parseRecipe = (recipe) => {
  const [_, ingredients, allergens] = recipe.match(/(.+?) \(contains (.+?)\)/);
  return [ingredients.split(' '), allergens.split(', ')];
};

const getPossibleAllergens = (recipes) => {
  const possibilities = {};

  for (const [ingredients, allergens] of recipes) {
    for (const allergen of allergens) {
      const prevCandidates = possibilities[allergen];
      possibilities[allergen] = prevCandidates
        ? intersection(prevCandidates, ingredients)
        : ingredients;
    }
  }

  return possibilities;
};


const findAllergens = (possibilities, allergens = {}) => {
  const found = new Set();

  for (const [allergen, ingredients] of possibilities) {
    if (ingredients.length === 1) {
      allergens[allergen] = ingredients[0];
      found.add(ingredients[0]);
    }
  }

  const nextPossibilities = possibilities
    .map(([allergen, ingredients]) => [
      allergen,
      ingredients.filter(ingredient => !found.has(ingredient))
    ]);

  const isAllFound = nextPossibilities
    .every(([_, ingredients]) => ingredients.length === 0);

  if (isAllFound) {
    return allergens;
  }

  return findAllergens(nextPossibilities, allergens);
};


module.exports = (_, rawInput) => {
  const recipes = rawInput.split('\n').map(parseRecipe);
  const possibilities = Object.entries(getPossibleAllergens(recipes));

  const allergens = Object.entries(findAllergens(possibilities));

  return allergens
    .sort(([a], [b]) => a > b ? 1 : -1)
    .map(([_, ingredient]) => ingredient)
    .join(',');
};

// Your puzzle answer was thvm,jmdg,qrsczjv,hlmvqh,zmb,mrfxh,ckqq,zrgzf.
