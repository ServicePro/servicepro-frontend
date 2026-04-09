import axios from "axios";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import { applyGlobalTheme, emitThemeChange, getInitialDarkMode, onThemeChange } from "../../utils/themeMode";
import { getStoredUser, resolveUserAvatar } from "../../utils/userPresentation";
import "./UserNavbar.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const moreRef = useRef(null);
  const notifRef = useRef(null);

  const { lang, setLang, t } = useLang();

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadThreads, setUnreadThreads] = useState([]);

  const [user] = useState(() => getStoredUser() || { name: "User", email: "", role: "User" });
  const avatarUrl = resolveUserAvatar(user);
  const hasRealAvatar = !!(user?.avatar_url || user?.avatar);
  const initials = (user?.name || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  useEffect(() => {
    applyGlobalTheme(darkMode);
    emitThemeChange(darkMode);
  }, [darkMode]);

  useEffect(() => onThemeChange(setDarkMode), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnread = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API}/api/chat/threads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const threads = res.data?.data || [];
      setUnreadThreads(threads.filter((th) => (th.unreadCountUser || 0) > 0));
    } catch {
      setUnreadThreads([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeAll = () => {
    setMoreOpen(false);
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  };

  const isPaymentsState = location.pathname === "/service-history" && location.state?.tab === "Payment History";
  const isMoreActive = ["/subscription", "/emergency", "/video-consultation", "/support"].includes(location.pathname);
  const navLinkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="user-navbar">
      <div className="nav-container">
        <div className="nav-left">
          <button className="brand" onClick={() => navigate("/")}>
            <img src="/videos/logo.png" alt="ServicePro logo" className="brand-logo" />
            <span className="brand-title">ServicePro</span>
          </button>

          {/* Desktop links */}
          <div className="nav-links">
            <NavLink to="/user-dashboard" className={navLinkClass}>{t.navHome}</NavLink>
            <NavLink to="/services" className={navLinkClass}>{t.navServices}</NavLink>
            <NavLink to="/service-history" className={() => (location.pathname === "/service-history" && !isPaymentsState ? "active" : "")}>{t.navHistory}</NavLink>
            <NavLink to="/reviews" className={navLinkClass}>{t.navReviews}</NavLink>
            <NavLink to="/service-history" state={{ tab: "Payment History" }} className={() => (isPaymentsState ? "active" : "")}>{t.navPayments}</NavLink>
            <NavLink to="/chat" className={navLinkClass}>{t.navMessages}</NavLink>

            <div className="nav-more-wrap" ref={moreRef}>
              <button
                className={`nav-more-btn${moreOpen || isMoreActive ? " nav-more-btn-open" : ""}`}
                onClick={() => setMoreOpen((v) => !v)}
              >
                {t.navMore} {moreOpen ? "▴" : "▾"}
              </button>
              {moreOpen && (
                <div className="nav-more-dropdown">
                  <NavLink to="/subscription" onClick={closeAll} className={navLinkClass}>{t.moreSubscription}</NavLink>
                  <NavLink to="/emergency" onClick={closeAll} className={navLinkClass}>{t.moreEmergency}</NavLink>
                  <NavLink to="/video-consultation" onClick={closeAll} className={navLinkClass}>{t.moreVideo}</NavLink>
                  <NavLink to="/support" onClick={closeAll} className={navLinkClass}>{t.moreSupport}</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="nav-right">
          <select
            className="nav-lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select language"
          >
            <option value="EN">EN</option>
            <option value="TA">த</option>
            <option value="SI">සි</option>
          </select>

          <button
            className="nav-icon-btn"
            onClick={() => setDarkMode((v) => !v)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="nav-notif-wrap" ref={notifRef}>
            <button
              className="nav-notif-btn"
              onClick={() => {
                setNotifOpen((v) => !v);
                if (!notifOpen) fetchUnread();
              }}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadThreads.length > 0 && (
                <span className="nav-notif-badge">{unreadThreads.length}</span>
              )}
            </button>

            {notifOpen && (
              <div className="nav-notif-dropdown">
                <div className="nav-notif-header">
                  <strong>{t.notifTitle}</strong>
                  {unreadThreads.length > 0 && (
                    <span className="nav-notif-count">{unreadThreads.length} {t.notifUnread}</span>
                  )}
                </div>
                {unreadThreads.length === 0 ? (
                  <div className="nav-notif-empty">{t.notifNone}</div>
                ) : (
                  <div className="nav-notif-list">
                    {unreadThreads.map((th) => (
                      <Link
                        key={th._id}
                        to={`/chat?threadId=${th._id}`}
                        className="nav-notif-item"
                        onClick={() => setNotifOpen(false)}
                      >
                        <div className="nav-notif-avatar">{(th.providerName || "P")[0].toUpperCase()}</div>
                        <div className="nav-notif-body">
                          <p className="nav-notif-name">{th.providerName || "Provider"}</p>
                          <p className="nav-notif-preview">{th.lastMessage || "New message"}</p>
                          <p className="nav-notif-time">
                            {th.lastMessageAt ? new Date(th.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                          </p>
                        </div>
                        <span className="nav-notif-unread-dot">{th.unreadCountUser}</span>
                      </Link>
                    ))}
                  </div>
                )}
                <Link to="/chat" className="nav-notif-footer" onClick={() => setNotifOpen(false)}>
                  {t.notifViewAll}
                </Link>
              </div>
            )}
          </div>

          <div className="profile" ref={profileRef}>
            <button
              className="profile-trigger"
              onClick={() => {
                setNotifOpen(false);
                setProfileOpen((prev) => !prev);
              }}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
            >
              {hasRealAvatar ? (
                <img src={avatarUrl} alt={user.name} />
              ) : (
                <div className="profile-initials">{initials}</div>
              )}
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  {hasRealAvatar ? (
                    <img src={avatarUrl} alt={user.name} />
                  ) : (
                    <div className="profile-initials profile-initials-lg">{initials}</div>
                  )}
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <Link to="/view-profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>👤 {t.profileView}</Link>
                  <Link to="/account-settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>⚙️ {t.profileSettings}</Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>🚪 {t.profileLogout}</button>
                </div>
              </div>
            )}
          </div>

          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-menu">
          <NavLink to="/user-dashboard" onClick={closeAll} className={navLinkClass}>🏠 {t.navHome}</NavLink>
          <NavLink to="/services" onClick={closeAll} className={navLinkClass}>🛠️ {t.navServices}</NavLink>
          <NavLink to="/service-history" onClick={closeAll} className={() => (location.pathname === "/service-history" && !isPaymentsState ? "active" : "")}>📋 {t.navHistory}</NavLink>
          <NavLink to="/reviews" onClick={closeAll} className={navLinkClass}>⭐ {t.navReviews}</NavLink>
          <NavLink to="/service-history" state={{ tab: "Payment History" }} onClick={closeAll} className={() => (isPaymentsState ? "active" : "")}>💳 {t.navPayments}</NavLink>
          <NavLink to="/chat" onClick={closeAll} className={navLinkClass}>💬 {t.navMessages}</NavLink>
          <div className="nav-mobile-divider">{t.navMore}</div>
          <NavLink to="/subscription" onClick={closeAll} className={navLinkClass}>{t.moreSubscription}</NavLink>
          <NavLink to="/emergency" onClick={closeAll} className={navLinkClass}>{t.moreEmergency}</NavLink>
          <NavLink to="/video-consultation" onClick={closeAll} className={navLinkClass}>{t.moreVideo}</NavLink>
          <NavLink to="/support" onClick={closeAll} className={navLinkClass}>{t.moreSupport}</NavLink>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
