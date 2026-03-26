import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sendOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStep(2);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      alert("Error sending OTP. Please check your connection.");
    }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password }),
      });

      if (response.ok) {
        alert("Password reset successful!");
        window.location.href = "/login";
      } else {
        alert("Failed to reset password. Please check your OTP.");
      }
    } catch (error) {
      alert("Error resetting password. Please try again.");
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button onClick={sendOTP} className="reset-btn">
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="success-icon">
                <FiMail size={32} color="#10b981" />
              </div>
              <p className="subtitle">
                We've sent an OTP to <strong>{email}</strong>
              </p>

              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button onClick={resetPassword} className="reset-btn">
                Reset Password
              </button>
            </>
          )}

          <div className="back-to-login">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}