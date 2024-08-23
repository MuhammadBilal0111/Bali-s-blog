const express = require("express");
const commentController = require("./../Controllers/commentController");
const verifyUser = require("./../Utils/verifyUser");
const postRouter = express.Router();

postRouter.route("/create").post(verifyUser, commentController.createComment);
postRouter.route("/get-comments/:postId").get(commentController.getComments);

module.exports = postRouter;
