import Navbar from "../../components/userDashboard/UserNavbar";
import Categories from "../../components/userDashboard/Categories";
import FeaturedServices from "../../components/userDashboard/FeaturedServices";
import SearchBar from "../../components/userDashboard/SearchBar";
import Footer from "../../components/userDashboard/UserFooter";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";

import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  const user = (() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : { name: "there" };
    } catch {
      return { name: "there" };
    }
  })();

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="dashboard">

      <Navbar />

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            {t.welcome} <span>{firstName}</span> 👋
          </h1>

          <p>
            {t.heroSub}
          </p>

          <div className="hero-search">
            <SearchBar />
          </div>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/services")}>{t.heroExplore}</button>
            <button className="btn-outline" onClick={() => navigate("/provider-register")}>{t.heroBecome}</button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="dashboard-content">
        <section className="section">
          <div className="section-header">
            <h2>{t.categories}</h2>
            <span>{t.categoriesSub}</span>
          </div>
          <Categories />
        </section>

        <section className="section">
          <div className="section-header">
            <h2>{t.featured}</h2>
            <span>{t.featuredSub}</span>
          </div>
          <FeaturedServices />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;