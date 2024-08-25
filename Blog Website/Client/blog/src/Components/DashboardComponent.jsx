import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  HiOutlineUserGroup,
  HiArrowNarrowUp,
  HiAnnotation,
  HiDocumentText,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComment, setTotalComment] = useState(0);
  const [lastMonthUser, setLastMonthUser] = useState(0);
  const [lastMonthPost, setLastMonthPost] = useState(0);
  const [lastMonthComments, setLastMontComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/get-users?limit=5");
        const response = await res.json();
        if (res.ok) {
          setUsers(response.data.users);
          setTotalUsers(response.data.totalUsers);
          setLastMonthUser(response.data.lastMonthUsers);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/get-posts?limit=5");
        const response = await res.json();
        if (res.ok) {
          setPosts(response.data.posts);
          setTotalPosts(response.data.totalPosts);
          setLastMonthPost(response.data.lastMonthPosts);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getAllComments?limit=5");
        const response = await res.json();
        if (res.ok) {
          setComments(response.data.comments);
          setTotalComment(response.data.totalComment);
          setLastMontComments(response.data.lastMonthComments);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    if (currentUser.data.role === "admin") {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex p-3 flex-col w-full md:w-72 gap-3 shadow-md dark:bg-slate-800 rounded-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h3 className="text-md font-semibold text-gray-500 uppercase">
                Total Users
              </h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="p-3 text-white bg-teal-500 text-5xl rounded-full" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center text-green-500 gap-1">
              <HiArrowNarrowUp />
              {lastMonthUser}
            </span>
            <span className="text-gray-300">Last month</span>
          </div>
        </div>
        <div className="flex p-3 flex-col w-full md:w-72 gap-4 shadow-md dark:bg-slate-800 rounded-md">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-md font-semibold text-gray-500 uppercase">
                Total Posts
              </h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="p-3 text-white bg-indigo-500 text-5xl rounded-full" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center text-green-500 gap-1">
              <HiArrowNarrowUp />
              {lastMonthPost}
            </span>
            <span className="text-gray-300">Last month</span>
          </div>
        </div>
        <div className="flex p-3 flex-col w-full md:w-72 gap-4 shadow-md dark:bg-slate-800 rounded-md">
          <div className="flex justify-between items-center">
            <div className="">
              <h3 className="text-md font-semibold text-gray-500 uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComment}</p>
            </div>
            <HiAnnotation className="p-3 text-white bg-lime-500 text-5xl rounded-full" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center text-green-500 gap-1">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <span className="text-gray-300">Last month</span>
          </div>
        </div>
      </div>
      <div className="max-w-2xl flex flex-wrap mx-auto w-full justify-center my-2">
        <div className="flex flex-col gap-3 md:mx-auto  p-3 shadow-md rounded-md dark:bg-slate-800 my-2 w-full">
          <div className="flex justify-between font-semibold items-center">
            <h1 className="text-gray-300 text-center">Recent Users</h1>
            <Button gradientDuoTone="purpleToPink" outline>
              <Link to="/dashboard?tab=users">See All</Link>
            </Button>
          </div>
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Profile Picture</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              {users &&
                users.map((user) => {
                  return (
                    <Table.Body key={user._id} className="divide-y">
                      <Table.Row className="bg-white dark:bg-gray-700 dark:border-slate-900">
                        <Table.Cell>
                          <img
                            className="object-cover w-12 h-12 rounded-full bg-gray-600"
                            src={user.profilePicture}
                            alt={user.username}
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:mx-auto p-3 shadow-md rounded-md dark:bg-slate-800 my-2 w-full">
          <div className="flex justify-between font-semibold items-center">
            <h1 className="text-gray-300 text-center">Recent Comments</h1>
            <Button gradientDuoTone="purpleToPink" outline>
              <Link to="/dashboard?tab=comments">See All</Link>
            </Button>
          </div>
          <div className="">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              {comments &&
                comments.map((comment) => {
                  return (
                    <Table.Body key={comment._id} className="divide-y">
                      <Table.Row className="bg-white dark:bg-gray-700 dark:border-slate-900">
                        <Table.Cell>
                          <p className="line-clamp-2 w-96">{comment.content}</p>
                        </Table.Cell>
                        <Table.Cell>{comment.numOfLikes}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
            </Table>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:mx-auto p-3 shadow-md rounded-md dark:bg-slate-800 my-2 w-full">
          <div className="flex justify-between font-semibold items-center">
            <h1 className="text-gray-300 text-center">Recent Posts</h1>
            <Button gradientDuoTone="purpleToPink" outline>
              <Link to="/dashboard?tab=post">See All</Link>
            </Button>
          </div>
          <div className="">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              {posts &&
                posts.map((post) => {
                  return (
                    <Table.Body key={post._id} className="divide-y">
                      <Table.Row className="bg-white dark:bg-gray-700 dark:border-slate-900">
                        <Table.Cell>
                          <img
                            src={post.imageUrl}
                            className="w-14 h-10 rounded-md object-cover"
                            alt={post.imageUrl}
                          />
                        </Table.Cell>
                        <Table.Cell className="w-96">{post.title}</Table.Cell>
                        <Table.Cell className="w-5">{post.category}</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
