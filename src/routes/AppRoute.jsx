import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import UserRegister from "../pages/UserRegister/userregister";
import Login from "../pages/UserLogin/userlogin";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ServiceProviderRegister from "../pages/ServiceproviderRegistration/serviceproviderregistration";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import Verify from "../pages/Verify/Verify";
import OAuthCallback from "../pages/OAuthCallback/OAuthCallback";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";

import BookingPage from "../pages/Booking/BookingPage";
import PaymentPage from "../pages/Booking/PaymentPage";
import BookingConfirmation from "../pages/Booking/BookingConfirmation";
import RealTimeTracking from "../pages/Booking/RealTimeTracking";

import Layout             from '../layouts/Layout';
import ProviderDashboard  from '../dashboard/ProviderDashboard';
import AddService         from '../services/AddService';
import EditService        from '../services/EditService';
import ManageServices     from '../services/ManageServices';
import Appointments       from '../appointments/Appointments';
import ProviderAnalytics  from '../analytics/ProviderAnalytics';

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
        <Route path="/booking" element={<h1>Booking Page</h1>} />
        
        <Route path="/book/:serviceId" element={<BookingPage />} />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/tracking/:bookingId" element={<RealTimeTracking />} />

        {/* Registration goes here */}
        <Route path="/provider-register" element={<ServiceProviderRegister />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* All provider pages share the Layout (sidebar + header) */}
        <Route path="/provider" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"       element={<ProviderDashboard />} />
          <Route path="add-service"     element={<AddService />} />
          <Route path="manage-services" element={<ManageServices />} />
          <Route path="edit-service/:id" element={<EditService />} />
          <Route path="appointments"    element={<Appointments />} />
          <Route path="analytics"       element={<ProviderAnalytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;