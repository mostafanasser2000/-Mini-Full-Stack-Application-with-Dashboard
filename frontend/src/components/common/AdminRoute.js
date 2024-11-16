import React from "react";
import { Navigate, Route } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; 

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  return isAuthenticated && isAdmin ? (
    <Route {...rest} element={<Component />} />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default AdminRoute;
