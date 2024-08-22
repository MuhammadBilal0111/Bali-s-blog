const express = require("express");
const userController = require("./../Controllers/userController");
const verifyUser = require("./../Utils/verifyUser");
const userRouter = express.Router();

userRouter
  .route("/update/:userId")
  .patch(verifyUser, userController.updateUser);
userRouter
  .route("/delete/:userId")
  .delete(verifyUser, userController.deleteUser);
userRouter.route("/get-users").get(verifyUser, userController.getUsers);
userRouter.route("/signout/:userId").post(verifyUser, userController.signOut);

module.exports = userRouter;
