import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea, Button, Alert } from "flowbite-react";
import { Spinner } from "flowbite-react";
import Comment from "./Comment";

function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsError, setCommentError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const handleOnChangeText = (e) => {
    setComment(e.target.value);
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      setLoading(true);
      setCommentError(false);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.data._id,
          postId,
          content: comment,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data.comment, ...comments]);
      }
    } catch (err) {
      setCommentError(err.message);
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...comment, content: editedContent } : c
      )
    );
  };
  console.log(comments);
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getComments();
  }, [postId]);
  const handleLikes = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  numOfLikes: data.comment.likes.length,
                  likes: data.comment.likes,
                }
              : comment
          )
        );
        console.log(comments);
      } else {
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      {currentUser ? (
        <div className="flex justify-center text-gray-600 gap-3 items-center text-sm my-3">
          <p>Signed in as:</p>
          <img
            className="rounded-full h-7 w-7 object-cover"
            src={currentUser.data.profilePicture}
            alt={currentUser.data.profilePicture}
          />
          <span>
            @
            <Link
              className="hover:underline text-cyan-600 italic"
              to="/dashboard?tab=profile"
            >
              {currentUser.data.email}
            </Link>
          </span>
        </div>
      ) : (
        <div className="flex gap-1 text-sm text-teal-500 my-5 justify-center">
          <p>You must be signed in to see the comment</p>
          <Link className="hover:underline text-cyan-600 italic" to="/sign-in">
            Tap to Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmitForm}
          className="border border-6 p-4 rounded-xl border-teal-500"
        >
          <Textarea
            id="comment"
            placeholder="Leave a comment..."
            required
            maxLength="200"
            value={comment}
            onChange={handleOnChangeText}
            rows="4"
          />
          <div className="flex justify-between items-center p-2 mt-2 md:flex-row flex-col gap-3">
            <p className="text-sm text-gray-600">
              {200 - comment.length} letters remaining
            </p>
            <Button
              type="submit"
              className="min-w-24 flex items-center justify-center"
              gradientDuoTone="purpleToPink"
              outline
            >
              {loading ? <Spinner size="sm" /> : "Submit"}
            </Button>
          </div>
          {commentsError && (
            <Alert color="failure" className="mt-5">
              {commentsError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <h1 className="text-lg dark:text-gray-200 text-gray-800 font-bold text-center my-4 ">
          There are no comments yet!!
        </h1>
      ) : (
        <>
          <div className="flex items-center mt-4 gap-2">
            <p className="text-md font-semibold">Comments :</p>
            <div className="border border-gray-700 py-1 px-2">
              {comments.length}
            </div>
          </div>
          {comments.map((com) => (
            <Comment
              key={comment._id}
              comment={com}
              onLike={handleLikes}
              onEdit={handleEdit}
            ></Comment>
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
