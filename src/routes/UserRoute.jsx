import { Navigate, Outlet } from "react-router-dom";

const UserRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const role = (user.role || "user").toLowerCase();
    // Block providers and admins — they have their own portals
    if (role === "provider" || role === "admin") {
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserRoute;
