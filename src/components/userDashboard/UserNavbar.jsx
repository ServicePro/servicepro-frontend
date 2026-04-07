import axios from "axios";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
import { applyGlobalTheme, emitThemeChange, getInitialDarkMode, onThemeChange } from "../../utils/themeMode";
import { getStoredUser, resolveUserAvatar } from "../../utils/userPresentation";
import "./UserNavbar.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserNavbar = () => {
  const navigate = useNavigate();
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

  return (
    <nav className="user-navbar">
      <div className="nav-container">
        <div className="nav-left">
          <button className="brand" onClick={() => navigate("/")}>
            <img src="/videos/logo.png" alt="ServicePro logo" className="brand-logo" />
            <span className="brand-title">ServicePro</span>
          </button>

          <div className="nav-links">
            <Link to="/user-dashboard">{t.navHome}</Link>
            <Link to="/services">{t.navServices}</Link>
            <Link to="/service-history">{t.navHistory}</Link>
            <Link to="/reviews">{t.navReviews}</Link>
            <Link to="/service-history" state={{ tab: "Payment History" }}>{t.navPayments}</Link>
            <Link to="/chat">{t.navMessages}</Link>

            <div className="nav-more-wrap" ref={moreRef}>
              <button
                className={`nav-more-btn${moreOpen ? " nav-more-btn-open" : ""}`}
                onClick={() => setMoreOpen((v) => !v)}
              >
                {t.navMore} {moreOpen ? "▴" : "▾"}
              </button>
              {moreOpen && (
                <div className="nav-more-dropdown">
                  <Link to="/subscription" onClick={closeAll}>{t.moreSubscription}</Link>
                  <Link to="/emergency" onClick={closeAll}>{t.moreEmergency}</Link>
                  <Link to="/video-consultation" onClick={closeAll}>{t.moreVideo}</Link>
                  <Link to="/vr-preview" onClick={closeAll}>{t.moreVR}</Link>
                  <Link to="/support" onClick={closeAll}>{t.moreSupport}</Link>
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
              <img src={avatarUrl} alt={user.name} />
              <span>{user.name?.split(" ")[0] || "Me"}</span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img src={avatarUrl} alt={user.name} />
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <Link to="/view-profile" onClick={() => setProfileOpen(false)}>{t.profileView}</Link>
                  <Link to="/account-settings" onClick={() => setProfileOpen(false)}>{t.profileSettings}</Link>
                  <button onClick={handleLogout}>{t.profileLogout}</button>
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
          <Link to="/user-dashboard" onClick={closeAll}>🏠 {t.navHome}</Link>
          <Link to="/services" onClick={closeAll}>🛠️ {t.navServices}</Link>
          <Link to="/service-history" onClick={closeAll}>📋 {t.navHistory}</Link>
          <Link to="/reviews" onClick={closeAll}>⭐ {t.navReviews}</Link>
          <Link to="/service-history" onClick={closeAll}>💳 {t.navPayments}</Link>
          <Link to="/chat" onClick={closeAll}>💬 {t.navMessages}</Link>
          <div className="nav-mobile-divider">{t.navMore}</div>
          <Link to="/subscription" onClick={closeAll}>{t.moreSubscription}</Link>
          <Link to="/emergency" onClick={closeAll}>{t.moreEmergency}</Link>
          <Link to="/video-consultation" onClick={closeAll}>{t.moreVideo}</Link>
          <Link to="/vr-preview" onClick={closeAll}>{t.moreVR}</Link>
          <Link to="/support" onClick={closeAll}>{t.moreSupport}</Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
