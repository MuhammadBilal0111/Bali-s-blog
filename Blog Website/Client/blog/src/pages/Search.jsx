import React, { useEffect, useState } from "react";
import { Select, TextInput, Button, Spinner } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../Components/PostCard";

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorize",
  });
  const location = useLocation();
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const searchTermFromUrl = URLParams.get("searchTerm");
    const categoryFromUrl = URLParams.get("category");
    const sortFromUrl = URLParams.get("sort");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const searchQuery = URLParams.toString();

    const fetchPosts = async () => {
      setLoading(true);

      const res = await fetch(`/api/post/get-posts?${searchQuery}`);
      const response = await res.json();
      setLoading(false);
      if (res.ok) {
        setPost(response.data.posts);
        if (response.data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } else {
        return;
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "seachTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorize";
      setSidebarData({ ...sidebarData, category: category });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams(location.search);
    urlparams.set("searchTerm", sidebarData.searchTerm ? sidebarData.sort : "");
    urlparams.set("sort", sidebarData.sort ? sidebarData.sort : "");
    urlparams.set("category", sidebarData.category ? sidebarData.category : "");
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const fetchMoreData = async () => {
      try {
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);
        const response = await res.json();
        if (res.ok) {
          if (response.data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
          setPost([...posts, ...response.data.posts]);
        } else {
          setShowMore(false);
          return;
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMoreData();
  };
  return (
    <div className="flex md:flex-row flex-col">
      <div className="p-7 md:min-h-screen min-w-fit flex border-b md:border-r border-gray-700">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex gap-3 items-center">
            <label className="font-semibold text-md text-gray-600 dark:text-slate-300 whitespace-nowrap">
              Search Item:
            </label>
            <TextInput
              placeholder="Search..."
              id="seachTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            ></TextInput>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold text-md text-gray-600 dark:text-slate-300 whitespace-nowrap">
              Sort:
            </label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-semibold text-md text-gray-600 dark:text-slate-300 whitespace-nowrap">
              Category:
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React Js</option>
              <option value="nextjs">Next.js</option>
              <option value="js">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="purpleToPink" outline>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full flex flex-col items-center">
        <h1 className=" text-gray-600 dark:text-slate-300 text-3xl text-center p-3 font-semibold mt-5 border-b border-gray-700">
          Posts Results
        </h1>

        <div className="p-4">
          {!loading && posts.length === 0 && (
            <h1 className="font-semibold text-2xl text-center  p-3">
              No Posts Found
            </h1>
          )}
          {loading && (
            <div className="flex justify-center w-full">
              <Spinner size="lg"></Spinner>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {!loading &&
              posts &&
              posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        </div>
        {showMore && (
          <button
            className="hover:underline text-teal-500 p-4 text-lg"
            onClick={handleShowMore}
          >
            See More
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;
