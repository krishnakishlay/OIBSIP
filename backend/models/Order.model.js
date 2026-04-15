const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_kitchen", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    paymentId: String,
    razorpayOrderId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
