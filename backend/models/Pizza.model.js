const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["veg", "nonveg"], required: true },
    emoji: { type: String, default: "🍕" },
    badge: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
