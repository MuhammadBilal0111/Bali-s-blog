const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      default: "uncategorized",
    },
    imageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6GfPQdX1AeKTOmxRmHHqfmidqMV-mZn2izw&s",
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("post", postSchema);
module.exports = Post;
