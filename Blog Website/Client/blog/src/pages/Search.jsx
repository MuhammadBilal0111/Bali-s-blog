import React, { useEffect, useState } from "react";
import { TextInput } from "flowbite-react";
import { useLocation } from "react-router-dom";

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorize",
  });
  const location = useLocation();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const searchTermFromUrl = URLParams.get("searchTerm");
    const categoryFromUrl = URLParams.get("category");
    const sortFromUrl = URLParams.get("sort");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({ ...sidebarData, searchTerm: searchTermFromUrl });
      setSidebarData({ ...sidebarData, sort: sortFromUrl });
      setSidebarData({ ...sidebarData, category: categoryFromUrl });
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
      setSidebarData({ ...setSidebarData, category });
    }
  };
  return (
    <div>
      <div className="">
        <form>
          <div className="flex gap-3 items-center">
            <label>Search Item:</label>
            <TextInput
              placeholder="Search..."
              id="seachTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            ></TextInput>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
