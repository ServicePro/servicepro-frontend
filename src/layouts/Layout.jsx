import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SERVICE_CATEGORY_OPTIONS } from '../constants/serviceCategories';
import { applyGlobalTheme, emitThemeChange, getInitialDarkMode, onThemeChange } from '../utils/themeMode';
import Sidebar from './Sidebar';

const pageTitles = {
  '/provider/dashboard': { title: 'Dashboard', breadcrumb: 'Home / Dashboard' },
  '/provider/add-service': { title: 'Add Service', breadcrumb: 'Services / Add New' },
  '/provider/manage-services': { title: 'Manage Services', breadcrumb: 'Services / Manage' },
  '/provider/edit-service': { title: 'Edit Service', breadcrumb: 'Services / Edit' },
  '/provider/bookings':     { title: 'Booking Requests', breadcrumb: 'Bookings / Requests' },
  '/provider/appointments': { title: 'Appointments', breadcrumb: 'Bookings / Appointments' },
  '/provider/analytics': { title: 'Analytics', breadcrumb: 'Insights / Analytics' },
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matchKey = Object.keys(pageTitles).find((k) => location.pathname.startsWith(k));
  const pageInfo = pageTitles[matchKey] || { title: 'ServicePro', breadcrumb: '' };

  const initializeProviderData = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || 'Service Provider',
          role: user.role === 'provider' ? 'Service Provider' : 'Provider',
          avatar: (user.name || 'S').charAt(0).toUpperCase(),
          phone: user.phone || '',
          category: user.category || 'Other',
          profileImage: user.profile_image || '',
        };
      }
    } catch (err) {
      console.error('Error fetching user data from local storage', err);
    }

    return {
      name: 'Service Provider',
      role: 'Provider',
      avatar: 'SP',
      phone: '',
      category: '',
      profileImage: '',
    };
  };

  const [providerData, setProviderData] = useState(initializeProviderData);
  const [theme, setTheme] = useState(getInitialDarkMode() ? 'dark' : 'light');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', category: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ── Notification bell state ──────────────────────────────────
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  // Track which IDs were already shown when the bell was last opened (session only)
  const shownRef = useRef(new Set());

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [bookRes, emergRes, consultRes, chatRes] = await Promise.allSettled([
        axios.get(`${API}/api/bookings/provider/all?status=PENDING`, { headers }),
        axios.get(`${API}/api/emergency/for-provider`, { headers }),
        axios.get(`${API}/api/consultations/provider`, { headers }),
        axios.get(`${API}/api/chat/threads`, { headers }),
      ]);

      const bookings   = bookRes.status   === 'fulfilled' ? (bookRes.value.data?.data   || []) : [];
      const emergency  = emergRes.status  === 'fulfilled' ? (emergRes.value.data?.data  || []) : [];
      const consults   = consultRes.status === 'fulfilled' ? (consultRes.value.data?.data || []) : [];
      const threads    = chatRes.status   === 'fulfilled' ? (chatRes.value.data?.data   || []) : [];

      const items = [
        ...bookings.map(b => ({
          id:   `book_${b._id}`,
          type: 'booking',
          icon: '📋',
          title: 'New Booking Request',
          sub:  `${b.userId?.name || 'A client'} — ${b.serviceId?.name || 'your service'}`,
          time: b.createdAt,
          link: '/provider/bookings',
          tag:  'Pending',
          tagColor: { bg: '#fef3c7', txt: '#92400e' },
        })),
        ...emergency.filter(e => ['pending', 'assigned'].includes(e.status)).map(e => ({
          id:   `emrg_${e._id}`,
          type: 'emergency',
          icon: '🚨',
          title: 'Emergency Request',
          sub:  `${e.serviceType?.replace(/_/g, ' ') || 'Service'} — ${e.urgency || 'high'} urgency`,
          time: e.createdAt,
          link: '/provider/emergency-requests',
          tag:  'Urgent',
          tagColor: { bg: '#fee2e2', txt: '#991b1b' },
        })),
        ...consults.filter(c => c.providerStatus === 'pending').map(c => ({
          id:   `cons_${c._id}`,
          type: 'consultation',
          icon: '💬',
          title: 'Consultation Request',
          sub:  `${c.userId?.name || 'A client'} requested a consultation`,
          time: c.createdAt,
          link: '/provider/consultations',
          tag:  'New',
          tagColor: { bg: '#dbeafe', txt: '#1d4ed8' },
        })),
        ...threads.filter(t => (t.unreadCountProvider || 0) > 0).map(t => ({
          id:   `chat_${t._id}`,
          type: 'chat',
          icon: '💬',
          title: 'New Message',
          sub:  `${t.userId?.name || 'A client'} sent you a message`,
          time: t.updatedAt,
          link: '/provider/chat',
          tag:  `${t.unreadCountProvider}`,
          tagColor: { bg: '#d1fae5', txt: '#065f46' },
        })),
      ].sort((a, b) => new Date(b.time) - new Date(a.time));

      setNotifications(items);
    } catch { /* silent */ }
  }, [API]);

  // New = any item whose ID isn't in shownRef (i.e., appeared since last bell open)
  const newCount = notifications.filter(n => !shownRef.current.has(n.id)).length;

  const handleBellClick = () => {
    if (!notifOpen) {
      fetchNotifications();
      setNotifOpen(true);
    } else {
      // Mark all currently shown as "seen"
      notifications.forEach(n => shownRef.current.add(n.id));
      setNotifOpen(false);
    }
  };

  const handleNotifItemClick = (link) => {
    notifications.forEach(n => shownRef.current.add(n.id));
    setNotifOpen(false);
    navigate(link);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const isDark = theme === 'dark';
    applyGlobalTheme(isDark);
    emitThemeChange(isDark);
  }, [theme]);

  useEffect(() => onThemeChange((isDark) => setTheme(isDark ? 'dark' : 'light')), []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const syncProviderData = () => setProviderData(initializeProviderData());
    window.addEventListener('provider-profile-updated', syncProviderData);
    return () => window.removeEventListener('provider-profile-updated', syncProviderData);
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleOpenProfile = () => {
    setProfileForm({
      name: providerData.name,
      phone: providerData.phone || '',
      category: providerData.category || '',
    });
    setIsProfileModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/providers/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        category: profileForm.category,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const newAvatar = (profileForm.name || 'S').charAt(0).toUpperCase();
        setProviderData((prev) => ({
          ...prev,
          name: profileForm.name,
          phone: profileForm.phone,
          category: profileForm.category,
          avatar: newAvatar,
          profileImage: response.data?.data?.provider?.profile_image || prev.profileImage,
        }));

        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.name = profileForm.name;
          user.phone = profileForm.phone;
          user.category = profileForm.category;
          user.profile_image = response.data?.data?.provider?.profile_image || user.profile_image || '';
          localStorage.setItem('user', JSON.stringify(user));
        }

        setIsProfileModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile in the database. Please try again.');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <span className="header-title">{pageInfo.title}</span>
            <span className="header-breadcrumb">{pageInfo.breadcrumb}</span>
          </div>

          <div className="header-right">
            {/* ── Notification Bell ── */}
            <div className="admin-notif-wrap" ref={notifRef}>
              <button
                className="header-notification-btn"
                title="Notifications"
                onClick={handleBellClick}
              >
                🔔
                {newCount > 0 && (
                  <span className="admin-notif-badge">{newCount > 9 ? '9+' : newCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="admin-notif-dropdown">
                  <div className="admin-notif-header">
                    <strong>Notifications</strong>
                    {notifications.length > 0 && (
                      <span className="admin-notif-count">{notifications.length} active</span>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="admin-notif-empty">No new notifications</div>
                  ) : (
                    <div className="admin-notif-list">
                      {notifications.slice(0, 8).map(n => (
                        <button
                          key={n.id}
                          className="admin-notif-item"
                          onClick={() => handleNotifItemClick(n.link)}
                        >
                          <div
                            className="admin-notif-avatar"
                            style={{ background: n.tagColor.bg, color: n.tagColor.txt, fontSize: '1.1rem' }}
                          >
                            {n.icon}
                          </div>
                          <div className="admin-notif-body">
                            <p className="admin-notif-name">{n.title}</p>
                            <p className="admin-notif-sub">{n.sub}</p>
                          </div>
                          <span
                            className="admin-notif-new"
                            style={{ background: n.tagColor.bg, color: n.tagColor.txt }}
                          >
                            {n.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    className="admin-notif-footer"
                    onClick={() => { notifications.forEach(n => shownRef.current.add(n.id)); setNotifOpen(false); navigate('/provider/bookings'); }}
                  >
                    View All Requests →
                  </button>
                </div>
              )}
            </div>

            <div
              className="header-user"
              ref={dropdownRef}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <div className="avatar avatar-sm">
                {providerData.profileImage ? (
                  <img src={providerData.profileImage.startsWith('http') ? providerData.profileImage : `http://localhost:5000${providerData.profileImage.startsWith('/') ? providerData.profileImage : `/${providerData.profileImage}`}`} alt={providerData.name} className="avatar-image" />
                ) : (
                  providerData.avatar
                )}
              </div>
              <div>
                <div className="header-user-name">{providerData.name}</div>
                <div className="header-user-role">{providerData.role}</div>
              </div>

              {dropdownOpen && (
                <div className="header-user-menu">
                  <div className="header-user-menu-head">
                    <div className="header-user-menu-name">{providerData.name}</div>
                    <div className="header-user-menu-role">{providerData.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/provider/view-profile');
                    }}
                    className="header-user-menu-btn"
                  >
                    👤 View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="header-user-menu-btn danger"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="page-content fade-in-up">
          <Outlet />
        </main>
      </div>

      {isProfileModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Update Profile</h3>
              <button className="profile-modal-close" onClick={() => setIsProfileModalOpen(false)}>×</button>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={profileForm.category}
                onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
              >
                <option value="">Select a category</option>
                {SERVICE_CATEGORY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="profile-modal-footer">
              <button className="btn btn-secondary_1" onClick={() => setIsProfileModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary_1" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
