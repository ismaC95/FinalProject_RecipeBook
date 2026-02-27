const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
const { constants } = require("../constants");

//@description get all recipes
//@route GET /api/recipes
//@access public
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find();
  res.status(200).json({ recipes });
});

//@description create a recipe
//@route POST /api/recipes
//@access public
const createRecipe = asyncHandler(async (req, res) => {
  console.log("The request body is:", req.body);
  const recipe = await Recipe.create(req.body);
  res.status(201).json(recipe);
});

//@description get a recipe
//@route GET /api/recipes/:id
//@access public
const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(constants.NOT_FOUND);
    throw new Error("Recipe not found");
  }
  res.status(200).json({ recipe });
});

//@description update a recipe
//@route PUT /api/recipes/:id
//@access public
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(constants.NOT_FOUND);
    throw new Error("Recipe not found");
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  res.status(200).json({ updatedRecipe });
});

//@description delete a recipe
//@route DELETE /api/recipes/:id
//@access public
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(constants.NOT_FOUND);
    throw new Error("Recipe not found");
  }
  await recipe.deleteOne();
  res.status(200).json({ recipe });
});

module.exports = {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
