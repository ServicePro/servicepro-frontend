import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./serviceproviderregistration.css";

export default function ServiceProviderRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    nic: "",
    service: "",
    category: "",
    experience: "",
    price: "",
    address: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/providers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration submitted successfully! Please wait 24 hours for admin approval. You will be notified once your account is approved.");
        // Clear form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          nic: "",
          service: "",
          category: "",
          experience: "",
          price: "",
          address: "",
          description: "",
        });
      } else {
        alert(data.msg || "Registration failed. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="provider-wrapper">
      {/* LEFT INFO PANEL */}
      <div className="provider-left">
        <h1>Join as a Service Provider</h1>
        <p>Grow your business with ServiceHub</p>

        <ul>
          <li>✔ Reach more customers</li>
          <li>✔ Flexible working hours</li>
          <li>✔ Secure payments</li>
        </ul>
      </div>

      {/* FORM */}
      <div className="provider-right">
        <div className="provider-card">
          <h2>Provider Registration</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid">
              <input name="name" placeholder="Full Name" onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            </div>

            <div className="grid">
              <input name="nic" placeholder="NIC Number" onChange={handleChange} required />
              <input name="service" placeholder="Service Name (Plumbing, Cleaning)" onChange={handleChange} required />
            </div>

            <div className="grid">
              <input name="category" placeholder="Category (Home, Beauty, Repair)" onChange={handleChange} required />
              <input name="experience" placeholder="Years of Experience" onChange={handleChange} required />
            </div>

            <div className="grid">
              <input name="price" placeholder="Starting Price (LKR)" onChange={handleChange} required />
              <input name="address" placeholder="Your Address" onChange={handleChange} required />
            </div>

            <textarea
              name="description"
              placeholder="Describe your service in detail..."
              onChange={handleChange}
              required
            ></textarea>

            <button className="submit-btn">Submit for Approval</button>
          </form>

          <p className="login-link">
            Already registered?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}