/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management
 */

const express = require("express");
const router = express.Router();
const {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of recipes
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - instructions
 *               - ingredients
 *               - prepTime
 *               - cookTime
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *                 example: Spaghetti Bolognese
 *               instructions:
 *                 type: string
 *                 example: Cook pasta. Prepare sauce. Mix together.
 *               ingredients:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: tomato
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     unit:
 *                       type: string
 *                       example: cups
 *               prepTime:
 *                 type: number
 *                 minimum: 0
 *                 example: 15
 *               cookTime:
 *                 type: number
 *                 minimum: 0
 *                 example: 30
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *                 example: Medium
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.route("/").get(getRecipes).post(createRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe found
 *       404:
 *         description: Recipe not found
 *   put:
 *     summary: Update an existing recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID
 *         schema:
 *           type: string
 *           example: 665c9e2f1b2a4d6f12345678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - instructions
 *               - ingredients
 *               - prepTime
 *               - cookTime
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Spaghetti Bolognese
 *               instructions:
 *                 type: string
 *                 example: Cook pasta, prepare sauce, combine and serve.
 *               ingredients:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: tomato
 *                     quantity:
 *                       type: number
 *                       example: 3
 *                     unit:
 *                       type: string
 *                       example: cups
 *               prepTime:
 *                 type: number
 *                 minimum: 0
 *                 example: 20
 *               cookTime:
 *                 type: number
 *                 minimum: 0
 *                 example: 35
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *                 example: Medium
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/updated-image.jpg
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Recipe deleted
 */

router.route("/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;
