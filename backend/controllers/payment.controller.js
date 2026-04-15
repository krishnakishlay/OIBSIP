const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order.model");
const { sendSuccess, sendError } = require("../utils/response.utils");

const createRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const razorpay = createRazorpayClient();
    if (!razorpay) {
      return sendError(res, "Payment gateway is not configured on the server", 503);
    }

    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return sendError(res, "Order not found", 404);

    const rpOrder = await razorpay.orders.create({
      amount: order.total * 100,
      currency: "INR",
      receipt: `receipt_${order._id}`,
    });

    order.razorpayOrderId = rpOrder.id;
    await order.save();

    return sendSuccess(res, { razorpayOrderId: rpOrder.id, amount: rpOrder.amount });
  } catch (err) {
    return next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature) {
      return sendError(res, "Payment verification failed", 400);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "confirmed", paymentId: razorpayPaymentId },
      { new: true }
    );
    return sendSuccess(res, order, "Payment verified, order confirmed");
  } catch (err) {
    return next(err);
  }
};

exports.markOrderSuccessForNow = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return sendError(res, "orderId is required", 400);

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user._id },
      { status: "confirmed", paymentId: `demo_${Date.now()}` },
      { new: true }
    );

    if (!order) return sendError(res, "Order not found", 404);
    return sendSuccess(res, order, "Order marked successful");
  } catch (err) {
    return next(err);
  }
};
