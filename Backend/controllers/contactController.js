//@description get all recipes
//@route GET /api/recipes
//@access public
const getRecipes = (req, res) => {
  res.status(200).json({ message: "Get all recipes" });
};

//@description create a recipe
//@route POST /api/recipes
//@access public
const createRecipe = (req, res) => {
  res.status(201).json({ message: "Create recipe" });
};

//@description get a recipe
//@route GET /api/recipes/:id
//@access public
const getRecipe = (req, res) => {
  res.status(200).json({ message: `Get recipe with id ${req.params.id}` });
};

//@description update a recipe
//@route PUT /api/recipes/:id
//@access public
const updateRecipe = (req, res) => {
  res.status(200).json({ message: `Update recipe with id ${req.params.id}` });
};

//@description delete a recipe
//@route DELETE /api/recipes
//@access public
const deleteRecipe = (req, res) => {
  res.status(200).json({ message: `Delete recipe with id ${req.params.id}` });
};

module.exports = {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
