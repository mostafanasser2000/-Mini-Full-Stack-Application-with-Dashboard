import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from "./Loading";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
