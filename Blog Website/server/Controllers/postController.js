const CustomErrors = require("./../Utils/CustomErrors");
const Post = require("./../Model/postModel");

exports.createPost = async (req, res, next) => {
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
