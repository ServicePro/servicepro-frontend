import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./ProviderRequests.css";

export default function ProviderRequests() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/providers/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProviders(res.data?.data || res.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load pending providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const approve = async (id) => {
    setActionLoading(id + "_approve");
    try {
      await axios.put(`/admin/providers/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Provider approved successfully.");
      fetchProviders();
    } catch (err) {
      setMessage(err.response?.data?.message || "Approval failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id) => {
    setActionLoading(id + "_reject");
    try {
      await axios.put(`/admin/providers/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Provider rejected.");
      fetchProviders();
    } catch (err) {
      setMessage(err.response?.data?.message || "Rejection failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="pr-root">
      <div className="pr-header">
        <h2>Provider Requests</h2>
        <p>Review and approve or reject pending service provider registrations</p>
      </div>

      {message && (
        <div className="pr-message" onClick={() => setMessage("")}>
          {message} <span>✕</span>
        </div>
      )}

      {loading ? (
        <div className="pr-loading">
          <div className="pr-spinner" />
          <p>Loading pending providers…</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="pr-empty">
          <div className="pr-empty-icon">✅</div>
          <p>No pending provider requests.</p>
        </div>
      ) : (
        <div className="pr-grid">
          {providers.map((p) => (
            <div key={p._id} className="pr-card">
              <div className="pr-card-header">
                <div className="pr-avatar">{(p.name || "P").charAt(0).toUpperCase()}</div>
                <div className="pr-info">
                  <h3>{p.name}</h3>
                  <p className="pr-email">{p.email}</p>
                </div>
                <span className="pr-status-badge">Pending</span>
              </div>

              <div className="pr-details">
                <div className="pr-detail"><span>📂 Category</span><strong>{p.category || "—"}</strong></div>
                <div className="pr-detail"><span>📞 Phone</span><strong>{p.phone || "—"}</strong></div>
                <div className="pr-detail"><span>📍 Area</span><strong>{p.area || "—"}</strong></div>
                <div className="pr-detail"><span>🕐 Experience</span><strong>{p.experience ? `${p.experience} yrs` : "—"}</strong></div>
                {p.skills && (
                  <div className="pr-detail pr-detail-full"><span>🛠 Skills</span><strong>{p.skills}</strong></div>
                )}
                {p.availability && (
                  <div className="pr-detail pr-detail-full"><span>📅 Availability</span><strong>{p.availability}</strong></div>
                )}
              </div>

              <div className="pr-actions">
                <button
                  className="pr-btn pr-btn-approve"
                  onClick={() => approve(p._id)}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === p._id + "_approve" ? "Approving…" : "✓ Approve"}
                </button>
                <button
                  className="pr-btn pr-btn-reject"
                  onClick={() => reject(p._id)}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === p._id + "_reject" ? "Rejecting…" : "✕ Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}