import "./Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">
          <div className="footer-logo">
            <div className="logo-icon">S</div>
            <h3>ServicePro</h3>
          </div>

          <p>
            Connecting you with trusted local service professionals.
            Quality service at your doorstep.
          </p>

          <div className="socials">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div>
            <h4>Company</h4>
            <p>About Us</p>
            <p>Careers</p>
            <p>Press</p>
            <p>Blog</p>
          </div>

          <div>
            <h4>Services</h4>
            <p>Cleaning</p>
            <p>Beauty</p>
            <p>Repair</p>
            <p>Tutoring</p>
          </div>

          <div>
            <h4>Support</h4>
            <p>Help Center</p>
            <p>Safety</p>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 ServicePro. All rights reserved.</p>
        <div>
          <span>Terms</span>
          <span>Privacy</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;