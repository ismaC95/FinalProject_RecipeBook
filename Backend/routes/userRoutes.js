/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */

const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");
const router = express.Router();

//Register user
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: chefJohn
 *               email:
 *                 type: string
 *                 example: john@email.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/register", registerUser);

//login
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@email.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

//Current user

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current logged-in user information
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/current", currentUser);

//Update user

//Delete user

module.exports = router;
