import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const navItems = [
  {
    group: 'Main',
    items: [
      { to: '/provider/dashboard',        icon: '🏠', label: 'Dashboard' },
      { to: '/provider/add-service',      icon: '➕', label: 'Add Service' },
      { to: '/provider/manage-services',  icon: '🛠️', label: 'Manage Services' },
    ],
  },
  {
    group: 'Bookings',
    items: [
      { to: '/provider/appointments',     icon: '📅', label: 'Appointments' },
    ],
  },
  {
    group: 'Insights',
    items: [
      { to: '/provider/analytics',        icon: '📊', label: 'Analytics' },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [providerData, setProviderData] = useState({
    name: 'Service Provider',
    role: 'Provider',
    avatar: 'SP',
  });

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/provider/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon">🔧</div>
        <div>
          <div className="sidebar-logo-text">ServicePro</div>
          <div className="sidebar-logo-sub">Provider Portal</div>
        </div>
      </Link>

      {/* Provider Profile */}
      <div className="sidebar-profile">
        <div className="avatar avatar-md">
          {providerData.avatar}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{providerData.name}</div>
          <div className="sidebar-profile-role">{providerData.role}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="sidebar-section-label">{group.group}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-nav-item${isActive ? ' active' : ''}`
                }
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="sidebar-nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-item">
          <span className="sidebar-nav-icon">⚙️</span>
          <span>Settings</span>
        </div>
        <div className="sidebar-footer-item logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <span className="sidebar-nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
