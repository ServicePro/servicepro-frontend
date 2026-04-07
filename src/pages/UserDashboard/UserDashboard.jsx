import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Categories from "../../components/userDashboard/Categories";
import FeaturedServices from "../../components/userDashboard/FeaturedServices";
import SearchBar from "../../components/userDashboard/SearchBar";
import Footer from "../../components/userDashboard/UserFooter";
import Navbar from "../../components/userDashboard/UserNavbar";
import { getStoredUser } from "../../utils/userPresentation";

import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(getStoredUser() || null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState({
    searched: false,
    query: "",
    noResults: false,
    error: false,
  });

  const handleSearchSubmit = (value) => {
    const trimmed = value.trim();
    setSearchQuery(trimmed);

    if (!trimmed) {
      setSearchState({
        searched: false,
        query: "",
        noResults: false,
        error: false,
      });
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="hero-overlay"></div>

        <div className="hero-inner">

          {/* LEFT — Text + CTAs */}
          <div className="hero-left">
            <div className="hero-badge">✨ Trusted by 10,000+ users</div>

            <h1>
              Welcome back,<br />
              <span>{user?.name || "there"}</span> 👋
            </h1>

            <p>
              Discover trusted professionals for every need —<br />
              fast, reliable, and local.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/services")}>
                Explore Services
              </button>
              <button className="btn-outline" onClick={() => navigate("/provider/register")}>
                Become a Provider
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item"><span>⭐</span> 4.9 avg. rating</div>
              <div className="trust-item"><span>🛡️</span> Verified providers</div>
              <div className="trust-item"><span>⚡</span> Same-day booking</div>
            </div>
          </div>

          {/* RIGHT — Search Card */}
          <div className="hero-right">
            <div className="hero-search-card">
              <h3>Find a Service</h3>
              <p>What do you need help with today?</p>
              <SearchBar
                value={searchInput}
                onChange={setSearchInput}
                onSubmit={handleSearchSubmit}
              />

              {searchState.error && (
                <div className="search-feedback search-feedback-error">
                  Unable to search services right now. Please try again in a moment.
                </div>
              )}

              {searchState.noResults && !searchState.error && (
                <>
                  <div className="search-feedback search-feedback-error">
                    No services found for "{searchState.query}".
                  </div>
                  <div className="search-feedback search-feedback-hint">
                    Try related keywords like cleaning, plumbing, electrician, tutoring.
                  </div>
                </>
              )}

              {searchState.searched && !searchState.noResults && !searchState.error && (
                <div className="search-feedback search-feedback-success">
                  Showing search results for "{searchState.query}" in Featured Services.
                </div>
              )}

              <div className="popular-tags">
                <span>Popular:</span>
                {["Cleaning", "Plumbing", "Tutoring", "Electrician"].map((tag) => (
                  <button
                    key={tag}
                    className="tag-pill"
                    onClick={() => {
                      setSearchInput(tag);
                      handleSearchSubmit(tag);
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {/* CATEGORIES SECTION */}
        <section className="section">
          <div className="section-header">
            <h2>Categories</h2>
            <span>Browse what you need</span>
          </div>
          <Categories />
        </section>

        {/* FEATURED SERVICES SECTION */}
        <section className="section">
          <div className="section-header">
            <h2>Featured Services</h2>
            <span>Top rated professionals</span>
          </div>
          <FeaturedServices searchQuery={searchQuery} onSearchResult={setSearchState} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;