const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a name"],
      unique: [true, "Username already exists"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email is already in use"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },

    profilePicUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
