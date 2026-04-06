import { Navigate, Outlet } from "react-router-dom";

const ProviderRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== "provider") {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProviderRoute;
