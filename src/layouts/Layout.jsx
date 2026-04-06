import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';

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
  const matchKey = Object.keys(pageTitles).find(
    (k) => location.pathname.startsWith(k)
  );
  const pageInfo = pageTitles[matchKey] || { title: 'ServicePro', breadcrumb: '' };

  const [providerData, setProviderData] = useState({
    name: 'Service Provider',
    role: 'Provider',
    avatar: 'SP',
    phone: '',
    category: ''
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', category: '' });
  });
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setProviderData({
          name: user.name || 'Service Provider',
          role: user.role === 'provider' ? 'Service Provider' : 'Provider',
          avatar: (user.name || 'S').charAt(0).toUpperCase(),
          phone: user.phone || '',
          category: user.category || 'Other'
        });
      }
    } catch (err) {
      console.error('Error fetching user data from local storage', err);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const handleOpenProfile = () => {
    setProfileForm({ 
       name: providerData.name, 
       phone: providerData.phone || '', 
       category: providerData.category || '' 
    });
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/providers/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        category: profileForm.category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const newAvatar = (profileForm.name || 'S').charAt(0).toUpperCase();
        setProviderData(prev => ({ 
           ...prev, 
           name: profileForm.name, 
           phone: profileForm.phone,
           category: profileForm.category,
           avatar: newAvatar 
        }));

        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.name = profileForm.name;
          user.phone = profileForm.phone;
          user.category = profileForm.category;
          // keeping user.role untouched
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
                <div className="header-user-role">{providerData.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content rendered by router */}
        <main className="page-content fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* Profile Update Modal */}
      {isProfileModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
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
                onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileForm.phone} 
                onChange={e => setProfileForm({...profileForm, phone: e.target.value})} 
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Category</label>
              <select 
                className="form-select" 
                value={profileForm.category} 
                onChange={e => setProfileForm({...profileForm, category: e.target.value})}
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
