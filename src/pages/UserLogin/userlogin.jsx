// import React, { useState } from "react";
// import "./userlogin.css";

// export default function UserLogin({ onNavigate }) {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     // Add login logic here
//     alert("Login functionality to be implemented!");
//   };

//   return (
//     <div className="auth-container">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="brand">
//           <h1>ServiceHub</h1>
//           <p>Your trusted service marketplace</p>
//         </div>

//         <div className="features">
//           <p>✔ Find trusted professionals</p>
//           <p>✔ Easy booking system</p>
//           <p>✔ Secure & reliable platform</p>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right">
//         <div className="auth-form">
//           <h2>Welcome Back</h2>
//           <p>Sign in to your account</p>

//           <form onSubmit={handleLogin}>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>

//             <button type="submit" className="auth-btn">
//               Sign In
//             </button>
//           </form>

//           <div className="auth-links">
//             <p>
//               Don't have an account?{" "}
//               <span onClick={() => onNavigate("register")}>Register</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa";
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
    if (role === "admin") navigate("/admin");
    else if (role === "provider") navigate("/provider-dashboard");
    else navigate("/user-dashboard");
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
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "36px 32px",
            maxWidth: "380px", width: "90%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
          }}>
            <h3 style={{ marginBottom: "8px", color: "#111" }}>Login As</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
              Your email is registered as both a User and a Service Provider. Choose how you want to log in.
            </p>
            <button
              onClick={() => handleLogin(null, "user")}
              style={{
                width: "100%", padding: "12px", marginBottom: "12px",
                background: "#10b981", color: "#fff", border: "none",
                borderRadius: "8px", fontSize: "15px", cursor: "pointer", fontWeight: 600
              }}
            >
              Login as User
            </button>
            <button
              onClick={() => handleLogin(null, "provider")}
              style={{
                width: "100%", padding: "12px", marginBottom: "12px",
                background: "#4f46e5", color: "#fff", border: "none",
                borderRadius: "8px", fontSize: "15px", cursor: "pointer", fontWeight: 600
              }}
            >
              Login as Service Provider
            </button>
            <button
              onClick={() => setShowRoleModal(false)}
              style={{
                width: "100%", padding: "10px", background: "transparent",
                color: "#6b7280", border: "1px solid #d1d5db",
                borderRadius: "8px", fontSize: "14px", cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="login-left">
        <h1>ServicePro</h1>
        <p>Login to access your dashboard</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>

          {successMsg && (
            <p style={{ color: "#10b981", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>
              {successMsg}
            </p>
          )}
          {error && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>
              {error}
            </p>
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
              <Link to="/forgot-password" style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
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

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#10b981", textDecoration: "none" }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}