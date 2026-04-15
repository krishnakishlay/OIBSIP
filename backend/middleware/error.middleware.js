const errorMiddleware = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  if (err.name === "ValidationError") {
    const validationMessage = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ success: false, message: validationMessage });
  }

  return res.status(status).json({ success: false, message });
};

module.exports = errorMiddleware;
