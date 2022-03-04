const { Schema, model } = require("mongoose");

const orderHistorySchema = Schema({
  title: String,
  ingredients: [
    {
      name: String,
      quantity: Number,
    },
  ],
  status: String,
  date: String,
});

module.exports = model("OrderHistory", orderHistorySchema);
