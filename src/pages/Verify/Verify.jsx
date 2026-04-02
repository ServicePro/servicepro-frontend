import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/verify/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token, navigate]);

  const styles = {
    wrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4f4f4", fontFamily: "Arial, sans-serif" },
    card: { background: "#fff", borderRadius: "10px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
    icon: { fontSize: "56px", marginBottom: "16px" },
    title: { fontSize: "24px", fontWeight: "bold", marginBottom: "12px" },
    sub: { color: "#666", fontSize: "15px", marginBottom: "24px" },
    btn: { display: "inline-block", marginTop: "8px", padding: "12px 28px", background: "#4f46e5", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "15px", cursor: "pointer", border: "none" },
  };

  if (status === "loading") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.icon}>⏳</div>
          <h2 style={styles.title}>Verifying your account...</h2>
          <p style={styles.sub}>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.icon}>✅</div>
          <h2 style={styles.title}>Registration Successful!</h2>
          <p style={styles.sub}>Your account has been verified. You can now log in to ServicePro.</p>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "20px" }}>Redirecting to login in 3 seconds...</p>
          <button style={styles.btn} onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.icon}>❌</div>
        <h2 style={styles.title}>Verification Failed</h2>
        <p style={styles.sub}>This link is invalid or has expired. Please register again.</p>
        <button style={styles.btn} onClick={() => navigate("/register")}>Back to Register</button>
      </div>
    </div>
  );
};

export default Verify;
