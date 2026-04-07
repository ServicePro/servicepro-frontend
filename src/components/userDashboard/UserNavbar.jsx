import { BadgeCheck, Bell, Headset, Settings, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { getStoredUser, resolveUserAvatar } from "../../utils/userPresentation";
import "./UserNavbar.css";

const SEEN_NOTIFICATIONS_KEY = "user_seen_notifications";

const UserNavbar = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user] = useState(() => {
    const stored = getStoredUser();
    return stored || { name: "User", email: "", role: "User" };
  });

  const avatarUrl = resolveUserAvatar(user);

  const getSeenNotificationIds = () => {
    try {
      const raw = localStorage.getItem(SEEN_NOTIFICATIONS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const markNotificationsAsSeen = (items) => {
    const existing = new Set(getSeenNotificationIds());
    items.forEach((item) => existing.add(String(item.id)));
    localStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(Array.from(existing)));
  };

  const updateUnreadCount = (items) => {
    const seen = new Set(getSeenNotificationIds());
    const unread = items.filter((item) => !seen.has(String(item.id))).length;
    setUnreadCount(unread);
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await userApi.getNotifications();
      const list = res?.data?.notifications || res?.notifications || [];
      const normalized = Array.isArray(list) ? list : [];
      setNotifications(normalized);
      updateUnreadCount(normalized);
    } catch (error) {
      console.error("Failed to load notifications", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const formatRelativeTime = (dateValue) => {
    if (!dateValue) return "just now";
    const ts = new Date(dateValue).getTime();
    if (Number.isNaN(ts)) return "just now";

    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000);

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationToggle = () => {
    const nextOpen = !notificationOpen;
    setNotificationOpen(nextOpen);

    if (nextOpen) {
      setProfileOpen(false);
      markNotificationsAsSeen(notifications);
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/bookings">My Bookings</Link>
            <Link to="/reviews">Reviews</Link>
            <Link to="/saved">Saved</Link>
          </div>
        </div>

        {/* CENTER FEATURE STRIP */}
        <div className="nav-highlights" aria-label="Quick highlights">
          <div className="nav-highlight-chip">
            <BadgeCheck size={15} />
            <span>Verified Pros</span>
          </div>
          <div className="nav-highlight-chip">
            <Headset size={15} />
            <span>24/7 Support</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <div className="notification" ref={notificationRef}>
            <button
              type="button"
              className="notification-trigger"
              onClick={handleNotificationToggle}
              aria-label="Open notifications"
              aria-expanded={notificationOpen}
            >
              <Bell className="icon" size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>

            {notificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <strong>Notifications</strong>
                  <button type="button" onClick={fetchNotifications}>Refresh</button>
                </div>

                <div className="notification-list">
                  {loadingNotifications ? (
                    <div className="notification-empty">Loading updates...</div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-empty">No updates from providers yet.</div>
                  ) : (
                    notifications.map((item) => (
                      <div key={item.id} className={`notification-item type-${item.type || "info"}`}>
                        <p>{item.message}</p>
                        <span>{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="profile" ref={profileRef}>
            <button
              className="profile-trigger"
              onClick={() => {
                setNotificationOpen(false);
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
                  <Link
                    to="/view-profile"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <UserRound size={16} />
                    View Profile
                  </Link>
                  <Link
                    to="/account-settings"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Account Settings
                  </Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;