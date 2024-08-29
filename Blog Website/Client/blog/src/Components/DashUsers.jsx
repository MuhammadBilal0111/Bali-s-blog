import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const controller = new AbortController();
    // const signal = controller.signal;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/get-users");
        const response = await res.json();
        setLoading(false);
        if (res.ok) {
          if (response.data.users.length < 9) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
          setUsers(response.data?.users);
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    if (currentUser.data.role === "admin") {
      fetchUsers();
    }
    // return () => {
    //   controller.abort();
    // };
  }, [currentUser.data._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/get-users?startIndex=${startIndex}`);
      const response = await res.json();
      if (res.ok) {
        setUsers((prevPosts) => [...prevPosts, ...response.data.posts]);

        if (response.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleDeleteUsers = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${currentUser.data._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(res.message);
      } else {
        setUsers((prev) => {
          return prev.filter((user) => {
            return user._id !== userIdToDelete;
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
        <div className="flex justify-center mx-auto p-3 mt-7">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="table-auto md:mx-auto  p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500 ">
          {users.length > 0 && currentUser.data.role === "admin" ? (
            <>
              <Table hoverable className="shadow-md w-full mt-3">
                <Table.Head>
                  <Table.HeadCell>Date created</Table.HeadCell>
                  <Table.HeadCell>User Image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>E-mail</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                {users.map((user) => {
                  return (
                    <Table.Body key={`${user._id}`} className="divide-y">
                      <Table.Row className="cursor-pointer dark:bg-gray-700 bg-white ">
                        <Table.Cell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            className="rounded-full object-cover h-[40px] w-[40px] self-center mx-auto bg-gray-500"
                            alt={user.username}
                          />
                        </Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          {user.role === "admin" ? (
                            <FaCheck className="self-center mx-auto text-green-500 text-lg" />
                          ) : (
                            <ImCross className=" text-red-600 text-lg self-center mx-auto" />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className="text-red-700 font-medium hover:underline cursor-pointer"
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id);
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
                There are no users yet
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
                    Are you sure you want to delete the user?
                  </h3>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-center gap-4">
                <Button color={"failure"} onClick={handleDeleteUsers}>
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

export default DashUsers;
