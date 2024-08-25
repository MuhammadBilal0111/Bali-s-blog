import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [post, setPost] = useState([]);
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
          setPost(response.data.posts);
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
  return <div>Dashboard Componets</div>;
}

export default DashboardComponent;
