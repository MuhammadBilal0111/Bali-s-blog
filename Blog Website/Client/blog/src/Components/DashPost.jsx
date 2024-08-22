import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/get-posts?userId=${currentUser.data._id}`
        );
        const response = await res.json();
        if (res.ok) {
          if (response.data.posts.length < 9) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
          setUserPosts(response.data?.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (currentUser.data.role === "admin") {
      fetchPosts();
    }
    return () => {
      controller.abort();
    };
  }, [currentUser.data._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/get-posts?userId=${currentUser.data._id}&startIndex=${startIndex}`
      );
      const response = await res.json();
      console.log(response.data.posts);
      if (res.ok) {
        setUserPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        {
          console.log(userPosts.length);
        }
        if (response.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/delete-posts/${postIdToDelete}/${currentUser.data._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(res.message);
      } else {
        setUserPosts((prev) => {
          // this will make the state up to date
          console.log(prev);
          return prev.filter((post) => {
            return post._id !== postIdToDelete;
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className=" min-w-2xl ">
      <div className="table-auto md:mx-auto  p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500 mx-auto ">
        {userPosts.length > 0 && currentUser.data.role === "admin" ? (
          <>
            <Table hoverable className="shadow-md w-full mt-3">
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
                          to={`/post/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span
                          className="text-red-700 font-medium hover:underline cursor-pointer"
                          onClick={() => {
                            setShowModal(true);
                            setPostIdToDelete(post._id);
                          }}
                        >
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
            {showMore && (
              <button
                className="w-full text-lg hover:underline mx-auto my-4 cursor-pointer text-md text-teal-500"
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <div>
            <h1 className="text-center dark:text-gray-200 text-gray-900 font-bold text-2xl py-3 ">
              There is no post
            </h1>
          </div>
        )}
        {showModal && (
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            size={"md"}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="w-14 h-14 text-gray-600 dark:text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete the post?
                </h3>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Decline
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default DashPost;
