const CustomErrors = require("./../Utils/CustomErrors");
const Post = require("./../Model/postModel");

exports.createPost = async (req, res, next) => {
  console.log(req.body);
  if (req.user.role === "admin") {
    if (!req.body.title || !req.body.content) {
      return next(new CustomErrors("Please provide all required fields", 400));
    }
    // A slug is a user-friendly, URL-safe string that represents a particular resource on a website, typically derived from the title of the content. It's used in URLs to make them more readable and SEO-friendly.
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^A-Za-z0-9-]/g, "");
    const newPost = {
      ...req.body,
      slug,
      userId: req.user._id,
    };
    try {
      const post = await Post.create(newPost);
      console.log(post);
      res.status(201).json({
        status: "success",
        post,
      });
    } catch (err) {
      return next(new CustomErrors(err.message, 403));
    }
  } else {
    return next(new CustomErrors("You are not allowed to create a post", 403));
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    // $regex search in title and category in mongodb object
    // $options: lowercase uppercase not important
    // means searching between two places
    //  $or:[title:{$regex:req.query.searchTerm,$options:'i'}]
    console.log(req.query);
    const startIndex = req.query.startIndex * 1 || 0;
    const limit = req.query.limit * 1 || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const toFind = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };
    const posts = await Post.find(toFind)
      .sort({ updatedAt: sortDirection })
      .limit(limit)
      .skip(startIndex);

    const totalPosts = await Post.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      status: "success",
      data: { posts, totalPosts, lastMonthPosts },
    });
  } catch (err) {
    console.log(err);
    return next(new CustomErrors(err, 404));
  }
};
exports.deletePost = async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
    return next(
      new CustomErrors("You are not allowed to delete the posts", 403)
    );
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({
      status: "success",
      message: "Post has been deleted successfully!",
    });
  } catch (err) {
    next(err);
  }
};
exports.updatePost = async (req, res, next) => {
  if (req.user.role !== "admin" && req.params.userId !== req.user.id) {
    return next(
      new CustomErrors("You are not allowed to delete this post", 403)
    );
  }
  try {
    const newPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          slug: req.body.title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^A-Za-z0-9-]/g, ""),
          content: req.body.content,
          image: req.body.profilePicture,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: newPost,
    });
  } catch (err) {
    next(err);
  }
};
