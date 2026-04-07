import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const pageTitles = {
  '/admin/dashboard':       { title: 'Overview',           breadcrumb: 'Admin / Dashboard' },
  '/admin/users':           { title: 'User Management',    breadcrumb: 'Admin / Users' },
  '/admin/moderation':      { title: 'Service Moderation', breadcrumb: 'Admin / Moderation' },
  '/admin/analytics':       { title: 'Platform Analytics', breadcrumb: 'Admin / Reports' },
};

const AdminLayout = () => {
  const location = useLocation();
  const matchKey = Object.keys(pageTitles).find(
    (k) => location.pathname.startsWith(k)
  );
  const pageInfo = pageTitles[matchKey] || { title: 'Admin Portal', breadcrumb: '' };

  const [adminData, setAdminData] = useState({
    name: 'Admin',
    role: 'Administrator',
    avatar: 'A',
  });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setAdminData({
          name: user.name || 'System Admin',
          role: 'Platform Admin',
          avatar: (user.name || 'A').charAt(0).toUpperCase(),
        });
      }
    } catch (err) {
      console.error('Error fetching admin data from local storage', err);
    }
  }, []);

  return (
    <div className="app-layout">
      <AdminSidebar />

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
              <span className="notif-dot" style={{ backgroundColor: '#ef4444' }}></span>
            </button>

            {/* Admin info */}
            <div className="header-user">
              <div className="avatar avatar-sm" style={{ backgroundColor: '#4f46e5' }}>
                {adminData.avatar}
              </div>
              <div>
                <div className="header-user-name">{adminData.name}</div>
                <div className="header-user-role">{adminData.role}</div>
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

export default AdminLayout;
