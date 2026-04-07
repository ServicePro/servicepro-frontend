import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProviderRoute = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    // Redirect to login if absolutely no token is set
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    // Check if the role is correct. We can allow 'provider' or 'admin'. 
    if (user.role !== 'provider' && user.role !== 'admin') {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // If localstorage parsing fails somehow
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProviderRoute;
