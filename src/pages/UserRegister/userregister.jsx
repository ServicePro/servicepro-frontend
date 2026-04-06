// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./userregister.css";

// export default function UserRegister() {
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     code: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleVerify = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:5000/api/users/verify", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: formData.email,
//         otp: formData.code,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Account Created Successfully!");
//       window.location.href = "/login";
//     } else {
//       alert(data.msg);
//     }
//   // eslint-disable-next-line no-unused-vars
//   } catch (err) {
//     alert("Server error");
//   }
// };

//  const handleRegister = async (e) => {
//   e.preventDefault();

//   if (formData.password !== formData.confirmPassword) {
//     alert("Passwords do not match");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/api/users/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert(data.msg);
//       setStep(2); // go to OTP step
//     } else {
//       alert(data.msg);
//     }
//   // eslint-disable-next-line no-unused-vars
//   } catch (err) {
//     alert("Server error");
//   }
// };

//   return (
//     <div className="auth-container">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="brand">
//           <h1>ServicePro</h1>
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
//         <div className="auth-card">
//           <h2>Create Account</h2>
//           <p className="subtitle">Start your journey with us</p>

//           {step === 1 && (
//             <form onSubmit={handleRegister}>
//               <div className="input-group">
//                 <input name="name" placeholder="Full Name" onChange={handleChange} required />
//               </div>

//               <div className="input-group">
//                 <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
//               </div>

//               <div className="input-group">
//                 <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
//               </div>

//               <div className="input-group">
//                 <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//               </div>

//               <div className="input-group">
//                 <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
//               </div>

//               <button className="primary-btn">Send Verification Code</button>
//             </form>
//           )}

//           {step === 2 && (
//             <form onSubmit={handleVerify}>
//               <div className="input-group">
//                 <input name="code" placeholder="Enter Verification Code" onChange={handleChange} required />
//               </div>

//               <button className="primary-btn">Verify & Create Account</button>
//             </form>
//           )}

//           {/* LOGIN LINK */}
//           <div className="bottom-text">
//             Already have an account?{" "}
//             <Link to="/login">Login</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import "./userregister.css";

const UserRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Password rule checks
  const rules = {
    length:    (p) => p.length >= 8,
    uppercase: (p) => /[A-Z]/.test(p),
    lowercase: (p) => /[a-z]/.test(p),
    number:    (p) => /[0-9]/.test(p),
    special:   (p) => /[^A-Za-z0-9]/.test(p),
  };

  const passwordValid = Object.values(rules).every((fn) => fn(form.password));
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";
  const canSubmit = passwordValid && passwordsMatch && form.agree && form.name && form.email;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login", { state: { message: "Verification email sent! Please check your inbox." } });
      } else {
        setErrors({ email: data.message || "Registration failed" });
      }
    } catch {
      setErrors({ email: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          setErrors({ email: data.message || "Google sign-up failed" });
        }
      } catch {
        setErrors({ email: "Google sign-up failed. Try again." });
      }
    },
    onError: () => setErrors({ email: "Google sign-up was cancelled." })
  });

  return (
    <div className="register-container">
      <div className="register-card">

        <h2>ServicePro</h2>
        <h1>Create Your Account</h1>
        <p className="subtitle">Join ServicePro to discover and book local services.</p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          {/* Live password rules */}
          {form.password && (
            <div className="password-rules">
              <p className={rules.length(form.password)    ? "rule-ok" : "rule-fail"}>✔ At least 8 characters</p>
              <p className={rules.uppercase(form.password) ? "rule-ok" : "rule-fail"}>✔ One uppercase letter</p>
              <p className={rules.lowercase(form.password) ? "rule-ok" : "rule-fail"}>✔ One lowercase letter</p>
              <p className={rules.number(form.password)    ? "rule-ok" : "rule-fail"}>✔ One number</p>
              <p className={rules.special(form.password)   ? "rule-ok" : "rule-fail"}>✔ One special character</p>
            </div>
          )}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {form.confirmPassword && !passwordsMatch && (
            <p className="field-error">Passwords do not match</p>
          )}
          {form.confirmPassword && passwordsMatch && (
            <p className="field-ok">✔ Passwords match</p>
          )}

          {/* Terms */}
          <label className="terms-inline">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            <span>
              I agree to our{" "}
              <span className="link">Terms of Service</span> and{" "}
              <span className="link">Privacy Policy</span>.
            </span>
          </label>

          <button
            className="btn-primary"
            disabled={!canSubmit || loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="divider">OR CONTINUE WITH</div>

          <button type="button" className="btn-google" onClick={() => googleLogin()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px", verticalAlign: "middle" }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p className="bottom-text">
            Already have an account?{" "}
            <span className="link" onClick={() => navigate("/login")}>Sign In</span>
          </p>

          <p className="bottom-text">
            Are you a service provider?{" "}
            <span className="link" onClick={() => navigate("/provider-register")}>Register as a Service Provider</span>
          </p>

        </form>
      </div>
    </div>
  );
};

export default UserRegister;