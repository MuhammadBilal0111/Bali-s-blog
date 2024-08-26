const express = require("express");
const authController = require("./../Controllers/authController");
const verifyUser = require("./../Utils/verifyUser");
const app = express();
const authRouter = express.Router();

authRouter.route("/signup").post(authController.signUp);
authRouter.route("/signin").post(authController.signIn);
authRouter.route("/google").post(authController.googleAuth);
authRouter.route("/forget-password").post(authController.forgetPassword);
authRouter.route("/reset-password/:token").patch(authController.resetPassword);
module.exports = authRouter;
