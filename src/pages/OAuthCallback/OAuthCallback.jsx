import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ERROR_MESSAGES = {
  email_exists: "This email is already registered. Please sign in with your password instead.",
  cancelled: "Sign-in was cancelled.",
  no_email:  "Could not retrieve your email from the provider. Please try another method.",
  token_failed: "Authentication failed. Please try again.",
  server_error: "A server error occurred. Please try again later."
};

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    const name  = searchParams.get("name");
    const role  = searchParams.get("role");
    const error = searchParams.get("error");

    if (error) {
      const msg = ERROR_MESSAGES[error] || "Authentication failed.";
      navigate("/login", { state: { message: msg } });
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          id:   payload.id,
          role: role || payload.role || "user",
          name: name ? decodeURIComponent(name) : ""
        };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate(user.role === "admin" ? "/admin" : "/");
      } catch {
        setStatus("error");
        setTimeout(() => navigate("/login"), 2000);
      }
    } else {
      navigate("/login", { state: { message: "Authentication failed. Please try again." } });
    }
  }, []);

  if (status === "error") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "#ef4444" }}>Something went wrong. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: "12px" }}>
      <div style={{ width: "36px", height: "36px", border: "4px solid #e5e7eb", borderTop: "4px solid #4f46e5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#6b7280", fontSize: "15px" }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
