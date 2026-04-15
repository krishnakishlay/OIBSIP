const crypto = require("crypto");
const User = require("../models/User.model");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt.utils");
const { sendSuccess, sendError } = require("../utils/response.utils");
const { sendResetEmail } = require("../utils/email.utils");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const accessToken  = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    sendSuccess(
      res,
      { accessToken, refreshToken, user: { id: user._id, name, email, role: user.role } },
      "Registered",
      201
    );
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, "Invalid email or password", 401);
    }
    const accessToken  = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    sendSuccess(
      res,
      { accessToken, refreshToken, user: { id: user._id, name: user.name, email, role: user.role } }
    );
  } catch (err) { next(err); }
};

exports.refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendError(res, "No refresh token", 401);
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(decoded.id);
    sendSuccess(res, { accessToken });
  } catch {
    sendError(res, "Refresh token invalid or expired", 401);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return sendSuccess(res, null, "If that email exists, a reset link was sent.");
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken   = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = Date.now() + 3600000; // 1 h
    await user.save({ validateBeforeSave: false });
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendResetEmail(user.email, resetURL);
    sendSuccess(res, null, "Reset link sent");
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return sendError(res, "Token invalid or expired", 400);
    user.password = req.body.password;
    user.passwordResetToken   = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    sendSuccess(res, null, "Password updated");
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => sendSuccess(res, req.user);