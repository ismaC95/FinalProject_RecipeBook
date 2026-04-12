const asyncHandler = require("express-async-handler");
const Recipe = require("../models/recipeModel");
const { constants } = require("../constants");

//@description get all recipes
//@route GET /api/recipes

//all keywords with $ come from MongoDB comparison queries predicate
const getRecipes = asyncHandler(async (req, res) => {
  const {
    search,
    difficulty,
    maxTime,
    minIngredients,
    maxIngredients,
    page = 1, //defaults to page 1 if not provided
    limit = 12, //12 items per page
  } = req.query;

  // Only public recipes
  const filter = { isPublic: true };

  // search in title, instructions and ingredient names
  //$or means match any of these conditions
  //$regex is a pattern match, $options: 'i' means it is case-insensitive
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { instructions: { $regex: search, $options: "i" } },
      { "ingredients.name": { $regex: search, $options: "i" } },
    ];
  }

  // difficulty filter, exact match
  if (difficulty) {
    filter.difficulty = difficulty;
  }

  const exprConditions = [];
  // total time filter (prepTime + cookTime)
  //$lte checks if <= / $add sums both preptime and cooktime
  if (maxTime) {
    exprConditions.push({
      $lte: [{ $add: ["$prepTime", "$cookTime"] }, Number(maxTime)],
    });
  }
  // number of ingredients filter
  //$gte is >=
  if (minIngredients) {
    exprConditions.push({
      $gte: [{ $size: "$ingredients" }, Number(minIngredients)],
    });
  }
  if (maxIngredients) {
    exprConditions.push({
      $lte: [{ $size: "$ingredients" }, Number(maxIngredients)],
    });
  }
  //this part allow both ingredients and total time filters to work together
  if (exprConditions.length > 0) {
    filter.$expr =
      exprConditions.length === 1
        ? exprConditions[0]
        : { $and: exprConditions };
  }

  //when on page 1, the system skips 0 recipes, on page 12 it skips 12 recipes
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Recipe.countDocuments(filter);
  const recipes = await Recipe.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({
    recipes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});

//@description get all recipes
//@route GET /api/my-recipes
const getUserRecipes = asyncHandler(async (req, res) => {
  const {
    search,
    difficulty,
    maxTime,
    minIngredients,
    maxIngredients,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { owner: req.user.id };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { instructions: { $regex: search, $options: "i" } },
      { "ingredients.name": { $regex: search, $options: "i" } },
    ];
  }

  if (difficulty) filter.difficulty = difficulty;

  const exprConditions = [];
  if (maxTime)
    exprConditions.push({
      $lte: [{ $add: ["$prepTime", "$cookTime"] }, Number(maxTime)],
    });
  if (minIngredients)
    exprConditions.push({
      $gte: [{ $size: "$ingredients" }, Number(minIngredients)],
    });
  if (maxIngredients)
    exprConditions.push({
      $lte: [{ $size: "$ingredients" }, Number(maxIngredients)],
    });
  if (exprConditions.length > 0) {
    filter.$expr =
      exprConditions.length === 1
        ? exprConditions[0]
        : { $and: exprConditions };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Recipe.countDocuments(filter);
  const recipes = await Recipe.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({
    recipes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
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
