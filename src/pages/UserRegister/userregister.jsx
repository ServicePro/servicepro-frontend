import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./userregister.css";

export default function UserRegister() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        otp: formData.code,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account Created Successfully!");
      window.location.href = "/login";
    } else {
      alert(data.msg);
    }
  } catch (err) {
    alert("Server error");
  }
};

 const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg);
      setStep(2); // go to OTP step
    } else {
      alert(data.msg);
    }
  } catch (err) {
    alert("Server error");
  }
};

  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="brand">
          <h1>ServicePro</h1>
          <p>Your trusted service marketplace</p>
        </div>

        <div className="features">
          <p>✔ Find trusted professionals</p>
          <p>✔ Easy booking system</p>
          <p>✔ Secure & reliable platform</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="subtitle">Start your journey with us</p>

          {step === 1 && (
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <input name="name" placeholder="Full Name" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
              </div>

              <button className="primary-btn">Send Verification Code</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify}>
              <div className="input-group">
                <input name="code" placeholder="Enter Verification Code" onChange={handleChange} required />
              </div>

              <button className="primary-btn">Verify & Create Account</button>
            </form>
          )}

          {/* LOGIN LINK */}
          <div className="bottom-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}