import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/comment/getAllComments");
        const response = await res.json();
        setLoading(false);
        if (res.ok) {
          if (response.data.comments.length < 9) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
          setComments(response.data?.comments);
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    if (currentUser.data.role === "admin") {
      fetchComments();
    }
    return () => {
      controller.abort();
    };
  }, [currentUser.data._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/comment/getAllComments?startIndex=${startIndex}`
      );
      const response = await res.json();
      if (res.ok) {
        setComments((prevPosts) => [...prevPosts, ...response.data.posts]);

        if (response.data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleDeleteComments = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(res.message);
      } else {
        setComments((prev) => {
          return prev.filter((comment) => {
            return comment._id !== commentIdToDelete;
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {loading ? (
        <div className="flex justify-center w-full p-3 mt-7">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="table-auto md:mx-auto  p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500 ">
          {comments.length > 0 && currentUser.data.role === "admin" ? (
            <>
              <Table hoverable className="shadow-md w-full mt-3">
                <Table.Head>
                  <Table.HeadCell className="truncate">
                    Date Updated
                  </Table.HeadCell>
                  <Table.HeadCell className="truncate">
                    Comment Content
                  </Table.HeadCell>
                  <Table.HeadCell className="truncate">
                    No of likes
                  </Table.HeadCell>
                  <Table.HeadCell className="truncate">Post Id</Table.HeadCell>
                  <Table.HeadCell className="truncate">User Id</Table.HeadCell>
                  <Table.HeadCell className="truncate">Delete</Table.HeadCell>
                </Table.Head>
                {comments.map((comment) => {
                  return (
                    <Table.Body key={`${comment._id}`} className="divide-y">
                      <Table.Row className="cursor-pointer dark:bg-gray-700 bg-white ">
                        <Table.Cell>
                          {new Date(comment.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>{comment.content}</Table.Cell>
                        <Table.Cell>{comment.numOfLikes}</Table.Cell>
                        <Table.Cell>{comment.postId}</Table.Cell>
                        <Table.Cell>{comment.userId}</Table.Cell>
                        <Table.Cell>
                          <span
                            className="text-red-700 font-medium hover:underline cursor-pointer"
                            onClick={() => {
                              setShowModal(true);
                              setCommentIdToDelete(comment._id);
                            }}
                          >
                            Delete
                          </span>
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
                There are no comments yet
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
                    Are you sure you want to delete the comment?
                  </h3>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-center gap-4">
                <Button color={"failure"} onClick={handleDeleteComments}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Decline
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default DashComments;
