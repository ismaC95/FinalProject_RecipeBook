const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please, add a title"],
      trim: true,
    },

    instructions: {
      type: String,
      required: [true, "Please add instructions"],
    },

    ingredients: [
      {
        name: {
          type: String,
          required: [true, "Please, add a ingredient"],
          lowercase: true,
          trim: true,
        },
        quantity: Number,
        unit: String,
      },
    ],

    prepTime: {
      type: Number,
      required: [true, "Please add prep time"],
      min: 0,
    },

    cookTime: {
      type: Number,
      required: [true, "Please add cook time"],
      min: 0,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Please specify difficulty"],
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
    },

    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Recipe", recipeSchema);
