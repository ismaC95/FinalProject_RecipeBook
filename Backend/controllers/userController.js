const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

//@description register user
//@route POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //User credentials unique validation
  const emailAvailable = await User.findOne({ email });
  const usernameAvailable = await User.findOne({ username });

  if (emailAvailable || usernameAvailable) {
    res.status(400);
    throw new Error("Username or email already in use");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(`Hashed password: ${hashedPassword}`);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  //user creation
  console.log(`User created ${user}`);
  if (user) {
    res
      .status(201)
      .json({ _id: user.id, username: user.username, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@description Login a user
//@route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "Login user" });
});

//@description Current user information
//@route POST /api/users/current
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current user information" });
});

module.exports = { registerUser, loginUser, currentUser };
