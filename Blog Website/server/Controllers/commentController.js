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
