import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      // If a regular user or provider attempts to access /admin via URL
      // eslint-disable-next-line react-hooks/error-boundaries
      return <Navigate to="/login" replace />;
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;