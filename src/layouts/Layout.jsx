import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { applyGlobalTheme, emitThemeChange, getInitialDarkMode, onThemeChange } from '../utils/themeMode';
import Sidebar from './Sidebar';

const pageTitles = {
  '/provider/dashboard': { title: 'Dashboard', breadcrumb: 'Home / Dashboard' },
  '/provider/add-service': { title: 'Add Service', breadcrumb: 'Services / Add New' },
  '/provider/manage-services': { title: 'Manage Services', breadcrumb: 'Services / Manage' },
  '/provider/edit-service': { title: 'Edit Service', breadcrumb: 'Services / Edit' },
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
      <Sidebar onToggleTheme={toggleTheme} onOpenProfile={handleOpenProfile} currentTheme={theme} providerData={providerData} />

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <span className="header-title">{pageInfo.title}</span>
            <span className="header-breadcrumb">{pageInfo.breadcrumb}</span>
          </div>

          <div className="header-right">
            <button className="header-notification-btn" title="Notifications">
              🔔
              <span className="notif-dot"></span>
            </button>

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
                <option value="Cleaning">Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Home Repair">Home Repair</option>
                <option value="Other">Other</option>
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
