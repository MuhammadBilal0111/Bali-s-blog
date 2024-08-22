const express = require("express");
const postController = require("./../Controllers/postController");
const verifyUser = require("./../Utils/verifyUser");
const app = express();
const postRouter = express.Router();

postRouter.route("/create-post").post(verifyUser, postController.createPost);
postRouter.route("/get-posts").get(postController.getPosts);
postRouter
  .route("/delete-posts/:postId/:userId")
  .delete(verifyUser, postController.deletePost);

postRouter
  .route("/update-posts/:postId/:userId")
  .patch(verifyUser, postController.updatePost);

module.exports = postRouter;
