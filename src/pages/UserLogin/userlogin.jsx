import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./userlogin.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  const successMsg = location.state?.message || "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const redirectByRole = (role) => {
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else {
      if (role === "admin") navigate("/admin");
      else if (role === "provider") navigate("/provider/dashboard");
      else navigate("/user-dashboard");
    }
  };

  // ── Email / password login ──────────────────────────────────────────────────
  const handleLogin = async (e, loginAs = null) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    setShowRoleModal(false);
    try {
      const body = { email: form.email, password: form.password };
      if (loginAs) body.loginAs = loginAs;

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      // Backend says email belongs to both user & provider — show modal
      if (res.ok && data.ambiguous) {
        setShowRoleModal(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      redirectByRole(data.user.role);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google login (access-token flow) ───────────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading("google");
      try {
        const res = await fetch(`${API}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Google sign-in failed.");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        redirectByRole(data.user.role);
      } catch {
        setError("Google sign-in failed. Please try again.");
      } finally {
        setSocialLoading("");
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed.")
  });

  // ── LinkedIn (server-side redirect flow) ────────────────────────────────────
  const linkedinLogin = () => {
    window.location.href = `${API}/api/auth/linkedin`;
  };

  return (
    <div className="login-container">

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Login As</h3>
            <p>
              Your email is registered as both a User and a Service Provider. Choose how you want to log in.
            </p>
            <button
              onClick={() => handleLogin(null, "user")}
              className="modal-btn modal-btn-primary"
            >
              Login as User
            </button>
            <button
              onClick={() => handleLogin(null, "provider")}
              className="modal-btn modal-btn-secondary"
            >
              Login as Service Provider
            </button>
            <button
              onClick={() => setShowRoleModal(false)}
              className="modal-btn modal-btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="login-left">
        <div className="hero-image-container">
          <img src="https://storage.cloud.google.com/servicepro-assets/images/multi-service.png" alt="ServicePro Hero" className="hero-image" />
        </div>
        <div className="hero-content">
          <h1>ServicePro</h1>
          <p>Login to access your dashboard</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>

          {successMsg && (
            <div className="message message-success">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="message message-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <div className="forgot-password">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button className="google-btn" type="button" onClick={() => googleLogin()} disabled={socialLoading === "google"}>
            <FcGoogle style={{ marginRight: "10px", fontSize: "18px" }} />
            {socialLoading === "google" ? "Signing in..." : "Continue with Google"}
          </button>

          <button className="linkedin-btn" type="button" onClick={linkedinLogin} disabled={!!socialLoading}>
            <FaLinkedinIn style={{ marginRight: "10px", fontSize: "18px", color: "#0077b5" }} />
            Continue with LinkedIn
          </button>

          <p>
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}