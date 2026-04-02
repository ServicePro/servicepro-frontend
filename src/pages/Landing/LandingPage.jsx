import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaSearch
} from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import "./Landing.css";

const LandingPage = () => {
  const [providers, setProviders] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
  fetch("http://localhost:5000/api/providers")
    .then(res => res.json())
    .then(data => setProviders(data))
    .catch(err => console.error(err));
}, []);

  return (
    <MainLayout>
      {/* HERO */}
      {/* HERO WITH VIDEO */}
<section id="hero" className="hero video-hero">

  {/* VIDEO */}
  <video autoPlay loop muted playsInline className="bg-video">
    <source src="https://storage.cloud.google.com/servicepro-assets/videos/HeroVideo.mp4" type="video/mp4" />
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

 {/* ================= SERVICES CATEGORY (NEW) ================= */}
<section id="services" className="section light services-section">
  <div className="container center">

    <p className="section-tag">WHAT WE OFFER</p>
    <h2 className="section-title">All Services, One Platform</h2>
    <p className="subtext">
      Browse from our wide range of verified home service professionals.
    </p>

    <div className="grid-4 services-grid">

      {[
        { name: "Plumbing", desc: "Leak fix, pipes & more", icon: "🔧" },
        { name: "Electrician", desc: "Wiring, repairs & fitting", icon: "⚡" },
        { name: "Caretaker", desc: "Elderly & patient care", icon: "👨‍⚕️" },
        { name: "Beautician", desc: "Hair, skin & makeup", icon: "💄" },
        { name: "Cooking Chef", desc: "Home & event catering", icon: "👨‍🍳" },
        { name: "Tutor", desc: "All subjects & levels", icon: "📚" },
        { name: "Helper", desc: "Moving, errands & more", icon: "🙌" },
        { name: "Cleaner", desc: "Deep & regular cleaning", icon: "🧹" },
      ].map((item, i) => (
        <div key={i} className="service-box">
          <div className="service-icon">{item.icon}</div>
          <h3>{item.name}</h3>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>


{/* ================= HOW IT WORKS (NEW) ================= */}
<section id="how-it-works" className="section how-section">
  <div className="container center">

    <p className="section-tag purple">SIMPLE PROCESS</p>
    <h2 className="section-title">How It Works</h2>
    <p className="subtext">
      Get your service done in 4 easy steps. No stress, no guesswork.
    </p>

    <div className="steps-wrapper">

      {[
        {
          title: "Search Service",
          desc: "Tell us what service you need and your location to find the best matches nearby.",
          icon: "🔍",
        },
        {
          title: "Choose Provider",
          desc: "Browse verified professionals with reviews, ratings, and transparent pricing.",
          icon: "👤",
        },
        {
          title: "Book & Schedule",
          desc: "Pick a time that suits you. Instant confirmation and reminders included.",
          icon: "📅",
        },
        {
          title: "Job Done!",
          desc: "Your professional arrives on time. Rate your experience after the service.",
          icon: "✅",
        },
      ].map((step, i) => (
        <div key={i} className="step-card">

          <div className="step-icon-box">{step.icon}</div>
          <div className="step-number">0{i + 1}</div>

          <h3>{step.title}</h3>
          <p>{step.desc}</p>

        </div>
      ))}

    </div>
  </div>
</section>   

{/* ================= WHY SERVICEPRO ================= */}
<section id="why-servicepro" className="section light why-pro-section">
  <div className="container center">

    <p className="section-tag">WHY SERVICEPRO</p>
    <h2 className="section-title">
      The Smarter Way to Get <br /> Things Done at Home
    </h2>

    <div className="grid-4 why-grid">

      {[
        {
          title: "Fast Booking",
          desc: "Book a service in under 60 seconds. Professionals confirm within minutes.",
          icon: "⚡",
        },
        {
          title: "Verified Pros",
          desc: "Every professional is background-checked, ID-verified and trained.",
          icon: "🛡️",
        },
        {
          title: "Affordable Pricing",
          desc: "Transparent, competitive rates with zero hidden charges — ever.",
          icon: "💰",
        },
        {
          title: "24/7 Support",
          desc: "Our support team is available around the clock to help you.",
          icon: "🎧",
        },
      ].map((item, i) => (
        <div key={i} className="why-pro-card">
          <div className="why-icon">{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>


{/* ================= TOP PROVIDERS ================= */}
<section id="providers" className="section providers-section">
  <div className="container center">

    <p className="section-tag">FEATURED PROFESSIONALS</p>
    <h2 className="section-title">Meet Our Top Providers</h2>
    <p className="subtext">
      Handpicked, background-verified professionals with proven track records.
    </p>

    <div className="grid-4 providers-grid">

      {providers.map((pro) => (
        <div key={pro._id} className="provider-card">

          <div className="provider-img">
            <img src={pro.image} alt={pro.name} />
            <span className="badge-top">{pro.badge}</span>
          </div>

          <div className="provider-info">
            <h3>{pro.name}</h3>
            <p className="role">{pro.service}</p>

            <div className="provider-meta">
              ⭐ {pro.rating} ({pro.reviews})
              <span className="price">${pro.price}/hr</span>
            </div>

            <button className="btn primary">Book Now</button>
          </div>

        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= TRUST & SAFETY ================= */}
<section id="trust-safety" className="trust-section">
  <div className="container trust-wrapper">

    {/* LEFT */}
    <div className="trust-left">
      <p className="section-tag light">TRUST & SAFETY</p>

      <h2>
        Your Safety Is Our <br /> Top Priority
      </h2>

      <p className="subtext">
        We take every measure to ensure that every interaction on ServicePro is safe,
        secure, and trustworthy for both customers and professionals.
      </p>

      <div className="trust-badge">
        ✅ Trusted by 12,000+ families across 50+ cities
      </div>
    </div>

    {/* RIGHT */}
    <div className="trust-right">

      {[
        {
          title: "Verified Professionals",
          desc: "Every pro passes identity verification and skill assessment.",
        },
        {
          title: "Background Checked",
          desc: "Thorough background checks on every service provider.",
        },
        {
          title: "Secure Payments",
          desc: "All transactions are encrypted and 100% secure.",
        },
        {
          title: "Service Guarantee",
          desc: "Not satisfied? We'll make it right — free re-service.",
        },
        {
          title: "Data Privacy",
          desc: "Your personal data is never shared or sold to third parties.",
        },
      ].map((item, i) => (
        <div key={i} className="trust-card">
          <div className="trust-icon">✔</div>
          <div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= PRICING ================= */}
<section id="pricing" className="section light pricing-section">
  <div className="container center">

    <p className="section-tag">TRANSPARENT PRICING</p>
    <h2 className="section-title">Simple, Honest Pricing</h2>
    <p className="subtext">
      No hidden charges. No surprises. What you see is what you pay.
    </p>

    <div className="price-badge">
      💰 No hidden charges — guaranteed
    </div>

    <div className="grid-4 pricing-grid">

      {[
        {
          name: "Plumbing",
          price: "Rs. 1,500",
          features: [
            "Leak detection & fix",
            "Pipe installation",
            "Drain unclogging",
            "Tap replacement",
          ],
        },
        {
          name: "Electrician",
          price: "Rs. 1,200",
          popular: true,
          features: [
            "Wiring & rewiring",
            "Switch & socket fix",
            "Fan installation",
            "MCB/fuse repair",
          ],
        },
        {
          name: "Cleaning",
          price: "Rs. 1,000",
          features: [
            "Full home cleaning",
            "Kitchen deep clean",
            "Bathroom sanitizing",
            "Carpet cleaning",
          ],
        },
        {
          name: "Tutor",
          price: "Rs. 800",
          features: [
            "Home tutoring",
            "All grade levels",
            "Flexible scheduling",
            "Progress reports",
          ],
        },
      ].map((plan, i) => (
        <div
          key={i}
          className={`pricing-card ${plan.popular ? "popular" : ""}`}
        >

          {plan.popular && <span className="popular-badge">Most Popular</span>}

          <h3>{plan.name}</h3>
          <h2>{plan.price}</h2>
          <p className="sub">Starting price</p>

          <ul>
            {plan.features.map((f, idx) => (
              <li key={idx}>✔ {f}</li>
            ))}
          </ul>

          <button className="btn primary">Book Now</button>

        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= TESTIMONIALS ================= */}
<section id="testimonials" className="section light testimonials-section">
  <div className="container center">

    <p className="section-tag">CUSTOMER REVIEWS</p>
    <h2 className="section-title">What Our Customers Say</h2>

    <div className="grid-3 testimonial-grid">

      {[
        {
          text: "ServicePro made finding a plumber so easy! The professional arrived within 45 minutes and fixed everything perfectly.",
          name: "Ayasha Fernando",
          role: "Homeowner, Colombo",
        },
        {
          text: "Booked a tutor for my kids. The matching was spot-on — very professional and patient!",
          name: "David Raj",
          role: "Father of two",
        },
        {
          text: "Cleaning service was excellent. The verified badge gave me confidence. Will book again!",
          name: "Nadia Silva",
          role: "Working Professional",
        },
      ].map((t, i) => (
        <div key={i} className="testimonial-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p>"{t.text}"</p>

          <div className="user">
            <div className="avatar">{t.name[0]}</div>
            <div>
              <h4>{t.name}</h4>
              <small>{t.role}</small>
            </div>
          </div>
        </div>
      ))}

    </div>

    {/* STATS */}
    <div className="stats">
      <div><h2>12,000+</h2><p>Happy Customers</p></div>
      <div><h2>3,500+</h2><p>Verified Providers</p></div>
      <div><h2>4.9★</h2><p>Average Rating</p></div>
      <div><h2>98%</h2><p>Satisfaction Rate</p></div>
    </div>

  </div>
</section>

{/* ================= SMART TECH ================= */}
<section id="smart-tech" className="section smart-section">
  <div className="container center">

    <p className="section-tag">SMART TECHNOLOGY</p>
    <h2 className="section-title">Real-Time, Every Time</h2>
    <p className="subtext">
      Powered by modern tech to give you the most seamless service experience possible.
    </p>

    <div className="grid-4 smart-grid">

      {[
        { title: "Live Tracking", desc: "Track your professional in real-time.", icon: "📍" },
        { title: "Chat with Provider", desc: "Message directly inside the app.", icon: "💬" },
        { title: "Instant Booking", desc: "Confirm bookings in seconds.", icon: "📅" },
        { title: "Smart Notifications", desc: "Real-time alerts and updates.", icon: "🔔" },
      ].map((item, i) => (
        <div key={i} className="smart-card">
          <div className="smart-icon">{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= FAQ ================= */}
<section id="faq" className="section light faq-section">
  <div className="container">

    <p className="section-tag center">FAQs</p>
    <h2 className="section-title center">Frequently Asked Questions</h2>
    <p className="subtext center">
      Everything you need to know about ServicePro.
    </p>

    <div className="faq-list">

      {[
        {
          q: "How do I book a service?",
          a: "Search service, choose provider, and click Book Now.",
        },
        {
          q: "Are all providers verified?",
          a: "Yes, all providers are background-checked and verified.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept cards, mobile payments, and cash.",
        },
        {
          q: "Can I cancel or reschedule?",
          a: "Yes, easily from your dashboard.",
        },
        {
          q: "Is my data safe?",
          a: "Yes, we follow strict security standards.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className={`faq-item ${activeFAQ === i ? "active" : ""}`}
          onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
        >
          <div className="faq-question">
            {item.q}
            <span>{activeFAQ === i ? "▲" : "▼"}</span>
          </div>

          {activeFAQ === i && (
            <div className="faq-answer">{item.a}</div>
          )}
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= JOIN AS PROFESSIONAL ================= */}
<section id="join-professional" className="section join-section">
  <div className="container join-wrapper">

    {/* LEFT */}
    <div className="join-left">
      <p className="section-tag">FOR PROFESSIONALS</p>

      <h2>
        Join as a <br />
        <span>Service Professional</span>
      </h2>

      <p className="subtext">
        Turn your skills into a steady income. Join 3,500+ professionals already earning with ServicePro.
      </p>

      <button className="btn primary join-btn">
        Start Earning Today →
      </button>

      <small>Free to join · No commissions in first month</small>
    </div>

    {/* RIGHT */}
    <div className="join-right">

      {[
        {
          title: "Earn More",
          desc: "Set your own rates and earn up to 3x more than agencies.",
        },
        {
          title: "Flexible Hours",
          desc: "Work when you want. Accept or decline jobs freely.",
        },
        {
          title: "Grow Your Clientele",
          desc: "Access thousands of customers instantly.",
        },
        {
          title: "Build Reputation",
          desc: "Earn reviews and climb rankings.",
        },
      ].map((item, i) => (
        <div key={i} className="join-card">
          <div className="join-icon">★</div>
          <h4>{item.title}</h4>
          <p>{item.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= FINAL CTA ================= */}
<section className="cta-banner">
  <div className="container cta-wrapper">

    {/* LEFT CONTENT */}
    <div className="cta-left">

      <span className="cta-badge">⚡ Same-day service available</span>

      <h2>
        Need Help Today? <br />
        Book a Service Now!
      </h2>

      <p>
        Join thousands of happy homeowners. Verified professionals, transparent pricing, guaranteed satisfaction.
      </p>

      <div className="cta-buttons">
        <button className="btn primary">Book a Service →</button>
        <button className="btn outline">Browse Services</button>
      </div>

      <small>
        Free to browse · No hidden fees · Instant confirmation
      </small>

    </div>

    {/* RIGHT IMAGE */}
    <div className="cta-right">
      <img src="https://storage.cloud.google.com/servicepro-assets/images/service-common.png" alt="Service" />
    </div>

  </div>
</section>


      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 ServicePro. All rights reserved.</p>
      </footer>
    </MainLayout>
  );
};

export default LandingPage;