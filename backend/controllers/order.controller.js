const Order = require("../models/Order.model");
const { sendSuccess, sendError } = require("../utils/response.utils");
const allowedStatuses = ["pending", "confirmed", "in_kitchen", "out_for_delivery", "delivered", "cancelled"];

exports.createOrder = async (req, res, next) => {
  try {
    const { items, total, address, phone } = req.body;
    if (!items?.length) return sendError(res, "Order must have items");

    const order = await Order.create({ user: req.user._id, items, total, address, phone });
    return sendSuccess(res, order, "Order created", 201);
  } catch (err) {
    return next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, orders);
  } catch (err) {
    return next(err);
  }
};

exports.getAllOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return sendSuccess(res, orders);
  } catch (err) {
    return next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return sendError(res, "Order not found", 404);
    return sendSuccess(res, order);
  } catch (err) {
    return next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!allowedStatuses.includes(status)) {
      return sendError(res, "Invalid order status", 400);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return sendError(res, "Order not found", 404);
    }

    return sendSuccess(res, updatedOrder, "Order status updated");
  } catch (err) {
    return next(err);
  }
};
