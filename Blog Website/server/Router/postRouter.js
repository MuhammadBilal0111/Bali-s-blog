const express = require("express");
const postController = require("./../Controllers/postController");
const verifyUser = require("./../Utils/verifyUser");
const app = express();
const postRouter = express.Router();

postRouter.route("/create-post").post(verifyUser, postController.createPost);

module.exports = postRouter;
