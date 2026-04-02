import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import servicesApi from '../api/servicesApi';

const ManageServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  // Fetch real services on component mount
  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll();
      if (response.success) {
        setServices(response.data.services);
      } else {
        setError('Failed to load services.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot fetch services. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleStatus = async (id) => {
    try {
      await servicesApi.toggleStatus(id);
      fetchServices();
    } catch (err) {
      console.error("Toggle error:", err);
      alert(err.response?.data?.message || "Error toggling status.");
    }
  };

  const deleteService = async (id) => {
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert("Error deleting service. It may have active appointments.");
    }
  };

  if (loading) return <div>Loading Services...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Manage Services</h1>
          <p>View, edit, and control your listed services.</p>
        </div>
        <Link to="/provider/add-service" className="btn btn-primary">
          ➕ Add New Service
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="services-filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="form-input"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} service{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🛠️</div>
            <h3>No services found</h3>
            <p>Try changing your search or filter, or add a new service.</p>
            <Link to="/provider/add-service" className="btn btn-primary" style={{ marginTop: '12px' }}>
              ➕ Add Service
            </Link>
          </div>
        </div>
      ) : (
        <div className="service-card-grid">
          {filtered.map((s) => (
            <div key={s.id} className="service-card">
              {s.image_url && (
                <div style={{
                  height: '160px',
                  backgroundImage: `url(http://localhost:5000${s.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }} />
              )}
              <div className="service-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div className="service-card-title">{s.name}</div>
                  <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-muted'}`}>
                    {s.status === 'active' ? '● Active' : '○ Inactive'}
                  </span>
                </div>

                <div className="service-card-category">{s.category}</div>
                <div className="service-card-desc">{s.description || 'No description provided.'}</div>

                <div className="service-card-meta">
                  <div className="service-card-meta-item">
                    💰 <strong>${s.price}</strong>
                  </div>
                  <div className="service-card-meta-item">
                    ⏱️ {s.duration_minutes} min
                  </div>
                  <div className="service-card-meta-item">
                    📋 {s.total_bookings || 0} bookings
                  </div>
                </div>
              </div>

              <div className="service-card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/provider/edit-service/${s.id}`)}>
                  ✏️ Edit
                </button>
                <button
                  className={`btn btn-sm ${s.status === 'active' ? 'btn-secondary' : 'btn-success'}`}
                  onClick={() => toggleStatus(s.id)}
                >
                  {s.status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
                </button>
                <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setDeleteId(s.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ marginBottom: '8px' }}>Delete Service?</h3>
            <p style={{ marginBottom: '24px' }}>This action cannot be undone. All bookings for this service will be affected.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteService(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
