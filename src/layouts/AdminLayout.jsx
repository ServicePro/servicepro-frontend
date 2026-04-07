import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import adminApi from '../api/adminApi.jsx';

const pageTitles = {
  '/admin/dashboard':       { title: 'Overview',              breadcrumb: 'Admin / Dashboard' },
  '/admin/users':           { title: 'User Management',       breadcrumb: 'Admin / Users' },
  '/admin/moderation':      { title: 'Service Moderation',    breadcrumb: 'Admin / Moderation' },
  '/admin/analytics':       { title: 'Platform Analytics',    breadcrumb: 'Admin / Reports' },
  '/admin/providers':       { title: 'Provider Requests',     breadcrumb: 'Admin / Providers' },
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matchKey = Object.keys(pageTitles).find(
    (k) => location.pathname.startsWith(k)
  );
  const pageInfo = pageTitles[matchKey] || { title: 'Admin Portal', breadcrumb: '' };

  const [adminData, setAdminData] = useState({
    name: 'Admin',
    role: 'Administrator',
    avatar: 'A',
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Outside-click closes both dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Poll for pending provider registrations every 60 s
  const fetchPending = useCallback(async () => {
    try {
      const res = await adminApi.getPendingProviders();
      setPendingProviders(res.data || []);
    } catch {
      // silently ignore — layout should never break on error
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 60000);
    return () => clearInterval(interval);
  }, [fetchPending]);

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
            <div className="admin-notif-wrap" ref={notifRef}>
              <button
                className="header-notification-btn"
                title="Pending provider registrations"
                onClick={() => { setNotifOpen((v) => !v); if (!notifOpen) fetchPending(); }}
              >
                🔔
                {pendingProviders.length > 0 && (
                  <span className="admin-notif-badge">{pendingProviders.length}</span>
                )}
              </button>

              {notifOpen && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-header">
                    <strong>Provider Requests</strong>
                    {pendingProviders.length > 0 && (
                      <span className="admin-notif-count">
                        {pendingProviders.length} pending
                      </span>
                    )}
                  </div>

                  {pendingProviders.length === 0 ? (
                    <div className="admin-notif-empty">No pending registrations</div>
                  ) : (
                    <div className="admin-notif-list">
                      {pendingProviders.slice(0, 5).map((p) => (
                        <button
                          key={p._id}
                          className="admin-notif-item"
                          onClick={() => { setNotifOpen(false); navigate('/admin/providers'); }}
                        >
                          <div className="admin-notif-avatar">
                            {(p.name || 'P')[0].toUpperCase()}
                          </div>
                          <div className="admin-notif-body">
                            <p className="admin-notif-name">{p.name}</p>
                            <p className="admin-notif-sub">{p.category} · {p.area}</p>
                            <p className="admin-notif-time">
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                            </p>
                          </div>
                          <span className="admin-notif-new">New</span>
                        </button>
                      ))}
                      {pendingProviders.length > 5 && (
                        <p className="admin-notif-more">+{pendingProviders.length - 5} more</p>
                      )}
                    </div>
                  )}

                  <button
                    className="admin-notif-footer"
                    onClick={() => { setNotifOpen(false); navigate('/admin/providers'); }}
                  >
                    View all provider requests →
                  </button>
                </div>
              )}
            </div>

            {/* Admin profile */}
            <div className="admin-profile-wrap" ref={profileRef}>
              <button
                className="header-user"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Admin profile menu"
              >
                <div className="avatar avatar-sm" style={{ backgroundColor: '#4f46e5' }}>
                  {adminData.avatar}
                </div>
                <div>
                  <div className="header-user-name">{adminData.name}</div>
                  <div className="header-user-role">{adminData.role}</div>
                </div>
                <span className="admin-profile-chevron">{profileOpen ? '▴' : '▾'}</span>
              </button>

              {profileOpen && (
                <div className="admin-profile-dropdown">
                  <div className="admin-profile-info">
                    <div className="admin-profile-avatar" style={{ backgroundColor: '#4f46e5' }}>
                      {adminData.avatar}
                    </div>
                    <div>
                      <strong>{adminData.name}</strong>
                      <span>{adminData.role}</span>
                    </div>
                  </div>
                  <div className="admin-profile-actions">
                    <button
                      className="admin-profile-logout"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
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

export default AdminLayout;