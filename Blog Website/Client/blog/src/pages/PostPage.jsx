import "./PostPage.module.css";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  console.log(postSlug);
  useEffect(() => {
    const getPostDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setPost(data.data.posts[0]);
          setError(null);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    getPostDetails();
  }, [postSlug]);
  if (loading) {
    return (
      <div className="">
        <div className="flex  justify-center items-center">
          <Spinner size="xl"></Spinner>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-center py-4 mt-10 mx-auto max-w-2xl lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="text-center p-4 text-blue-600 font-semibold hover:underline mx-auto self-center"
      >
        <Button color="gray" pill>
          {post.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post && post.imageUrl}
        alt={post && post.title}
      />
      <div className="p-3 cursor-pointer flex items-center  justify-between border-b w-full text-sm border-slate-300 max-w-2xl mx-auto">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
    </div>
  );
}

export default PostPage;
