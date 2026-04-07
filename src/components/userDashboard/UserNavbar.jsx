import { Bell, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserNavbar.css";

const UserNavbar = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [user] = useState(() => {
    const fallback = {
      name: "John Doe",
      email: "johndoe@example.com",
      role: "User",
      avatar: "https://i.pravatar.cc/40",
    };

    if (typeof window === "undefined") return fallback;

    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return fallback;
      return { ...fallback, ...JSON.parse(savedUser) };
    } catch (error) {
      console.warn("Unable to parse stored user", error);
      return fallback;
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <Link to="/booking">Bookings</Link>
            <Link to="/payment">Payments</Link>
            <Link to="/support">Support</Link>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="nav-search">
          <Search size={18} />
          <input type="text" placeholder="Search services..." />
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <Bell className="icon" size={20} />

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
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>
                    View Profile
                  </Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)}>
                    Account Settings
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
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