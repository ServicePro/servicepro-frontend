import React, { useState, useEffect } from "react";
import "./admin.css";

export default function ServiceModeration() {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback to older API_URL logic for compatibility
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/pending-providers`);
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
      const res = await fetch(`${API_BASE}/api/admin/approve-provider/${providerId}`, {
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
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error processing approval");
    }
  };

  if (loading) {
    return <div style={{ padding: '24px' }}><h2>Loading pending providers...</h2></div>;
  }

  return (
    <div style={{ padding: '0' }} className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Pending Provider Approvals</h2>
      </div>

      {pendingProviders.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
          <h3>All caught up!</h3>
          <p>No pending provider registrations require your attention.</p>
        </div>
      ) : (
        <div className="providers-list">
          {pendingProviders.map((provider) => (
            <div key={provider._id} className="provider-card" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
              <div className="provider-header">
                <h3>{provider.name}</h3>
                <span className="status pending">Pending</span>
              </div>

              <div className="provider-details">
                <div className="detail-row">
                  <strong>Email:</strong> {provider.email}
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> {provider.phone}
                </div>
                <div className="detail-row">
                  <strong>Category:</strong> {provider.category}
                </div>
                <div className="detail-row">
                  <strong>Skills:</strong> {provider.skills || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Experience:</strong> {provider.experience} years
                </div>
                <div className="detail-row">
                  <strong>Area:</strong> {provider.area || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Registered:</strong> {new Date(provider.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="provider-actions" style={{ gap: '12px' }}>
                <button
                  className="approve-btn"
                  onClick={() => handleApproval(provider._id, "approve")}
                  style={{ backgroundColor: '#10b981', color: '#fff' }}
                >
                  Approve Registration
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleApproval(provider._id, "reject")}
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}
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