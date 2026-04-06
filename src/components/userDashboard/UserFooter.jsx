import "./UserFooter.css";
import {AtSign, MessageCircle, PhoneCall} from "lucide-react";

const UserFooter = () => {
  return (
    <footer className="user-footer">

      <div className="footer-container">

        {/* LEFT SIDE */}
        <div className="footer-left">
          <h2>ServicePro</h2>
          <p>
            Find trusted professionals for all your home service needs.
            Fast, secure, and reliable.
          </p>

          <div className="socials">
            <AtSign size={18} />
            <MessageCircle size={18} />
            <PhoneCall size={18} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">

          <div>
            <h4>Company</h4>
            <p>About</p>
            <p>Careers</p>
            <p>Blog</p>
          </div>

          <div>
            <h4>Support</h4>
            <p>Help Center</p>
            <p>Terms</p>
            <p>Privacy</p>
          </div>

          <div>
            <h4>Services</h4>
            <p>Plumbing</p>
            <p>Cleaning</p>
            <p>Electrical</p>
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ServicePro. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default UserFooter;