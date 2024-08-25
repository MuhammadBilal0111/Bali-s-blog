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

    res.status(200).json({
      status: "success",
      comments,
      totalComments,
    });
  } catch (err) {
    next(err);
  }
};
exports.getAllComments = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new CustomErrors("You are not allowed to get all comments", 403)
    );
  }
  const limit = req.query.limit || 9;
  const startIndex = req.query.startIndex || 0;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  try {
    const dataRetrieve = await Comment.find({})
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: sortDirection });
    const totalComment = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      status: "success",
      data: {
        comments: dataRetrieve,
        totalComment,
        lastMonthComments,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.likeComment = async (req, res, next) => {
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
