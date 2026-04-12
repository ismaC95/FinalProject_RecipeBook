const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Data validation
const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
//password needs at least 8 characters, 1 lowercase, 1 uppercase, 1 number and can contain special characters
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

//@description register user
//@route POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, and a number",
    );
  }

  //User credentials unique validation
  const emailAvailable = await User.findOne({ email });
  if (emailAvailable) {
    res.status(400);
    throw new Error("Email already in use");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
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
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

//@description Update user information
//@route PUT /api/users/profile
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const { username, email, bio, currentPassword, newPassword } = req.body;

  //Ensure user doing the request exists
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //If updating the email, ensuring it's unique
  if (email && email !== user.email) {
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      res.status(400);
      throw new Error("Email already in use");
    }

    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error("Invalid email format");
    }
  }

  //if updating password, verify the previous password first
  if (newPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error("Please provide your current password");
    }

    //check if the provided password is the same as the user password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }

    //validate new password against Regex
    if (!passwordRegex.test(newPassword)) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters with uppercase, lowercase and a number",
      );
    }

    //hash the new password and update it
    user.password = await bcrypt.hash(newPassword, 10);
  }

  //update fields
  if (username) user.username = username;
  if (email) user.email = email;
  if (bio !== undefined) user.bio = bio;

  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    bio: updatedUser.bio,
  });
});

module.exports = { registerUser, loginUser, currentUser, updateUser };
