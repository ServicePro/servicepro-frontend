import Navbar from "../../components/userDashboard/UserNavbar";
import Categories from "../../components/userDashboard/Categories";
import FeaturedServices from "../../components/userDashboard/FeaturedServices";
import SearchBar from "../../components/userDashboard/SearchBar";
import Footer from "../../components/userDashboard/UserFooter";

import "./UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, John 👋</h1>
          <p>
            What service do you need today? Search for local professionals.
          </p>

          <div className="hero-search">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        <Categories />
        <FeaturedServices />
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default UserDashboard;