import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import UserRegister from "../pages/UserRegister/userregister";
import Login from "../pages/UserLogin/userlogin";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ServiceProviderRegister from "../pages/ServiceproviderRegistration/serviceproviderregistration";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import Verify from "../pages/Verify/Verify";
import OAuthCallback from "../pages/OAuthCallback/OAuthCallback";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";

// Provider
import Layout             from '../layouts/Layout';
import ProviderDashboard  from '../dashboard/ProviderDashboard';
import AddService         from '../services/AddService';
import EditService        from '../services/EditService';
import ManageServices     from '../services/ManageServices';
import Appointments       from '../appointments/Appointments';
import ProviderAnalytics  from '../analytics/ProviderAnalytics';

// Admin
import AdminLayout        from '../layouts/AdminLayout';
import DashboardOverview  from '../pages/Admin/DashboardOverview';
import UserManagement     from '../pages/Admin/UserManagement';
import ServiceModeration  from '../pages/Admin/ServiceModeration';
import AdminAnalytics     from '../pages/Admin/AdminAnalytics';
import AdminRoute         from './AdminRoute';

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
        
        {/* Registration goes here */}
        <Route path="/provider-register" element={<ServiceProviderRegister />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Admin Portal - Protected by AdminRoute */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"  element={<DashboardOverview />} />
            <Route path="users"      element={<UserManagement />} />
            <Route path="moderation" element={<ServiceModeration />} />
            <Route path="analytics"  element={<AdminAnalytics />} />
          </Route>
        </Route>

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