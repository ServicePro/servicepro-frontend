import {
    FaArrowUp,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaTwitter,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="footer">
      <div className="footer-container">

        {/* BRAND */}
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

          <div className="footer-contact-list">
            <p><FaPhoneAlt /> +94 77 123 4567</p>
            <p><FaEnvelope /> support@servicepro.com</p>
            <p><FaMapMarkerAlt /> Colombo, Sri Lanka</p>
          </div>

          <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
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
            <button type="button" onClick={() => scrollToSection("services")}>Cleaning Services</button>
            <button type="button" onClick={() => scrollToSection("services")}>Beauty and Wellness</button>
            <button type="button" onClick={() => scrollToSection("services")}>Home Repairs</button>
            <button type="button" onClick={() => scrollToSection("services")}>Tutoring Services</button>
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