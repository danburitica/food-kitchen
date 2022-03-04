const { Schema, model } = require("mongoose");

const recipeSchema = Schema({
  title: String,
  ingredients: [
    {
      name: String,
      quantity: Number,
    },
  ],
});

module.exports = model("Recipe", recipeSchema);
