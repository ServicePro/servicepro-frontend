import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/provider/dashboard':       { title: 'Dashboard',        breadcrumb: 'Home / Dashboard' },
  '/provider/add-service':     { title: 'Add Service',      breadcrumb: 'Services / Add New' },
  '/provider/manage-services': { title: 'Manage Services',  breadcrumb: 'Services / Manage' },
  '/provider/edit-service':    { title: 'Edit Service',     breadcrumb: 'Services / Edit' },
  '/provider/appointments':    { title: 'Appointments',     breadcrumb: 'Bookings / Appointments' },
  '/provider/analytics':       { title: 'Analytics',        breadcrumb: 'Insights / Analytics' },
};

// Mock provider data
const providerData = {
  name: 'Alex Johnson',
  avatar: 'AJ',
};

const Layout = () => {
  const location = useLocation();
  const matchKey = Object.keys(pageTitles).find(
    (k) => location.pathname.startsWith(k)
  );
  const pageInfo = pageTitles[matchKey] || { title: 'ServicePro', breadcrumb: '' };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        {/* Top Header */}
        <header className="header">
          <div className="header-left">
            <span className="header-title">{pageInfo.title}</span>
            <span className="header-breadcrumb">{pageInfo.breadcrumb}</span>
          </div>

          <div className="header-right">
            {/* Notification bell */}
            <button className="header-notification-btn" title="Notifications">
              🔔
              <span className="notif-dot"></span>
            </button>

            {/* Provider info */}
            <div className="header-user">
              <div className="avatar avatar-sm">{providerData.avatar}</div>
              <div>
                <div className="header-user-name">{providerData.name}</div>
                <div className="header-user-role">Service Provider</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content rendered by router */}
        <main className="page-content fade-in-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
