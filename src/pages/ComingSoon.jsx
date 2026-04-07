import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ComingSoon.css";

const ComingSoon = ({ title, description, icon, returnTo }) => {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="coming-soon-content">
        <div className="coming-soon-icon">{icon || "🚀"}</div>
        <h1>{title || "Coming Soon"}</h1>
        <p>{description || "This feature is coming soon. Please check back later."}</p>

        <button className="action-button" onClick={() => navigate(returnTo || "/")}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
