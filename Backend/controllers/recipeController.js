const asyncHandler = require("express-async-handler");

//@description get all recipes
//@route GET /api/recipes
//@access public
const getRecipes = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get all recipes" });
});

//@description create a recipe
//@route POST /api/recipes
//@access public
const createRecipe = asyncHandler(async (req, res) => {
  console.log("The request body is:", req.body);
  const { title, ingredient, cookingTime } = req.body;
  if (!title || !ingredient || !cookingTime) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  res.status(201).json({ message: "Create recipe" });
});

//@description get a recipe
//@route GET /api/recipes/:id
//@access public
const getRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Get recipe with id ${req.params.id}` });
});

//@description update a recipe
//@route PUT /api/recipes/:id
//@access public
const updateRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update recipe with id ${req.params.id}` });
});

//@description delete a recipe
//@route DELETE /api/recipes/:id
//@access public
const deleteRecipe = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete recipe with id ${req.params.id}` });
});

module.exports = {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
