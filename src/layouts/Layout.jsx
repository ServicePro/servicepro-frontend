import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/provider/dashboard':       { title: 'Dashboard',        breadcrumb: 'Home / Dashboard' },
  '/provider/add-service':     { title: 'Add Service',      breadcrumb: 'Services / Add New' },
  '/provider/manage-services': { title: 'Manage Services',  breadcrumb: 'Services / Manage' },
  '/provider/edit-service':    { title: 'Edit Service',     breadcrumb: 'Services / Edit' },
  '/provider/appointments':    { title: 'Appointments',     breadcrumb: 'Bookings / Appointments' },
  '/provider/analytics':       { title: 'Analytics',        breadcrumb: 'Insights / Analytics' },
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matchKey = Object.keys(pageTitles).find(
    (k) => location.pathname.startsWith(k)
  );
  const pageInfo = pageTitles[matchKey] || { title: 'ServicePro', breadcrumb: '' };

  const [providerData, setProviderData] = useState({
    name: 'Service Provider',
    role: 'Provider',
    avatar: 'SP',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setProviderData({
          name: user.name || 'Service Provider',
          role: user.role === 'provider' ? 'Service Provider' : 'Provider',
          avatar: (user.name || 'S').charAt(0).toUpperCase(),
        });
      }
    } catch (err) {
      console.error('Error fetching user data from local storage', err);
    }
  }, []);

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
            <div className="header-user" ref={dropdownRef} style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <div className="avatar avatar-sm">{providerData.avatar}</div>
              <div>
                <div className="header-user-name">{providerData.name}</div>
                <div className="header-user-role">{providerData.role}</div>
              </div>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: '#fff', border: '1px solid #e5e7eb',
                  borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  minWidth: '180px', zIndex: 999, overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{providerData.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{providerData.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '11px 16px', background: 'none',
                      border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                      color: '#ef4444', fontWeight: 600, textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
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
