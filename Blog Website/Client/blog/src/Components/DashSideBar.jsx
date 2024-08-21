import React from "react";
import { Sidebar } from "flowbite-react";
import { HiDocumentText, HiUser } from "react-icons/hi";
import { HiArrowSmRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess, signOutFailure } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function DashSidebar() {
  const [signout, setSignOut] = useState(null);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout/${currentUser.data._id}`, {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(signOutSuccess());
        navigate("/sign-up");
      }
    } catch (err) {
      setSignOut(err.message);
      dispatch(signOutFailure(err.message));
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item // item is a link tag <a><a></a></a>
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.data.role === "admin" ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.data.role === "admin" && (
            <Link to="/dashboard?tab=post">
              <Sidebar.Item
                active={tab === "post"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/signout"}>
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              as="div"
              onClick={handleSignOut}
            >
              Sign out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
