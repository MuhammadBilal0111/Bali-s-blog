import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `api/post/get-posts?userId=${currentUser.data._id}`
        );
        const response = await res.json();
        if (res.ok) {
          setUserPosts(response.data?.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (currentUser.data.role === "admin") {
      fetchPosts();
    }
  }, [currentUser.data._id]);
  return (
    <div className="table-auto md:mx-auto  p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500">
      {userPosts.length > 0 && currentUser.data.role === "admin" ? (
        <>
          <Table hoverable className="shadow-md w-full">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => {
              return (
                <Table.Body key={`${post._id}`} className="divide-y">
                  <Table.Row className="cursor-pointer dark:bg-gray-700 bg-white ">
                    <Table.Cell>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`post/${post.slug}`}>
                        <img
                          src={post.image}
                          className="object-cover h-12 w-22 bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span className="text-red-700 font-medium hover:underline cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/update-post/${post._id}`}>
                        <span className="font-medium hover:underline text-blue-500">
                          Edit
                        </span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </>
      ) : (
        <div>
          <h1>There is no post</h1>
        </div>
      )}
    </div>
  );
}

export default DashPost;
