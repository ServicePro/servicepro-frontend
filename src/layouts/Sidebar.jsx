import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const navItems = [
  {
    group: 'Main',
    items: [
      { to: '/provider/dashboard', icon: '🏠', label: 'Dashboard' },
      { to: '/provider/add-service', icon: '➕', label: 'Add Service' },
      { to: '/provider/manage-services', icon: '🛠️', label: 'Manage Services' },
    ],
  },
  {
    group: 'Bookings',
    items: [
      { to: '/provider/appointments', icon: '📅', label: 'Appointments' },
      { to: '/provider/emergency-requests', icon: '🚨', label: 'Emergency Requests', badgeKey: 'emergency' },
      { to: '/provider/consultations', icon: '🎥', label: 'Video Consultations', badgeKey: 'consultations' },
    ],
  },
  {
    group: 'Insights',
    items: [
      { to: '/provider/analytics', icon: '📊', label: 'Analytics' },
    ],
  },
  {
    group: 'Communications',
    items: [
      { to: '/provider/chat', icon: '💬', label: 'Messages', badgeKey: 'messages' },
    ],
  },
  {
    group: 'Communications',
    items: [
      { to: '/provider/chat',             icon: '💬', label: 'Messages', badgeKey: 'messages' },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [badges, setBadges] = useState({ messages: 0, emergency: 0, consultations: 0 });

  const fallbackData = providerData || {
    name: 'Service Provider',
    role: 'Provider',
    avatar: 'SP',
  });
  const [badges, setBadges] = useState({ messages: 0, emergency: 0, consultations: 0 });

  const fetchBadges = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [chatRes, emergRes, consultRes] = await Promise.allSettled([
        axios.get(`${API}/api/chat/threads`,           { headers }),
        axios.get(`${API}/api/emergency/for-provider`, { headers }),
        axios.get(`${API}/api/consultations/provider`, { headers }),
      ]);

      const threads = chatRes.status === 'fulfilled' ? (chatRes.value.data?.data || []) : [];
      const emergency = emergRes.status === 'fulfilled' ? (emergRes.value.data?.data || []) : [];
      const consult = consultRes.status === 'fulfilled' ? (consultRes.value.data?.data || []) : [];

      setBadges({
        messages:      threads.filter((t) => (t.unreadCountProvider || 0) > 0).length,
        emergency:     emergency.filter((r) => r.status === 'pending').length,
        consultations: consult.filter((s) => s.providerStatus === 'pending').length,
      });
    } catch {
      // silently ignore — sidebar should never crash on errors
    }
  }, []);

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [fetchBadges]);

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

  const fetchBadges = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [chatRes, emergRes, consultRes] = await Promise.allSettled([
        axios.get(`${API}/api/chat/threads`, { headers }),
        axios.get(`${API}/api/emergency/for-provider`, { headers }),
        axios.get(`${API}/api/consultations/provider`, { headers }),
      ]);

      const threads = chatRes.status === 'fulfilled' ? (chatRes.value.data?.data || []) : [];
      const emergency = emergRes.status === 'fulfilled' ? (emergRes.value.data?.data || []) : [];
      const consult = consultRes.status === 'fulfilled' ? (consultRes.value.data?.data || []) : [];

      setBadges({
        messages: threads.filter((t) => (t.unreadCountProvider || 0) > 0).length,
        emergency: emergency.filter((r) => r.status === 'pending').length,
        consultations: consult.filter((s) => s.providerStatus === 'pending').length,
      });
    } catch {
      setBadges({ messages: 0, emergency: 0, consultations: 0 });
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(() => {
      fetchBadges();
    }, 0);

    const interval = setInterval(fetchBadges, 30000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [fetchBadges]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <Link to="/provider/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon">SP</div>
        <div className="sidebar-logo-copy">
          <div className="sidebar-logo-text">ServicePro</div>
        </div>
      </Link>

      <div className="sidebar-profile">
        <div className="avatar avatar-md">
          {fallbackData.profileImage ? (
            <img src={fallbackData.profileImage.startsWith('http') ? fallbackData.profileImage : `${API}${fallbackData.profileImage.startsWith('/') ? fallbackData.profileImage : `/${fallbackData.profileImage}`}`} alt={fallbackData.name} className="avatar-image" />
          ) : (
            fallbackData.avatar
          )}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{providerData.name}</div>
          <div className="sidebar-profile-role">{providerData.role}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.group}>
            <div className="sidebar-section-label">{group.group}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badgeKey && badges[item.badgeKey] > 0 && (
                  <span className="sidebar-nav-badge">{badges[item.badgeKey]}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ position: 'relative' }}>
          <div
            className="sidebar-footer-item"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            style={{ cursor: 'pointer' }}
          >
            <span className="sidebar-nav-icon">⚙️</span>
            <span>Settings</span>
          </div>

          {isSettingsOpen && (
            <div className="settings-dropdown">
              <div
                className="settings-dropdown-item"
                onClick={() => {
                  onToggleTheme?.();
                  setIsSettingsOpen(false);
                }}
              >
                <span className="sidebar-nav-icon">{currentTheme === 'dark' ? '☀️' : '🌙'}</span>
                <span>{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <div
                className="settings-dropdown-item"
                onClick={() => {
                  onOpenProfile?.();
                  setIsSettingsOpen(false);
                }}
              >
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
