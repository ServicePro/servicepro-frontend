// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./serviceproviderregistration.css";

// export default function ServiceProviderRegister() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     nic: "",
//     service: "",
//     category: "",
//     experience: "",
//     price: "",
//     address: "",
//     description: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:5000/api/providers/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Registration submitted successfully! Please wait 24 hours for admin approval. You will be notified once your account is approved.");
        
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           password: "",
//           nic: "",
//           service: "",
//           category: "",
//           experience: "",
//           price: "",
//           address: "",
//           description: "",
//         });
//       } else {
//         alert(data.msg || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       alert("Network error. Please check your connection and try again.");
//     }
//   };

//   return (
//     <div className="provider-wrapper">
//       {/* LEFT INFO PANEL */}
//       <div className="provider-left">
//         <h1>Join as a Service Provider</h1>
//         <p>Grow your business with ServiceHub</p>

//         <ul>
//           <li>✔ Reach more customers</li>
//           <li>✔ Flexible working hours</li>
//           <li>✔ Secure payments</li>
//         </ul>
//       </div>

//       {/* FORM */}
//       <div className="provider-right">
//         <div className="provider-card">
//           <h2>Provider Registration</h2>

//           <form onSubmit={handleSubmit}>
//             <div className="grid">
//               <input name="name" placeholder="Full Name" onChange={handleChange} required />
//               <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//               <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
//               <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//             </div>

//             <div className="grid">
//               <input name="nic" placeholder="NIC Number" onChange={handleChange} required />
//               <input name="service" placeholder="Service Name (Plumbing, Cleaning)" onChange={handleChange} required />
//             </div>

//             <div className="grid">
//               <input name="category" placeholder="Category (Home, Beauty, Repair)" onChange={handleChange} required />
//               <input name="experience" placeholder="Years of Experience" onChange={handleChange} required />
//             </div>

//             <div className="grid">
//               <input name="price" placeholder="Starting Price (LKR)" onChange={handleChange} required />
//               <input name="address" placeholder="Your Address" onChange={handleChange} required />
//             </div>

//             <textarea
//               name="description"
//               placeholder="Describe your service in detail..."
//               onChange={handleChange}
//               required
//             ></textarea>

//             <button className="submit-btn">Submit for Approval</button>
//           </form>

//           <p className="login-link">
//             Already registered?{" "}
//             <Link to="/login">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./serviceproviderregistration.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const VALID_CATEGORIES = ["Cleaning","Plumbing","Electrical","Carpentry","Painting","Beauty & Wellness","Home Repair","Other"];

// helper component — shows red message under an input
const FieldError = ({ msg }) =>
  msg ? <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 8px" }}>{msg}</p> : null;

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    password: "", confirmPassword: "",
    category: "", skills: "", experience: "",
    area: "", availability: "",
    license: null, idProof: null, agree: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Client-side validation ──────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address.";

    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-().]{7,20}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number (e.g. +94 77 1234567).";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.password)) e.password = "Password must contain at least one uppercase letter.";
    else if (!/[a-z]/.test(form.password)) e.password = "Password must contain at least one lowercase letter.";
    else if (!/[0-9]/.test(form.password)) e.password = "Password must contain at least one number.";
    else if (!/[^A-Za-z0-9]/.test(form.password)) e.password = "Password must contain at least one special character.";

    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";

    if (!form.category) e.category = "Please select a service category.";
    else if (!VALID_CATEGORIES.includes(form.category)) e.category = "Select a valid category.";

    if (!form.skills.trim()) e.skills = "Please describe your skills.";
    else if (form.skills.trim().length < 10) e.skills = "Describe your skills in at least 10 characters.";

    if (form.experience === "") e.experience = "Years of experience is required.";
    else if (isNaN(form.experience) || Number(form.experience) < 0) e.experience = "Enter a valid number (0 or more).";
    else if (Number(form.experience) > 60) e.experience = "Experience value seems too large.";

    if (!form.area.trim()) e.area = "Service area is required.";

    if (!form.availability.trim()) e.availability = "Please describe your availability.";

    if (form.license) {
      const ext = form.license.name.split(".").pop().toLowerCase();
      if (!["jpg","jpeg","png","pdf"].includes(ext)) e.license = "Only JPEG, PNG, or PDF allowed.";
      else if (form.license.size > 5 * 1024 * 1024) e.license = "File must be smaller than 5MB.";
    }
    if (form.idProof) {
      const ext = form.idProof.name.split(".").pop().toLowerCase();
      if (!["jpg","jpeg","png","pdf"].includes(ext)) e.idProof = "Only JPEG, PNG, or PDF allowed.";
      else if (form.idProof.size > 5 * 1024 * 1024) e.idProof = "File must be smaller than 5MB.";
    }

    if (!form.agree) e.agree = "You must agree to the Terms and Conditions.";

    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    // Clear the specific field error when user edits it
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setServerError("");
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstError = document.querySelector(".field-error-active");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("email", form.email.trim().toLowerCase());
      data.append("phone", form.phone.trim());
      data.append("password", form.password);
      data.append("category", form.category);
      data.append("skills", form.skills.trim());
      data.append("experience", form.experience);
      data.append("area", form.area.trim());
      data.append("availability", form.availability.trim());
      if (form.license) data.append("license", form.license);
      if (form.idProof) data.append("idProof", form.idProof);

      const res = await fetch(`${API}/api/providers/register`, {
        method: "POST",
        body: data
      });

      const json = await res.json();
      if (!res.ok) {
        // Backend may return per-field errors
        if (json.errors) setFieldErrors(json.errors);
        setServerError(json.msg || "Registration failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-box" style={{ textAlign: "center", padding: "60px 40px" }}>
          <h2 style={{ color: "#10b981", marginBottom: "16px" }}>Registration Submitted!</h2>
          <p style={{ color: "#555", fontSize: "15px", marginBottom: "24px" }}>
            Your application is pending admin review. You will receive an email once your account is approved (usually within 24 hours).
          </p>
          <button className="btn-primary" onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-box">

        {/* Header */}
        <div className="header">
          <h2>ServicePro</h2>
          <h1>Service Provider Registration</h1>
          <p>Join our network of skilled professionals. Provide your details to start offering your services.</p>
        </div>

        {serverError && (
          <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px", textAlign: "center", background: "#fef2f2", padding: "10px", borderRadius: "6px" }}>
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Personal Info */}
          <div className="card">
            <h3>Personal Information</h3>

            <label>Full Name *</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange}
              className={fieldErrors.name ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.name} />

            <label>Email Address *</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange}
              className={fieldErrors.email ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.email} />

            <label>Phone Number *</label>
            <input name="phone" placeholder="+94 77 1234567" value={form.phone} onChange={handleChange}
              className={fieldErrors.phone ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.phone} />

            <label>Password * <span style={{ fontWeight: 400, fontSize: "12px", color: "#6b7280" }}>(min 8 chars · uppercase · lowercase · number · special character)</span></label>
            <div style={{ position: "relative" }}>
              <input name="password" type={showPassword ? "text" : "password"} placeholder="e.g. Pass@123" value={form.password} onChange={handleChange}
                className={fieldErrors.password ? "field-error-active" : ""} style={{ paddingRight: "40px", width: "100%" }} />
              <span onClick={() => setShowPassword(p => !p)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280" }}>
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>
            <FieldError msg={fieldErrors.password} />

            <label>Confirm Password *</label>
            <div style={{ position: "relative" }}>
              <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange}
                className={fieldErrors.confirmPassword ? "field-error-active" : ""} style={{ paddingRight: "40px", width: "100%" }} />
              <span onClick={() => setShowConfirmPassword(p => !p)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#6b7280" }}>
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>
            <FieldError msg={fieldErrors.confirmPassword} />
          </div>

          {/* Service Details */}
          <div className="card">
            <h3>Service Details</h3>

            <label>Primary Service Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={fieldErrors.category ? "field-error-active" : ""}>
              <option value="">Select a category</option>
              {VALID_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <FieldError msg={fieldErrors.category} />

            <label>Skills & Expertise * <span style={{ fontWeight: 400, fontSize: "12px", color: "#6b7280" }}>(min 10 characters)</span></label>
            <textarea name="skills" placeholder="Describe your skills in detail..." value={form.skills} onChange={handleChange}
              className={fieldErrors.skills ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.skills} />

            <label>Years of Experience *</label>
            <input name="experience" type="number" min="0" max="60" placeholder="e.g. 5" value={form.experience} onChange={handleChange}
              className={fieldErrors.experience ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.experience} />
          </div>

          {/* Location & Availability */}
          <div className="card">
            <h3>Location & Availability</h3>

            <label>Service Area *</label>
            <input name="area" placeholder="e.g. Colombo, Sri Lanka" value={form.area} onChange={handleChange}
              className={fieldErrors.area ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.area} />

            <label>Availability *</label>
            <textarea name="availability" placeholder="e.g. Weekdays 9AM – 5PM" value={form.availability} onChange={handleChange}
              className={fieldErrors.availability ? "field-error-active" : ""} />
            <FieldError msg={fieldErrors.availability} />
          </div>

          {/* Documents */}
          <div className="card">
            <h3>Document Uploads <span style={{ fontWeight: 400, fontSize: "13px", color: "#6b7280" }}>(optional – JPEG, PNG or PDF, max 5MB each)</span></h3>

            <label>Business License / Certification</label>
            <input type="file" name="license" accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} />
            <FieldError msg={fieldErrors.license} />

            <label>Government ID Verification</label>
            <input type="file" name="idProof" accept=".jpg,.jpeg,.png,.pdf" onChange={handleChange} />
            <FieldError msg={fieldErrors.idProof} />
          </div>

          {/* Terms */}
          <div className="card">
            <h3>Terms and Conditions</h3>
            <label className="terms-inline">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
              <span>
                I agree to the <span className="link">ServicePro Terms</span> and <span className="link">Privacy Policy</span>.
              </span>
            </label>
            <FieldError msg={fieldErrors.agree} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", height: "54px", fontSize: "17px", fontWeight: 700 }}
            >
              {loading ? "Submitting..." : "Register"}
            </button>
            <span
              onClick={() => navigate("/login")}
              style={{ fontSize: "13px", color: "#0ea5e9", cursor: "pointer", textDecoration: "underline" }}
            >
              Back to Login
            </span>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ServiceProviderRegister;