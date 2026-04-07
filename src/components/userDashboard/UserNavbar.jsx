import { Bell, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLang } from "../../context/LangContext";
import "./UserNavbar.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserNavbar = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const moreRef    = useRef(null);

  const { lang, setLang, t } = useLang();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("sp_dark") === "true"
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [unreadThreads, setUnreadThreads] = useState([]);
  const notifRef = useRef(null);

  const [user] = useState(() => {
    const fallback = {
      name: "User",
      email: "",
      role: "User",
      avatar: `https://ui-avatars.com/api/?name=User&background=F97316&color=fff`,
    };
    if (typeof window === "undefined") return fallback;
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return fallback;
      const parsed = JSON.parse(savedUser);
      return {
        ...fallback,
        ...parsed,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.name || "User")}&background=F97316&color=fff`,
      };
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("sp_dark", darkMode);
  }, [darkMode]);

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

  // Fetch unread message counts — runs on mount and every 30 s
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
      // silently ignore — navbar should never break on error
    }
  };

  useEffect(() => {
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
  };

  return (
    <nav className="user-navbar">
      <div className="nav-container">

        {/* LEFT */}
        <div className="nav-left">
          <button className="brand" onClick={() => navigate("/")}>
            <img src="/videos/logo.png" alt="ServicePro logo" className="brand-logo" />
            <span className="brand-title">ServicePro</span>
          </button>

          {/* Desktop links */}
          <div className="nav-links">
            <Link to="/user-dashboard">{t.navHome}</Link>
            <Link to="/services">{t.navServices}</Link>
            <Link to="/service-history">{t.navHistory}</Link>
            <Link to="/reviews">{t.navReviews}</Link>
            <Link to="/service-history" state={{ tab: 'Payment History' }}>{t.navPayments}</Link>
            <Link to="/chat">{t.navMessages}</Link>

            {/* More dropdown — click-toggled */}
            <div className="nav-more-wrap" ref={moreRef}>
              <button
                className={`nav-more-btn${moreOpen ? ' nav-more-btn-open' : ''}`}
                onClick={() => setMoreOpen((v) => !v)}
              >
                {t.navMore} {moreOpen ? '▴' : '▾'}
              </button>
              {moreOpen && (
                <div className="nav-more-dropdown">
                  <Link to="/subscription"      onClick={closeAll}>{t.moreSubscription}</Link>
                  <Link to="/emergency"          onClick={closeAll}>{t.moreEmergency}</Link>
                  <Link to="/video-consultation" onClick={closeAll}>{t.moreVideo}</Link>
                  <Link to="/vr-preview"         onClick={closeAll}>{t.moreVR}</Link>
                  <Link to="/support"            onClick={closeAll}>{t.moreSupport}</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* Language selector */}
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

          {/* Dark / Light toggle */}
          <button
            className="nav-icon-btn"
            onClick={() => setDarkMode((v) => !v)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notification Bell */}
          <div className="nav-notif-wrap" ref={notifRef}>
            <button
              className="nav-notif-btn"
              onClick={() => { setNotifOpen((v) => !v); if (!notifOpen) fetchUnread(); }}
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
                        <div className="nav-notif-avatar">
                          {(th.providerName || 'P')[0].toUpperCase()}
                        </div>
                        <div className="nav-notif-body">
                          <p className="nav-notif-name">{th.providerName || 'Provider'}</p>
                          <p className="nav-notif-preview">{th.lastMessage || 'New message'}</p>
                          <p className="nav-notif-time">
                            {th.lastMessageAt ? new Date(th.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Open profile details"
            >
              <img src={user.avatar} alt={user.name} />
              <span>{user.name.split(" ")[0]}</span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img src={user.avatar} alt={user.name} />
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <Link to="/profile"   onClick={() => setProfileOpen(false)}>{t.profileView}</Link>
                  <Link to="/settings"  onClick={() => setProfileOpen(false)}>{t.profileSettings}</Link>
                  <button onClick={handleLogout}>{t.profileLogout}</button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down menu ─────────────────────────── */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <Link to="/user-dashboard"     onClick={closeAll}>🏠 {t.navHome}</Link>
          <Link to="/services"           onClick={closeAll}>🛠️ {t.navServices}</Link>
          <Link to="/service-history"    onClick={closeAll}>📋 {t.navHistory}</Link>
          <Link to="/reviews"            onClick={closeAll}>⭐ {t.navReviews}</Link>
          <Link to="/service-history"    onClick={closeAll}>💳 {t.navPayments}</Link>
          <Link to="/chat"               onClick={closeAll}>💬 {t.navMessages}</Link>
          <div className="nav-mobile-divider">{t.navMore}</div>
          <Link to="/subscription"       onClick={closeAll}>{t.moreSubscription}</Link>
          <Link to="/emergency"          onClick={closeAll}>{t.moreEmergency}</Link>
          <Link to="/video-consultation" onClick={closeAll}>{t.moreVideo}</Link>
          <Link to="/vr-preview"         onClick={closeAll}>{t.moreVR}</Link>
          <Link to="/support"            onClick={closeAll}>{t.moreSupport}</Link>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
