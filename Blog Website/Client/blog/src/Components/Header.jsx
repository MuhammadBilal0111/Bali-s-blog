import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { MdSunny } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaMoon } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { signOutSuccess, signOutFailure } from "../store/userSlice";


function Header() {
  const navigate = useNavigate();
  const [signout, setSignOut] = useState(null);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch(`api/user/signout/${currentUser.data._id}`, {
        method: "POST",
      });
      const data = await res.json();

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
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap font-semibold dark:text-white text-sm sm:text-xl"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Bali's
        </span>
        Blogs
      </Link>
      <form action="">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={FaSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="outline-none lg:hidden" color={"gray"} pill>
        <FaSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="lg: outline-none flex items-center justify-center md:mr-7"
          color={"gray"}
          onClick={handleToggleTheme}
          pill
        >
          {theme === "light" ? <MdSunny /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                size="sm"
                rounded
                img={currentUser?.data?.profilePicture}
              />
            }
          >
            <Dropdown.Header>
              <Link to="/dashboard?tab=profile" className="hover:underline">
                <span className="block font-bold text-center">
                  {currentUser?.data?.username}
                </span>
              </Link>

              <span className="block text-sm truncate text-center">
                {currentUser?.data?.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign In
            </Button>
          </Link>
        )}
        {/* <Navbar.Toggle /> */}
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
      <Navbar.Toggle />
    </Navbar>
  );
}

export default Header;
