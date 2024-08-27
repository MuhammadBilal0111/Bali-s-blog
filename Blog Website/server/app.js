const userRoutes = require("./Router/userRouter");
const authRoutes = require("./Router/authRouter");
const postRoutes = require("./Router/postRouter");
const commentRoutes = require("./Router/CommentRouter");
const express = require("express");
const morgan = require("morgan");

const cookieParser = require("cookie-parser");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

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
