import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
function PostCard({ post }) {
  return (
    <div className="group border border-teal-500 rounded-lg sm:w-[430px] h-[360px] hover:border-2 overflow-hidden transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.imageUrl}
          alt={post.imageUrl}
          className="h-[260px] object-cover group-hover:h-[200px] transition-all duration-300 z-20 line-clamp-2"
        />
      </Link>
      <div className="flex justify-center flex-col relative gap-1 m-3">
        <h3 className="text-lg font-bold">{post.title}</h3>
        <span className="text-sm mb-2 italic">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="group-hover:-bottom-[40px] bottom-[-300px] z-10 absolute transition-all duration-200 left-0 right-0 py-2 rounded-md border border-teal-500 text-center hover:bg-teal-500 text-md font-semibold text-white"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
