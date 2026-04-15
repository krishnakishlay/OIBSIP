const { verifyAccessToken } = require("../utils/jwt.utils");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = verifyAccessToken(auth.split(" ")[1]);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ success: false, message: "User not found" });
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  return next();
};

module.exports = { protect, requireAdmin };