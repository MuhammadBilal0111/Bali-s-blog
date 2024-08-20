const userRoutes = require("./Router/userRouter");
const authRoutes = require("./Router/authRouter");
const postRoutes = require("./Router/postRouter");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // for extract cookie from browser
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", postRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";
  res.status(statusCode).json({
    status: "failed",
    statusCode,
    message,
  });
});
module.exports = app;
