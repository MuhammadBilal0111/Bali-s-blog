import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import CallToAction from "./../Components/CallToAction";
import { useState } from "react";
import PostCard from "../Components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/get-posts?limit=9");
        const response = await res.json();
        if (res.ok) {
          setPosts(response.data.posts);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-4 items-center max-w-5xl mx-auto my-8 lg:p-20 p-5">
        <h1 className="text-3xl lg:text-6xl font-bold ">Welcome to my blog</h1>
        <p className="text-gray-500 text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, DSA and software engineering and programming related
          topics.
        </p>
        <Link
          to="/search"
          className="text-teal-500 font-semibold text-4 hover:underline"
        >
          See all posts
        </Link>
      </div>
      <div className="p-3 mb-7 bg-amber-100 rounded-md max-w-6xl dark:bg-slate-800 flex justify center mx-auto">
        <CallToAction />
      </div>
      <div className="max-w-7xl mx-auto py-7 flex justify-center gap-8">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex justify-center flex-wrap gap-3 px-2 w-full">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="hover:underline px-2 text-center text-lg font-semibold text-teal-500"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
