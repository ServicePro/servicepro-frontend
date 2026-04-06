import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const navItems = [
  {
    group: 'Main',
    items: [
      { to: '/admin/dashboard',        icon: '🏠', label: 'Dashboard' },
      { to: '/admin/users',            icon: '👥', label: 'User Management' },
    ],
  },
  {
    group: 'Moderation',
    items: [
      { to: '/admin/moderation',       icon: '🛡️', label: 'Service Moderation' },
    ],
  },
  {
    group: 'Insights',
    items: [
      { to: '/admin/analytics',        icon: '📊', label: 'Reports & Analytics' },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: 'Admin',
    role: 'Administrator',
    avatar: 'AD',
  });

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/admin/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon">👑</div>
        <div>
          <div className="sidebar-logo-text">ServicePro</div>
          <div className="sidebar-logo-sub">Admin Portal</div>
        </div>
      </Link>

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="avatar avatar-md" style={{ backgroundColor: '#4f46e5' }}>
          {adminData.avatar}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{adminData.name}</div>
          <div className="sidebar-profile-role">{adminData.role}</div>
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
          <span>Global Settings</span>
        </div>
        <div className="sidebar-footer-item logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <span className="sidebar-nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;