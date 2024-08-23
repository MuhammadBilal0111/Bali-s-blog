import React, { useEffect, useState } from "react";
import { HR } from "flowbite-react";
import moment from "moment";
function Comment({ comment }) {
  const [user, setUser] = useState({});
  console.log(user);
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
          <p className="text-md text-gray-500 mb-4">{comment.content}</p>
          <HR />
          <div className="flex gap-3 items-center text-gray-400">
            <p>Like</p>
            <p>Edit</p>
            <p>Delete</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
