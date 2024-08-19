const express = require("express");
const userController = require("./../Controllers/userController");
const verifyUser = require("./../Utils/verifyUser");
const userRouter = express.Router();

userRouter.route("/update/:userId").put(verifyUser, userController.updateUser);
module.exports = userRouter;
