import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import "./ForgotPassword.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendOTP = async () => {
    if (!email) { setError("Please enter your email address."); return; }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp) { setError("Please enter the OTP."); return; }
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(password)) { setError("Password must contain at least one uppercase letter."); return; }
    if (!/[a-z]/.test(password)) { setError("Password must contain at least one lowercase letter."); return; }
    if (!/[0-9]/.test(password)) { setError("Password must contain at least one number."); return; }
    if (!/[^A-Za-z0-9]/.test(password)) { setError("Password must contain at least one special character."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(3);
      } else {
        setError(data.message || "Failed to reset password. Please check your OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <h1>ServicePro</h1>
        <p>Reset your password securely</p>
      </div>

      <div className="forgot-password-right">
        <div className="forgot-password-card">
          <h2>Reset Password</h2>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>
              {error}
            </p>
          )}

          {step === 1 && (
            <>
              <p className="subtitle">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button onClick={sendOTP} className="reset-btn" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="success-icon">
                <FiMail size={32} color="#10b981" />
              </div>
              <p className="subtitle">
                We've sent a 6-digit OTP to <strong>{email}</strong>. It expires in 10 minutes.
              </p>

              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setError(""); }}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 6px" }}>Min 8 chars · uppercase · lowercase · number · special character</p>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter new password"
                    required
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  <span
                    onClick={() => setShowPassword(p => !p)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280" }}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    placeholder="Confirm new password"
                    required
                    style={{ paddingRight: "40px", width: "100%" }}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(p => !p)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280" }}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                </div>
              </div>

              <button onClick={resetPassword} className="reset-btn" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <p style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "#6b7280" }}>
                Didn't receive it?{" "}
                <span
                  onClick={() => { setStep(1); setError(""); }}
                  style={{ color: "#4f46e5", cursor: "pointer", textDecoration: "underline" }}
                >
                  Resend OTP
                </span>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="success-icon">
                <FiMail size={32} color="#10b981" />
              </div>
              <p className="subtitle" style={{ textAlign: "center" }}>
                Your password has been reset successfully!
              </p>
              <Link to="/login">
                <button className="reset-btn">Back to Login</button>
              </Link>
            </>
          )}

          {step !== 3 && (
            <div className="back-to-login">
              <Link to="/login">← Back to Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}