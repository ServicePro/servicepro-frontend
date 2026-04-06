import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

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

const Sidebar = ({ onToggleTheme, onOpenProfile, currentTheme, providerData }) => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fallback defaults if props are not yet loaded
  const fallbackData = providerData || {
    name: 'Service Provider',
    role: 'Provider',
    avatar: 'SP',
  };

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
          {fallbackData.avatar}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{fallbackData.name}</div>
          <div className="sidebar-profile-role">{fallbackData.role}</div>
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
        <div style={{ position: 'relative' }}>
          <div className="sidebar-footer-item" onClick={() => setIsSettingsOpen(!isSettingsOpen)} style={{ cursor: 'pointer' }}>
            <span className="sidebar-nav-icon">⚙️</span>
            <span>Settings</span>
          </div>

          {isSettingsOpen && (
            <div className="settings-dropdown">
              <div className="settings-dropdown-item" onClick={() => { onToggleTheme?.(); setIsSettingsOpen(false); }}>
                <span className="sidebar-nav-icon">{currentTheme === 'dark' ? '☀️' : '🌙'}</span>
                <span>{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div className="settings-dropdown-item" onClick={() => { onOpenProfile?.(); setIsSettingsOpen(false); }}>
                <span className="sidebar-nav-icon">👤</span>
                <span>Update Profile</span>
              </div>
            </div>
          )}
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
