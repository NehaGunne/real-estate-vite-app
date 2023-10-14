import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
