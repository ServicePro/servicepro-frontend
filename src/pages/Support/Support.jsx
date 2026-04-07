import { useState } from 'react';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './Support.css';

const FAQS = [
  {
    q: 'How do I book a service?',
    a: 'Browse services, click on a service you like, choose a date and time, then follow the booking steps. You\'ll receive a confirmation once the provider accepts.',
  },
  {
    q: 'Can I cancel or reschedule a booking?',
    a: 'Yes — go to Service History, find your booking and contact the provider through the chat feature to discuss changes. Cancellation policies vary by provider.',
  },
  {
    q: 'How do I pay for my booking?',
    a: 'We support secure online payments at checkout. Once the provider accepts your request your payment is processed and a receipt is emailed to you.',
  },
  {
    q: 'How do I become a service provider?',
    a: 'Click "Become a Provider" from the home page, fill in your details and services, and submit for admin approval. You\'ll hear back within 24 hours.',
  },
  {
    q: 'What if I have an issue with a provider?',
    a: 'Use the chat feature to resolve issues directly. If you need escalation, submit a support request below and our team will assist within one business day.',
  },
  {
    q: 'How are providers vetted?',
    a: 'Every provider goes through an identity and background check by our admin team before being approved. Ratings and reviews from real users help maintain quality.',
  },
];

const CATEGORIES = [
  { icon: '📦', title: 'Bookings & Payments',  desc: 'Help with booking issues, payment processing, invoices' },
  { icon: '🔧', title: 'Provider Issues',       desc: 'Problems with a service or provider experience' },
  { icon: '🔐', title: 'Account & Security',    desc: 'Password reset, account access, profile changes' },
  { icon: '⭐', title: 'Reviews & Ratings',     desc: 'Questions about your reviews or ratings system' },
  { icon: '📱', title: 'App Feedback',          desc: 'Bugs, feature requests, general app feedback' },
  { icon: '💳', title: 'Billing',               desc: 'Charges, refunds or subscription questions' },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <>
      <UserNavbar />
      <div className="sup-root">

        {/* ── Hero ── */}
        <div className="sup-hero">
          <div className="sup-hero-inner">
            <h1>How can we help?</h1>
            <p>Search our help centre or browse categories below</p>
            <div className="sup-search-wrap">
              <span className="sup-search-icon">🔍</span>
              <input
                className="sup-search"
                type="text"
                placeholder="Search for answers… (e.g. cancel booking, payment)"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="sup-body">

          {/* ── Help Categories ── */}
          <section className="sup-section">
            <h2>Browse by Topic</h2>
            <div className="sup-categories">
              {CATEGORIES.map(cat => (
                <div key={cat.title} className="sup-cat-card">
                  <span className="sup-cat-icon">{cat.icon}</span>
                  <div>
                    <strong>{cat.title}</strong>
                    <p>{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="sup-section">
            <h2>Frequently Asked Questions</h2>
            <div className="sup-faq-list">
              {FAQS.map((item, i) => (
                <div
                  key={i}
                  className={`sup-faq-item ${openFaq === i ? 'open' : ''}`}
                >
                  <button
                    className="sup-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="sup-faq-arrow">{openFaq === i ? '▴' : '▾'}</span>
                  </button>
                  {openFaq === i && <p className="sup-faq-a">{item.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* ── Contact Form ── */}
          <section className="sup-section">
            <div className="sup-contact-wrap">
              <div className="sup-contact-info">
                <h2>Still need help?</h2>
                <p>Our support team typically replies within one business day.</p>
                <div className="sup-contact-channels">
                  <div className="sup-channel">
                    <span className="sup-channel-icon">📧</span>
                    <div>
                      <strong>Email Us</strong>
                      <p>support@servicepro.app</p>
                    </div>
                  </div>
                  <div className="sup-channel">
                    <span className="sup-channel-icon">💬</span>
                    <div>
                      <strong>Live Chat</strong>
                      <p>Mon – Fri, 9 am – 6 pm</p>
                    </div>
                  </div>
                  <div className="sup-channel">
                    <span className="sup-channel-icon">📞</span>
                    <div>
                      <strong>Phone</strong>
                      <p>+1 (800) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sup-form-card">
                {submitted ? (
                  <div className="sup-form-success">
                    <div className="sup-success-icon">🎉</div>
                    <h3>Message Received!</h3>
                    <p>We'll get back to you at <strong>{form.email}</strong> as soon as possible.</p>
                    <button
                      className="sup-reset-btn"
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', category: '', message: '' }); }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form className="sup-form" onSubmit={handleSubmit} noValidate>
                    <h3>Send a Message</h3>
                    {error && <p className="sup-form-error">{error}</p>}

                    <div className="sup-form-row">
                      <div className="sup-form-group">
                        <label>Name <span className="sup-req">*</span></label>
                        <input
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="sup-form-group">
                        <label>Email <span className="sup-req">*</span></label>
                        <input
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sup-form-group">
                      <label>Category</label>
                      <select name="category" value={form.category} onChange={handleChange}>
                        <option value="">Select a category…</option>
                        {CATEGORIES.map(c => (
                          <option key={c.title} value={c.title}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sup-form-group">
                      <label>Message <span className="sup-req">*</span></label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Describe your issue in as much detail as possible…"
                        value={form.message}
                        onChange={handleChange}
                        maxLength={2000}
                      />
                      <span className="sup-char">{form.message.length}/2000</span>
                    </div>

                    <button className="sup-submit-btn" type="submit">
                      📨 Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
