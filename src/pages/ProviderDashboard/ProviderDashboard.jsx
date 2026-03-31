import React from "react";

export default function ProviderDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ padding: "60px 40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Service Provider Dashboard</h1>
      <p style={{ color: "#6b7280", marginTop: "8px" }}>Welcome, {user.name || "Provider"}!</p>
    </div>
  );
}
