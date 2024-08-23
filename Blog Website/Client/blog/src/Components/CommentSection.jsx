import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea, Button } from "flowbite-react";

function CommentSection({ postId }) {
  const [comments, setComments] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const handleOnChangeText = (e) => {
    setComments(e.target.value);
  };
  const handleSubmitForm=async (e)=>{
    
  }
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
        <form onSubmit={handleSubmitForm} className="border border-6 p-4 rounded-xl border-teal-500">
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
            <Button type="submit" gradientDuoTone="purpleToPink" outline>
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CommentSection;
