const CustomErrors = require("../Utils/CustomErrors");
const Comment = require("./../Model/commentsModel");

exports.createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;
  if (req.user.id !== req.body.userId) {
    return next(new CustomErrors("You are not allowed to create comment"));
  }
  try {
    const comment = await Comment.create({ content, postId, userId });
    res.status(201).json({
      status: "success",
      comment,
    });
  } catch (err) {
    next(err);
  }
};
exports.getComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getMonth() - 1,
      now.getDate(),
      now.getYear()
    );
    res.status(200).json({
      status: "success",
      comments,
      totalComments,
    });
  } catch (err) {
    next(err);
  }
};
exports.likeComment = async (req, res, next) => {
  console.log(req.params.commentId);
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new CustomErrors("Comment not found", 404));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numOfLikes++;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numOfLikes--;
    }
    await comment.save();
    res.status(201).json({
      status: "success",
      comment,
    });
  } catch (err) {
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new CustomErrors("Comment not found", 404));
    }
    if (comment.userId !== req.user.id && req.user.role !== "admin") {
      return next(new CustomErrors("You are not allowed to edit the comment"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      editedComment,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new CustomErrors("Comment not found", 404));
    }
    if (req.user.id !== comment.userId && req.user.role === "admin") {
      return next(
        new CustomErrors("You are not allowed to delete the comment", 403)
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({
      status: "success",
      message: "Comment has been deleted",
    });
  } catch (err) {
    next(err);
  }
};
