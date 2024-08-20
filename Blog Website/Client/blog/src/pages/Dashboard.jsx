import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DAshPRofile";
import DashPost from "../Components/DashPost";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div>
          <SideBar />
        </div>
        <div className="w-full">{tab === "profile" && <DashProfile />}</div>
        <div className="w-full">{tab === "post" && <DashPost />}</div>
      </div>
    </>
  );
}

export default Dashboard;
