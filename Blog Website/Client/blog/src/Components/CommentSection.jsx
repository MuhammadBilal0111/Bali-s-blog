import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
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
            <Link className="hover:underline text-cyan-600 italic" to="/dashboard?tab=profile">
              {currentUser.data.email}
            </Link>
          </span>
        </div>
      ) : (
        <div className="flex justify-center">
          <p>You must be signed in to see the comments</p>
          <Link to="/sign-in">Tap to Sign In</Link>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
