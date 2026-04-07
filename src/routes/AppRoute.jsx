import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProviderAnalytics from "../analytics/ProviderAnalytics";
import Appointments from "../appointments/Appointments";

import ComingSoon from "../pages/ComingSoon";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import LandingPage from "../pages/Landing/LandingPage";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import OAuthCallback from "../pages/OAuthCallback/OAuthCallback";
import ServiceProviderRegister from "../pages/ServiceproviderRegistration/serviceproviderregistration";
import Login from "../pages/UserLogin/userlogin";
import UserRegister from "../pages/UserRegister/userregister";
import Verify from "../pages/Verify/Verify";

import BookingConfirmation from "../pages/Booking/BookingConfirmation";
import BookingPage from "../pages/Booking/BookingPage";
import PaymentPage from "../pages/Booking/PaymentPage";
import RealTimeTracking from "../pages/Booking/RealTimeTracking";
import ChatPage from "../pages/Chat/ChatPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import EmergencyServices from "../pages/Emergency/EmergencyServices";
import ReviewsRatings from "../pages/Reviews/ReviewsRatings";
import ServiceHistory from "../pages/ServiceHistory/ServiceHistory";
import ServiceListing from "../pages/services/ServiceListing";
import SubscriptionLoyalty from "../pages/Subscription/SubscriptionLoyalty";
import Support from "../pages/Support/Support";
import AccountSettings from "../pages/UserDashboard/AccountSettings";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import DashboardUserProfile from "../pages/UserDashboard/UserProfile";
import UserProfile from "../pages/UserProfile/UserProfile";
import VideoConsultation from "../pages/VideoConsultation/VideoConsultation";
import VRPreview from "../pages/VRPreview/VRPreview";

import ProviderDashboard from "../dashboard/ProviderDashboard";
import Layout from "../layouts/Layout";
import ProviderConsultations from "../pages/ProviderConsultations/ProviderConsultations";
import ProviderEmergencyRequests from "../pages/ProviderEmergency/ProviderEmergencyRequests";
import ProviderViewProfile from "../pages/ProviderProfile/ProviderViewProfile";
import AddService from "../services/AddService";
import EditService from "../services/EditService";
import ManageServices from "../services/ManageServices";

import AdminLayout from "../layouts/AdminLayout";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";
import DashboardOverview from "../pages/Admin/DashboardOverview";
import ProviderRequests from "../pages/Admin/ProviderRequests";
import ServiceModeration from "../pages/Admin/ServiceModeration";
import UserManagement from "../pages/Admin/UserManagement";

import AdminRoute from "./AdminRoute";
import ProviderRoute from "./ProviderRoute";
import UserRoute from "./UserRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServiceListing />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/provider-register" element={<ServiceProviderRegister />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route element={<UserRoute />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/book/:serviceId" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="/tracking/:bookingId" element={<RealTimeTracking />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/service-history" element={<ServiceHistory />} />
          <Route path="/reviews" element={<ReviewsRatings />} />
          <Route path="/subscription" element={<SubscriptionLoyalty />} />
          <Route path="/emergency" element={<EmergencyServices />} />
          <Route path="/video-consultation" element={<VideoConsultation />} />
          <Route path="/vr-preview" element={<VRPreview />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<UserProfile />} />
          <Route path="/view-profile" element={<DashboardUserProfile />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/bookings" element={<ComingSoon title="My Bookings" description="View and manage your bookings" icon="📅" returnTo="/user-dashboard" />} />
          <Route path="/saved" element={<ComingSoon title="Saved Items" description="Your saved services and providers" icon="❤️" returnTo="/user-dashboard" />} />
        </Route>

        {/* Provider portal - protected by ProviderRoute */}
        <Route path="/provider" element={<ProviderRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"       element={<ProviderDashboard />} />
            <Route path="add-service"     element={<AddService />} />
            <Route path="manage-services" element={<ManageServices />} />
            <Route path="edit-service/:id" element={<EditService />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="emergency-requests" element={<ProviderEmergencyRequests />} />
            <Route path="consultations" element={<ProviderConsultations />} />
            <Route path="analytics" element={<ProviderAnalytics />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="view-profile" element={<ProviderViewProfile />} />
          </Route>
        </Route>

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

        {/* Admin Portal - Protected by AdminRoute */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"  element={<DashboardOverview />} />
            <Route path="users"      element={<UserManagement />} />
            <Route path="moderation" element={<ServiceModeration />} />
            <Route path="analytics"  element={<AdminAnalytics />} />
            <Route path="providers"  element={<ProviderRequests />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
