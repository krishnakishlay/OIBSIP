const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
