const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
const { constants } = require("../constants");

//@description get all recipes
//@route GET /api/recipes
const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ isPublic: true });
  res.status(200).json({ recipes });
});

//@description get all recipes
//@route GET /api/my-recipes
const getUserRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ owner: req.user.id });
  res.status(200).json({ recipes });
});

//@description create a recipe
//@route POST /api/recipes
//@access private
const createRecipe = asyncHandler(async (req, res) => {
  const { title, instructions, ingredients, prepTime, cookTime, difficulty } =
    req.body;
  if (
    !title ||
    !instructions ||
    !ingredients ||
    !prepTime ||
    !cookTime ||
    !difficulty
  ) {
    res.status(400).json("Missing required information");
  }
  const recipe = await Recipe.create({ ...req.body, owner: req.user.id });
  res.status(201).json(recipe);
});

//@description get a recipe
//@route GET /api/recipes/:id
//@access private
const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    "owner",
    "username",
  );
  if (!recipe) {
    res.status(constants.NOT_FOUND);
    throw new Error("Recipe not found");
  }
  res.status(200).json({ recipe });
});

//@description update a recipe
//@route PUT /api/recipes/:id
//@access private
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(constants.NOT_FOUND);
    throw new Error("Recipe not found");
  }

  if (recipe.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("No permission to update other user's recipe");
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
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(constants.NOT_FOUND);
    throw new Error("Recipe not found");
  }
  if (recipe.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error("No permission to delete other user's recipe");
  }

  await recipe.deleteOne({ _id: req.params.id });
  res.status(204).json({ recipe });
});

module.exports = {
  getRecipes,
  getUserRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
