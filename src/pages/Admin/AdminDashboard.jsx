import React, { useState, useEffect } from "react";
import "./admin.css";

export default function AdminDashboard() {
  const admin = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/providers", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ secure
        },
      });

      const data = await res.json();

      if (res.ok) {
        // handle both formats (your API / teammate API)
        setPendingProviders(data.providers || data || []);
      } else {
        console.error(data.message || "Failed to fetch providers");
      }
    } catch (error) {
      console.error("Error fetching pending providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (providerId, action) => {
    try {
      // support BOTH API styles
      const url =
        action === "approve"
          ? `http://localhost:5000/api/admin/approve/${providerId}`
          : `http://localhost:5000/api/admin/reject/${providerId}`;

      const res = await fetch(url, {
        method: "PUT", // ✅ REST standard
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ secure
        },
      });

      const data = await res.json();

      alert(data.message || data.msg || "Action completed");

      if (res.ok) {
        fetchPendingProviders(); // refresh
      }
    } catch (error) {
      console.error(error);
      alert("Error processing approval");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h2>Loading pending providers...</h2>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Welcome, {admin.name || "Admin"}!
      </p>

      <h2>Pending Provider Approvals</h2>

      {pendingProviders.length === 0 ? (
        <p>No pending provider registrations.</p>
      ) : (
        <div className="providers-list">
          {pendingProviders.map((provider) => (
            <div key={provider._id} className="provider-card">
              <div className="provider-header">
                <h3>{provider.name}</h3>
                <span className="status pending">Pending</span>
              </div>

              <div className="provider-details">
                <div className="detail-row"><strong>Email:</strong> {provider.email}</div>
                <div className="detail-row"><strong>Phone:</strong> {provider.phone}</div>

                {/* Optional fields (safe fallback) */}
                {provider.nic && (
                  <div className="detail-row"><strong>NIC:</strong> {provider.nic}</div>
                )}

                <div className="detail-row">
                  <strong>Service:</strong> {provider.service || provider.category}
                </div>

                <div className="detail-row">
                  <strong>Category:</strong> {provider.category}
                </div>

                <div className="detail-row">
                  <strong>Experience:</strong> {provider.experience} {provider.experience ? "years" : ""}
                </div>

                {provider.price && (
                  <div className="detail-row">
                    <strong>Starting Price:</strong> LKR {provider.price}
                  </div>
                )}

                {provider.area && (
                  <div className="detail-row"><strong>Area:</strong> {provider.area}</div>
                )}

                {provider.address && (
                  <div className="detail-row"><strong>Address:</strong> {provider.address}</div>
                )}

                {provider.availability && (
                  <div className="detail-row"><strong>Availability:</strong> {provider.availability}</div>
                )}

                {provider.description && (
                  <div className="detail-row"><strong>Description:</strong> {provider.description}</div>
                )}

                <div className="detail-row">
                  <strong>Registered:</strong>{" "}
                  {new Date(provider.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="provider-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApproval(provider._id, "approve")}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => handleApproval(provider._id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}