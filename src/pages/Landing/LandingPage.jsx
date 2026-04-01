import MainLayout from "../../layouts/MainLayout";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaStar,
  FaSearch,
  FaCalendarAlt,
  FaThumbsUp,
} from "react-icons/fa";


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* HERO */}
      <section className="hero container">
        <div className="hero-left">
          <span className="badge">
            <FaCheckCircle /> Trusted by 50,000+ customers
          </span>

          <h1>
            Find Trusted <br />
            Home Service <br />
            Experts Near You
          </h1>

          <p className="subtext">
            Book reliable professionals for cleaning, beauty, maintenance, and more.
            Quality service at your doorstep.
          </p>

          <div className="hero-buttons">
            <button className="btn primary" onClick={() => {
  console.log("clicked");
  navigate("/register");
}}>Get Started →</button>
            <button className="btn outline" onClick={() => {
  console.log("clicked");
  navigate("/services");
}}>
              Browse Services
            </button>
          </div>

          <div className="features">
            <span><FaCheckCircle /> Verified professionals</span>
            <span><FaCheckCircle /> Secure payments</span>
            <span><FaCheckCircle /> Satisfaction guaranteed</span>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="hero-card">
          {["Sarah Johnson", "Mike Chen", "Emma Davis"].map((name, i) => (
            <div key={i} className="mini-card">
              <div className="avatar">{name[0]}</div>
              <div>
                <p className="name">{name}</p>
                <p className="role">Service Provider</p>
              </div>
              <span className="price">${45 + i * 5}/hr</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section light">
        <div className="container center">
          <h4>OUR SERVICES</h4>
          <h2>Browse Service Categories</h2>
          <p className="subtext">
            Find the perfect professional for any task.
          </p>

          <div className="grid-3">
            {["Cleaning", "Beauty", "Pest Control", "Tutoring", "Repair"].map(
              (service, i) => (
                <div key={i} className="service-card">
                  <div className="icon-box">✨</div>
                  <h3>{service}</h3>
                  <p>Professional {service.toLowerCase()} services</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container center">
          <h4>SIMPLE PROCESS</h4>
          <h2>How It Works</h2>

          <div className="grid-3">
            <div className="step">
              <FaSearch className="step-icon" />
              <h3>Search Service</h3>
              <p>Find exactly what you need</p>
            </div>

            <div className="step">
              <FaCalendarAlt className="step-icon" />
              <h3>Book Appointment</h3>
              <p>Select your time and date</p>
            </div>

            <div className="step">
              <FaThumbsUp className="step-icon" />
              <h3>Get Service Done</h3>
              <p>Relax and enjoy quality work</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROVIDERS */}
      <section className="section light">
        <div className="container center">
          <h4>TOP RATED</h4>
          <h2>Featured Service Providers</h2>

          <div className="grid-4">
            {["Sarah", "Mike", "Emma", "David"].map((p, i) => (
              <div key={i} className="provider-card">
                <div className="avatar big">{p[0]}</div>
                <h3>{p}</h3>
                <p>Service Expert</p>

                <div className="rating">
                  <FaStar /> 4.{8 + i}
                </div>

                <div className="provider-bottom">
                  <span>${45 + i * 10}/hr</span>
                  <button className="btn small">Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Join ServicePro Today</h2>
        <p>Whether you need or offer services, we’ve got you covered.</p>

        <div className="cta-buttons">
          <button className="btn primary">Sign Up</button>
          <button className="btn outline">Become Provider</button>
        </div>

        <div className="stats">
          <div><h3>50K+</h3><p>Customers</p></div>
          <div><h3>5K+</h3><p>Providers</p></div>
          <div><h3>100K+</h3><p>Jobs</p></div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;