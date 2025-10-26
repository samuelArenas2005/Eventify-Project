import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ children, isAllowed, redirectTo = "/login", loading }) => { 
  if(loading) {
    return <div>Cargando...</div>
  } 
  if(!isAllowed) {
    return <Navigate to={redirectTo} />
  }

  return children ? (children) : (<Outlet/>)
};
