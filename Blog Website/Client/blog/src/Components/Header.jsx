import React, { useEffect, useState } from "react";
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
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

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
        <span className="px-2 py-1 bg-gradient-to-r  from-gray-500 to-gray-900 rounded-lg text-white">
          Bali's
        </span>
        Blogs
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={FaSearch}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="hidden md:inline"
        />
        <Button className="outline-none md:hidden" color={"gray"} pill>
          <FaSearch />
        </Button>
      </form>
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
