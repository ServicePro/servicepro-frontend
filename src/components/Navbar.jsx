import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Search, Moon, Sun, Globe } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const isActive = (path) => location.pathname === path;

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/services/search?q=${value}`
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        {/* LEFT - LOGO */}
        <div className="nav-left">
          <img
            src="../../../public/videos/logo.png"
            alt="ServicePro"
            className="logo-img"
            onError={(e) => (e.target.style.display = "none")}
          />
          
        </div>

        {/* CENTER - SEARCH */}
        <div className="nav-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for services..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <Link
                  key={item._id}
                  to={`/services/${item._id}`}
                  className="search-item"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li className={isActive("/") ? "active" : ""}><Link to="/">Home</Link></li>
          <li className={isActive("/services") ? "active" : ""}><Link to="/services">Services</Link></li>
          <li className={isActive("/about") ? "active" : ""}><Link to="/about">About</Link></li>
          <li className={isActive("/contact") ? "active" : ""}><Link to="/contact">Contact</Link></li>
        </ul>

        {/* RIGHT */}
        <div className="nav-right">

          {/* LANGUAGE */}
          <div className="lang-box">
            <Globe size={16} />
            <select>
              <option>EN</option>
              <option>TA</option>
              <option>SI</option>
            </select>
          </div>

          {/* DARK MODE */}
          <div className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>

          {/* BUTTONS */}
          <Link to="/login">
  <button className="btn-ghost">Login</button>
</Link>

<Link to="/register">
  <button className="btn-gradient">
    Sign Up 
  </button>
</Link>

        </div>

        {/* MOBILE */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;