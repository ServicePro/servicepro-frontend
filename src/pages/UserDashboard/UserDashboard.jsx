import Navbar from "../../components/userDashboard/UserNavbar";
import Categories from "../../components/userDashboard/Categories";
import FeaturedServices from "../../components/userDashboard/FeaturedServices";
import SearchBar from "../../components/userDashboard/SearchBar";
import Footer from "../../components/userDashboard/UserFooter";
import Navbar from "../../components/userDashboard/UserNavbar";
import { useLang } from "../../context/LangContext";
import { getStoredUser } from "../../utils/userPresentation";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [user] = useState(getStoredUser() || { name: "there" });
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
  })();

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="dashboard">

      <Navbar />

      <section className="dashboard-hero">
        <div className="hero-overlay"></div>

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">✨ Trusted by 10,000+ users</div>

            <h1>
              {(t.welcome || "Welcome back,")}<br />
              <span>{user?.name || "there"}</span> 👋
            </h1>

            <p>
              {t.heroSub || "Discover trusted professionals for every need fast, reliable, and local."}
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/services")}>
                {t.heroExplore || "Explore Services"}
              </button>
              <button className="btn-outline" onClick={() => navigate("/provider-register")}>
                {t.heroBecome || "Become a Provider"}
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item"><span>⭐</span> 4.9 avg. rating</div>
              <div className="trust-item"><span>🛡️</span> Verified providers</div>
              <div className="trust-item"><span>⚡</span> Same-day booking</div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-search-card">
              <h3>{t.heroSearchTitle || "Find a Service"}</h3>
              <p>{t.heroSearchSubtitle || "What do you need help with today?"}</p>
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

      <main className="dashboard-content">
        <section className="section">
          <div className="section-header">
            <h2>{t.categories || "Categories"}</h2>
            <span>{t.categoriesSub || "Browse what you need"}</span>
          </div>
          <Categories />
        </section>

        <section className="section">
          <div className="section-header">
            <h2>{t.featured || "Featured Services"}</h2>
            <span>{t.featuredSub || "Top rated professionals"}</span>
          </div>
          <FeaturedServices />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
