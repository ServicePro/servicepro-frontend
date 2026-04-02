import MainLayout from "../../layouts/MainLayout";
import "./Landing.css";
import {
  FaCheckCircle,
  FaStar,
  FaSearch,
  FaCalendarAlt,
  FaThumbsUp,
  FaShieldAlt,
  FaUsers,
  FaBolt,
} from "react-icons/fa";

const LandingPage = () => {

  return (
    <MainLayout>
      {/* HERO */}
      {/* HERO WITH VIDEO */}
<section className="hero video-hero">

  {/* VIDEO */}
  <video autoPlay loop muted playsInline className="bg-video">
    <source src="/videos/HeroVideo.mp4" type="video/mp4" />
  </video>

  {/* OVERLAY */}
  <div className="video-overlay"></div>

  <div className="container hero-inner">
    
    {/* LEFT */}
    <div className="hero-left">
      <span className="badge">
        <FaCheckCircle /> Trusted by 50,000+ customers
      </span>

      <h1>
        Find Trusted <br />
        <span>Home Services</span> Experts Near You
      </h1>

      <p className="subtext">
        Book trusted professionals instantly. Fast, secure, and reliable.
      </p>

      <div className="search-box">
        <input placeholder="Search services (e.g. plumber, cleaner...)" />
        <button><FaSearch /></button>
      </div>

      <div className="hero-buttons">
        <button className="btn primary">Get Started →</button>
        <button className="btn outline">Browse Services</button>
      </div>

      <div className="features">
        <span><FaCheckCircle /> Verified</span>
        <span><FaCheckCircle /> Secure</span>
        <span><FaCheckCircle /> Guaranteed</span>
      </div>
    </div>

    {/* RIGHT SIDE (NEW 🔥) */}
    <div className="hero-right">
      <div className="hero-card">

        <h3 className="card-title">Top Rated Providers</h3>

        {["Sarah", "Mike", "Emma"].map((name, i) => (
          <div key={i} className="mini-card">
            <div className="avatar">{name[0]}</div>
            <div>
              <p>{name}</p>
              <small>4.{8 + i} ⭐</small>
            </div>
            <span>${40 + i * 10}/hr</span>
          </div>
        ))}

      </div>
    </div>

  </div>
</section>
      

      {/* SERVICES */}
      <section className="section light">
        <div className="container center">
          <h2>Popular Services</h2>

          <div className="grid-3">
            {["Cleaning", "Electrician", "Plumbing", "Beauty", "Tutoring", "Cooking"].map((s, i) => (
              <div key={i} className="service-card">
                <h3>{s}</h3>
                <p>Professional {s} services</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="container center">
          <h2>Why Choose Us</h2>

          <div className="grid-3">
            <div className="why-card">
              <FaShieldAlt className="icon" />
              <h3>Secure Platform</h3>
              <p>Safe payments & verified users</p>
            </div>

            <div className="why-card">
              <FaUsers className="icon" />
              <h3>Trusted Providers</h3>
              <p>Background-checked professionals</p>
            </div>

            <div className="why-card">
              <FaBolt className="icon" />
              <h3>Fast Booking</h3>
              <p>Instant service booking system</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section light">
        <div className="container center">
          <h2>How It Works</h2>

          <div className="grid-3">
            <div className="step">
              <FaSearch />
              <h3>Search</h3>
            </div>
            <div className="step">
              <FaCalendarAlt />
              <h3>Book</h3>
            </div>
            <div className="step">
              <FaThumbsUp />
              <h3>Done</h3>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container center">
          <h2>What Customers Say</h2>

          <div className="grid-3">
            {["Amazing service!", "Very reliable!", "Highly recommend!"].map((t, i) => (
              <div key={i} className="testimonial">
                <p>"{t}"</p>
                <div className="rating"><FaStar /> 5.0</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section light">
        <div className="container center">
          <h2>Pricing Plans</h2>

          <div className="grid-3">
            {["Basic", "Pro", "Premium"].map((p, i) => (
              <div key={i} className="pricing-card">
                <h3>{p}</h3>
                <h2>${10 + i * 20}</h2>
                <p>Per month</p>
                <button className="btn primary">Choose</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Join ServicePro Today</h2>
        <button className="btn primary">Get Started</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 ServicePro. All rights reserved.</p>
      </footer>
    </MainLayout>
  );
};

export default LandingPage;