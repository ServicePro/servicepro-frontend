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



import React from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import "./userlogin.css";

export default function Login() {
  const googleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const linkedinLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/linkedin";
  };

  const facebookLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/facebook";
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>ServicePro</h1>
        <p>Login to access your dashboard</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <button className="google-btn" onClick={googleLogin}>
            <FcGoogle style={{ marginRight: '10px', fontSize: '18px' }} />
            Continue with Google
          </button>

          <button className="linkedin-btn" onClick={linkedinLogin}>
            <FaLinkedinIn style={{ marginRight: '10px', fontSize: '18px', color: '#0077b5' }} />
            Continue with LinkedIn
          </button>

          <button className="facebook-btn" onClick={facebookLogin}>
            <FaFacebookF style={{ marginRight: '10px', fontSize: '18px', color: '#1877f2' }} />
            Continue with Facebook
          </button>

          <div className="divider">OR</div>

          <input placeholder="Email" />
          <input type="password" placeholder="Password" />

          <div className="forgot-password">
            <Link to="/forgot-password" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Forgot Password?</Link>
          </div>

          <button className="login-btn">Login</button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#10b981', textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}