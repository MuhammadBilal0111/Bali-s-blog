import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function OnlyAdminPrivateRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.data.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}

export default OnlyAdminPrivateRoutes;
