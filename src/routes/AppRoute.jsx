import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import UserRegister from "../pages/UserRegister/userregister";
import Login from "../pages/UserLogin/userlogin";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ServiceProviderRegister from "../pages/ServiceproviderRegistration/serviceproviderregistration";
import AdminDashboard from "../pages/Admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<h1>Services Page</h1>} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/services" element={<h1>Services Page</h1>} />
        <Route path="/booking" element={<h1>Booking Page</h1>} />
        <Route path="/provider" element={<ServiceProviderRegister />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;