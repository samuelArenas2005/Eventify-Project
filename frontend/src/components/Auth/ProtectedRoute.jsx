import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../UI/Loanding/Loanding";

export const ProtectedRoute = ({ children, isAllowed, redirectTo = "/login", loading }) => {
  if (loading) {
    return <Loading />;
  }
  if (!isAllowed) {
    return <Navigate to={redirectTo} />
  }

  return children ? (children) : (<Outlet />)
};
