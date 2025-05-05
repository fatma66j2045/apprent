// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector((state) => state.users.user);
  const location = useLocation();

  if (!user) {
    // User not logged in
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // User logged in but not authorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
