const express = require("express");
const authController = require("./../Controllers/authController");

const app = express();
const authRouter = express.Router();

authRouter.route("/signup").post(authController.signUp);
authRouter.route("/signin").post(authController.signIn);
authRouter.route("/google").post(authController.googleAuth);
module.exports = authRouter;
