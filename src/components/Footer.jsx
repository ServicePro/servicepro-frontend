import {
    FaArrowUp,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaLock,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaShieldAlt,
    FaStar,
    FaTwitter,
    FaApple,
    FaGoogle,
} from "react-icons/fa";
import { SERVICE_CATEGORIES } from "../constants/serviceCategories";
import "./Footer.css";

const FOOTER_CATEGORY_VALUES = ["Cleaning", "Beauty & Wellness", "Home Repair", "Tutoring"];

const Footer = () => {
  const footerCategories = SERVICE_CATEGORIES.filter(({ value }) => FOOTER_CATEGORY_VALUES.includes(value));

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Stats data
  const stats = [
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Verified Professionals', value: '5K+' },
    { label: 'Services Completed', value: '100K+' },
    { label: 'Cities Served', value: '50+' },
  ];

  return (
    <footer id="footer" className="footer">
      {/* STATS SECTION */}
      <div className="footer-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-item">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="footer-container">

        {/* BRAND & INFO */}
        <div className="footer-left">
          <div
            className="footer-logo"
            onClick={() => scrollToSection("hero")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-icon">S</div>
            <h3>ServicePro</h3>
          </div>

          <p className="footer-desc">
            Connecting you with trusted local service professionals.
            Quality service at your doorstep.
          </p>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-btn primary" onClick={() => scrollToSection("services")}>
              Browse Services
            </button>
            <button className="action-btn secondary" onClick={() => scrollToSection("join-professional")}>
              Become a Provider
            </button>
          </div>

          <div className="footer-contact-list">
            <p><FaPhoneAlt /> +94 77 123 4567</p>
            <p><FaEnvelope /> support@servicepro.com</p>
            <p><FaMapMarkerAlt /> Colombo, Sri Lanka</p>
          </div>

          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" title="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div className="footer-link-group">
            <h4>Company</h4>
            <button type="button" onClick={() => scrollToSection("why-servicepro")}>About Us</button>
            <button type="button" onClick={() => scrollToSection("join-professional")}>Careers</button>
            <button type="button" onClick={() => scrollToSection("testimonials")}>Customer Stories</button>
            <button type="button" onClick={() => scrollToSection("hero")}>Blog</button>
          </div>

          <div className="footer-link-group">
            <h4>Services</h4>
            {footerCategories.map(({ value, label }) => (
              <button key={value} type="button" onClick={() => scrollToSection("services")}>{label}</button>
            ))}
          </div>

          <div className="footer-link-group">
            <h4>Support</h4>
            <button type="button" onClick={() => scrollToSection("faq")}>Help Center</button>
            <button type="button" onClick={() => scrollToSection("trust-safety")}>Safety</button>
            <button type="button" onClick={() => scrollToSection("pricing")}>Terms of Service</button>
            <button type="button" onClick={() => scrollToSection("pricing")}>Privacy Policy</button>
          </div>

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get service tips and exclusive offers every week.</p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "mailto:support@servicepro.com?subject=ServicePro%20Newsletter%20Subscription";
              }}
            >
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* APP DOWNLOAD & TRUST SECTION */}
      <div className="footer-features">
        <div className="app-download">
          <h5>Download Our App</h5>
          <div className="app-buttons">
            <a href="#app-store" className="app-btn ios" title="Download on App Store">
              <FaApple /> App Store
            </a>
            <a href="#google-play" className="app-btn android" title="Get it on Google Play">
              <FaGoogle /> Play Store
            </a>
          </div>
        </div>

        <div className="trust-badges">
          <h5>Why Trust Us?</h5>
          <div className="badges">
            <div className="badge">
              <FaShieldAlt />
              <span>Background Verified</span>
            </div>
            <div className="badge">
              <FaStar />
              <span>5-Star Rated</span>
            </div>
            <div className="badge">
              <FaLock />
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ServicePro. All rights reserved.</p>

        <div className="footer-bottom-links">
          <button type="button" onClick={() => scrollToSection("pricing")}>Terms</button>
          <button type="button" onClick={() => scrollToSection("pricing")}>Privacy</button>
          <button type="button" onClick={() => scrollToSection("faq")}>Cookies</button>
          <button type="button" className="to-top" onClick={() => scrollToSection("hero")}>
            <FaArrowUp /> Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;