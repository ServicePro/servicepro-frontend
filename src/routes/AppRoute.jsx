import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ComingSoon from "../pages/ComingSoon";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import LandingPage from "../pages/Landing/LandingPage";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import OAuthCallback from "../pages/OAuthCallback/OAuthCallback";
import ServiceProviderRegister from "../pages/ServiceproviderRegistration/serviceproviderregistration";
import AccountSettings from "../pages/UserDashboard/AccountSettings";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import UserProfile from "../pages/UserDashboard/UserProfile";
import Login from "../pages/UserLogin/userlogin";
import UserRegister from "../pages/UserRegister/userregister";
import Verify from "../pages/Verify/Verify";

import BookingConfirmation from "../pages/Booking/BookingConfirmation";
import BookingPage from "../pages/Booking/BookingPage";
import PaymentPage from "../pages/Booking/PaymentPage";
import RealTimeTracking from "../pages/Booking/RealTimeTracking";
import ServiceListing from "../pages/services/ServiceListing";

import ProviderAnalytics from '../analytics/ProviderAnalytics';
import Appointments from '../appointments/Appointments';
import ProviderDashboard from '../dashboard/ProviderDashboard';
import Layout from '../layouts/Layout';
import AddService from '../services/AddService';
import EditService from '../services/EditService';
import ManageServices from '../services/ManageServices';
import ProviderRoute from './ProviderRoute';

// Admin
import AdminLayout from '../layouts/AdminLayout';
import AdminAnalytics from '../pages/Admin/AdminAnalytics';
import DashboardOverview from '../pages/Admin/DashboardOverview';
import ServiceModeration from '../pages/Admin/ServiceModeration';
import UserManagement from '../pages/Admin/UserManagement';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServiceListing />} />
        <Route path="/about" element={<ComingSoon title="About Us" description="Learn more about ServicePro" icon="ℹ️" />} />
        <Route path="/contact" element={<ComingSoon title="Contact" description="Get in touch with us" icon="📧" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/booking" element={<ComingSoon title="Bookings" description="Manage your bookings" icon="📅" />} />
        
        <Route path="/book/:serviceId" element={<BookingPage />} />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/tracking/:bookingId" element={<RealTimeTracking />} />

        {/* User Pages */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/view-profile" element={<UserProfile />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/bookings" element={<ComingSoon title="My Bookings" description="View and manage your bookings" icon="📅" returnTo="/user-dashboard" />} />
        <Route path="/reviews" element={<ComingSoon title="My Reviews" description="View and manage your reviews" icon="⭐" returnTo="/user-dashboard" />} />
        <Route path="/saved" element={<ComingSoon title="Saved Items" description="Your saved services and providers" icon="❤️" returnTo="/user-dashboard" />} />

        {/* Registration goes here */}
        <Route path="/provider-register" element={<ServiceProviderRegister />} />
        <Route path="/provider/register" element={<ServiceProviderRegister />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="moderation" element={<ServiceModeration />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="providers" element={<ProviderRequests />} />
          </Route>
        </Route>

        <Route path="/provider" element={<ProviderRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="manage-services" element={<ManageServices />} />
            <Route path="edit-service/:id" element={<EditService />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="analytics" element={<ProviderAnalytics />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;