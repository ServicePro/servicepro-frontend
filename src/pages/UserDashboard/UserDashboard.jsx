import Navbar from "../../components/userDashboard/UserNavbar";
import Categories from "../../components/userDashboard/Categories";
import FeaturedServices from "../../components/userDashboard/FeaturedServices";
import SearchBar from "../../components/userDashboard/SearchBar";
import Footer from "../../components/userDashboard/UserFooter";

import "./UserDashboard.css";

const UserDashboard = () => {
  const user = {
    name: "John", // 🔥 replace with context/auth later
  };

  return (
    <div className="dashboard">

      <Navbar />

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            Welcome back, <span>{user.name}</span> 👋
          </h1>

          <p>
            Discover trusted professionals for every need — fast, reliable, local.
          </p>

          <div className="hero-search">
            <SearchBar />
          </div>

          <div className="hero-actions">
            <button className="btn-primary">Explore Services</button>
            <button className="btn-outline">Become a Provider</button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="dashboard-content">
        <section className="section">
          <div className="section-header">
            <h2>Categories</h2>
            <span>Browse what you need</span>
          </div>
          <Categories />
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Featured Services</h2>
            <span>Top rated professionals</span>
          </div>
          <FeaturedServices />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;