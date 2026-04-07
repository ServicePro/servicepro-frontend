import { Globe, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { applyGlobalTheme, emitThemeChange, getInitialDarkMode, onThemeChange } from "../utils/themeMode";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [lang, setLang] = useState(() => localStorage.getItem('sp_lang') || 'EN');
  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    applyGlobalTheme(darkMode);
    emitThemeChange(darkMode);
  }, [darkMode]);

  useEffect(() => onThemeChange(setDarkMode), []);

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem('sp_lang', newLang);
    window.dispatchEvent(new CustomEvent('sp_lang_change', { detail: newLang }));
  };

  const isActive = (path) => location.pathname === path;

  const handleSearch = (value) => setSearch(value);

  const doNavSearch = () => {
    const q = search.trim();
    if (!q) return;

    if (location.pathname === "/") {
      window.dispatchEvent(new CustomEvent("sp_landing_search", { detail: q }));
      return;
    }

    navigate(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        {/* LEFT - LOGO */}
        <div className="nav-left">
          <img
            src="/videos/logo.png"
            alt="ServicePro"
            className="logo-img"
            onError={(e) => (e.target.style.display = "none")}
          />
          
        </div>

        {/* CENTER - SEARCH */}
        <div className="nav-search">
          <Search size={18} className="search-icon" onClick={doNavSearch} style={{ cursor: 'pointer' }} />
          <input
            type="text"
            placeholder="Search on landing page..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doNavSearch()}
          />
        </div>

        {/* LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li className={isActive("/") ? "active" : ""}><Link to="/">Home</Link></li>
          <li className={isActive("/login") ? "active" : ""}><Link to="/login">Services</Link></li>
          <li>
            {location.pathname === "/" ? (
              <a href="#faq">About</a>
            ) : (
              <Link to="/about">About</Link>
            )}
          </li>
          <li>
            {location.pathname === "/" ? (
              <a href="#footer">Contact</a>
            ) : (
              <Link to="/contact">Contact</Link>
            )}
          </li>
        </ul>

        {/* RIGHT */}
        <div className="nav-right">

          {/* LANGUAGE */}
          <div className="lang-box">
            <Globe size={16} />
            <select value={lang} onChange={handleLangChange}>
              <option value="EN">EN</option>
              <option value="TA">TA</option>
              <option value="SI">SI</option>
            </select>
          </div>

          {/* DARK MODE */}
          <div className="icon-btn" onClick={() => setDarkMode(v => !v)} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
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