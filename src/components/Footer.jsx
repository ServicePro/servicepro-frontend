import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
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

          <div className="socials">
            <span><FaFacebookF /></span>
            <span><FaTwitter /></span>
            <span><FaInstagram /></span>
            <span><FaLinkedinIn /></span>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          {/* COMPANY */}
          <div>
            <h4>Company</h4>
            <a onClick={() => scrollToSection("why-servicepro")}>About Us</a>
            <a onClick={() => scrollToSection("join-professional")}>Careers</a>
            <a onClick={() => scrollToSection("testimonials")}>Press</a>
            <a onClick={() => scrollToSection("hero")}>Blog</a>
          </div>

          {/* SERVICES */}
          <div>
            <h4>Services</h4>
            <a onClick={() => scrollToSection("services")}>Cleaning</a>
            <a onClick={() => scrollToSection("services")}>Beauty</a>
            <a onClick={() => scrollToSection("services")}>Repair</a>
            <a onClick={() => scrollToSection("services")}>Tutoring</a>
          </div>

          {/* SUPPORT */}
          <div>
            <h4>Support</h4>
            <a onClick={() => scrollToSection("faq")}>Help Center</a>
            <a onClick={() => scrollToSection("trust-safety")}>Safety</a>
            <a onClick={() => scrollToSection("pricing")}>Terms of Service</a>
            <a onClick={() => scrollToSection("pricing")}>Privacy Policy</a>
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 ServicePro. All rights reserved.</p>

        <div className="footer-bottom-links">
          <span onClick={() => scrollToSection("pricing")}>Terms</span>
          <span onClick={() => scrollToSection("pricing")}>Privacy</span>
          <span onClick={() => scrollToSection("faq")}>Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;