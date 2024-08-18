const express = require("express");
const userController = require("./../Controllers/userController");
const userRouter = express.Router();

userRouter.route("/test").get(userController.test);
module.exports = userRouter;
