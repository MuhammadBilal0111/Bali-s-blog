import React, { useEffect } from "react";
import { useState } from "react";
import PostCard from "./PostCard";
function RecentArticle() {
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/post/get-posts?limit=3");
        const response = await res.json();
        console.log(response);
        if (res.ok) {
          setRecentPosts(response.data.posts);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchPost();
  }, []);
  return (
    <div className="flex flex-col justify-center items-center mb-4 ">
      <h1 className="font-semibold text-2xl mb-5">Recent Article</h1>
      <div className="flex flex-wrap justify-center md:flex-row md:items-center gap-3">
        {console.log(recentPosts)}

        {recentPosts &&
          recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}

export default RecentArticle;
