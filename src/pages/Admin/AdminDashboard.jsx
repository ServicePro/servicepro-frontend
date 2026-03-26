import React, { useState, useEffect } from "react";
import "./admin.css";

export default function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/pending-providers");
      const data = await res.json();
      if (res.ok) {
        setPendingProviders(data.providers || []);
      }
    } catch (error) {
      console.error("Error fetching pending providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (providerId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/approve-provider/${providerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      alert(data.msg);

      if (res.ok) {
        // Refresh the list
        fetchPendingProviders();
      }
    } catch (error) {
      alert("Error processing approval");
    }
  };

  if (loading) {
    return <div className="admin-container"><h2>Loading pending providers...</h2></div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <h2>Pending Provider Approvals</h2>

      {pendingProviders.length === 0 ? (
        <p>No pending provider registrations.</p>
      ) : (
        <div className="providers-list">
          {pendingProviders.map((provider) => (
            <div key={provider._id} className="provider-card">
              <div className="provider-header">
                <h3>{provider.name}</h3>
                <span className="status pending">Pending Approval</span>
              </div>

              <div className="provider-details">
                <div className="detail-row">
                  <strong>Email:</strong> {provider.email}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {provider.phone}
                </div>
                <div className="detail-row">
                  <strong>NIC:</strong> {provider.nic}
                </div>
                <div className="detail-row">
                  <strong>Service:</strong> {provider.service}
                </div>
                <div className="detail-row">
                  <strong>Category:</strong> {provider.category}
                </div>
                <div className="detail-row">
                  <strong>Experience:</strong> {provider.experience} years
                </div>
                <div className="detail-row">
                  <strong>Starting Price:</strong> LKR {provider.price}
                </div>
                <div className="detail-row">
                  <strong>Address:</strong> {provider.address}
                </div>
                <div className="detail-row">
                  <strong>Description:</strong> {provider.description}
                </div>
                <div className="detail-row">
                  <strong>Registered:</strong> {new Date(provider.createdAt).toLocaleDateString()}
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