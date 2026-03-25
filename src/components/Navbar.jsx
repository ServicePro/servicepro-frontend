import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div className="nav-left">
          <div className="logo-icon">S</div>
          <Link to="/" className="logo-text">ServicePro</Link>
        </div>

        {/* LINKS */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        {/* ACTIONS */}
        <div className="nav-actions">
          <Link to="/login">
            <button className="btn-outline">Login</button>
          </Link>

          <Link to="/register">
            <button className="btn-primary">Register</button>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;