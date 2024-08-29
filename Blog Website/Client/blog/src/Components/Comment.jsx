import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

import moment from "moment";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";
function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/user/get-user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getUsers();
  }, [comment]);
  const handleEdit = () => {
    setEditing(true);
    // setEditedContent(comment.content);
  };
  const handleSave = async (comment, editedContent) => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className="flex gap-4 p-4 border-b dark:border-gray-600 my-5">
        <div className="">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-1">
            <span className="hover:underline font-semibold text-sm truncate">
              {user ? `@${user.username}` : "Anonymous User"}
            </span>
            <span className="text-gray-500 text-xs truncate ">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {editing ? (
            <>
              <Textarea
                className="w-full resize-none"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex gap-4 justify-end mt-3 w-full">
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToPink"
                  onClick={() => handleSave(comment, editedContent)}
                >
                  Send
                </Button>
                <Button
                  type="button"
                  size="sm"
                  color="white"
                  outline
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className=" text-md text-gray-500 mb-4">{comment.content}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-300  ${
                    currentUser &&
                    comment.likes.includes(currentUser.data._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                </button>
                <p className="cursor-pointer">
                  {comment.numOfLikes > 0 &&
                    comment.numOfLikes +
                      " " +
                      (comment.numOfLikes === 1 ? "like" : "likes")}
                </p>
                {currentUser &&
                  (currentUser.data.role === "admin" ||
                    currentUser.data._id === comment.userId) && (
                    <>
                      <button
                        className="cursor-pointer text-gray-300 hover:text-blue-500"
                        onClick={() => handleEdit(comment._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-gray-300 hover:text-red-500 cursor-pointer"
                        onClick={() => onDelete(comment._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Comment;
