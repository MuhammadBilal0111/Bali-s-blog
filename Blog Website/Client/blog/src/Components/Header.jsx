import React from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaMoon } from "react-icons/fa6";
function Header() {
  const path = useLocation().pathname;
  console.log(path);
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
        <Button className="lg: outline-none" color={"gray"} pill>
          <FaMoon />
        </Button>
        <Link to={"/sign-in"}>
          <Button gradientDuoTone={"purpleToBlue"} outline>
            Sign In
          </Button>
        </Link>
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
