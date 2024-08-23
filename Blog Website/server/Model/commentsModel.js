const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
