const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@description register user
//@route POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //Data validation
  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  //password needs at least 8 characters, 1 lowercase, 1 uppercase, 1 number and can contain special characters
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (!emailRegex.test(email)) {
    console.log("Email failed regex:", email);
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (!passwordRegex.test(password)) {
    console.log("Password failed regex:", password);
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, and a number",
    );
  }

  //User credentials unique validation
  const emailAvailable = await User.findOne({ email });
  // const usernameAvailable = await User.findOne({ username });

  if (emailAvailable) {
    res.status(400);
    throw new Error("Email already in use");
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
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" },
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

//@description Current user information
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
