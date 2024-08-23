import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea, Button, Alert } from "flowbite-react";
import { Spinner } from "flowbite-react";

function CommentSection({ postId }) {
  const [comments, setComments] = useState("");
  const [commentsError, setCommentError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const handleOnChangeText = (e) => {
    setComments(e.target.value);
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (comments.length > 200) {
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
          content: comments,
        }),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (res.ok) {
        setComments("");
        setCommentError(null);
      }
    } catch (err) {
      setCommentError(err.message);
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
          <p>You must be signed in to see the comments</p>
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
            value={comments}
            onChange={handleOnChangeText}
            rows="4"
          />
          <div className="flex justify-between items-center p-2 mt-2 md:flex-row flex-col gap-3">
            <p className="text-sm text-gray-600">
              {200 - comments.length} letters remaining
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
    </div>
  );
}

export default CommentSection;
