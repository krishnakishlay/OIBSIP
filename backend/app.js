require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes    = require("./routes/auth.routes");
const pizzaRoutes   = require("./routes/pizza.routes");
const orderRoutes   = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",     authRoutes);
app.use("/api/pizzas",   pizzaRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorMiddleware);

module.exports = app;