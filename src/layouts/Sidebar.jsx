import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// Mock provider data - replace with real auth context later
const providerData = {
  name: 'Alex Johnson',
  role: 'Service Provider',
  category: 'Home Repair & Plumbing',
  avatar: 'AJ',
  rating: 4.8,
};

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
      { to: '/provider/appointments',     icon: '📅', label: 'Appointments', badge: 3 },
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
          <div className="sidebar-profile-role">Service Provider</div>
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
        <div className="sidebar-footer-item logout">
          <span className="sidebar-nav-icon">🚪</span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
