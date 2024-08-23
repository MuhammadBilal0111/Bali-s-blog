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
      status: 'success',
      comment,
    });
  } catch (err) {
    next(err);
  }
};
