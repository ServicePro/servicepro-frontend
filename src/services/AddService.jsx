import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import servicesApi from '../api/servicesApi';

const categories = [
  'Home Repair', 'Plumbing', 'Electrical', 'Cleaning',
  'Landscaping', 'Painting', 'HVAC', 'Carpentry', 'Moving', 'Other',
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AddService = () => {
  const navigate = useNavigate();

  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    maxBookings: '',
    tags: '',
    startTime: '08:00',
    endTime: '18:00',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedDays.length === 0) {
      setError('Please select at least one available day.');
      return;
    }

    if (form.startTime >= form.endTime) {
      setError('End time must be later than start time.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('category', form.category);
      formData.append('description', form.description.trim());
      formData.append('price', form.price);
      formData.append('duration_minutes', form.duration);
      formData.append('max_bookings_per_day', form.maxBookings || '');
      formData.append('tags', form.tags.trim());
      formData.append('start_time', form.startTime);
      formData.append('end_time', form.endTime);
      formData.append('available_days', selectedDays.join(','));

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const res = await servicesApi.create(formData);

      setSuccess(res?.message || 'Service added successfully!');

      setTimeout(() => {
        navigate('/provider/manage-services');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to add service.');
      console.error('Add service error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-layout">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Add New Service</h1>
          <p>Fill in the details to list a new service for clients.</p>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#ffe5e5',
            color: '#b42318',
            border: '1px solid #f5c2c7',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#e7f8ee',
            color: '#067647',
            border: '1px solid #b7ebc6',
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-title">Service Details</div>
          <div className="form-section-sub">
            Basic information about the service you offer.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Service Name *</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Pipe Leak Repair"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (minutes) *</label>
                <input
                  className="form-input"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  min="15"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what the service includes, tools used, what clients can expect..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                className="form-input"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. emergency, same-day, indoor"
              />
              <span className="form-hint">
                Helps clients find your service faster.
              </span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Pricing</div>
          <div className="form-section-sub">
            Set your service rate and booking limits.
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <div className="price-input-wrap">
                <span className="price-prefix">$</span>
                <input
                  className="form-input"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Max Bookings per Day</label>
              <input
                className="form-input"
                name="maxBookings"
                type="number"
                value={form.maxBookings}
                onChange={handleChange}
                placeholder="e.g. 4"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Availability</div>
          <div className="form-section-sub">
            Set which days and hours you're available for this service.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Available Days</label>
              <div className="days-grid">
                {days.map((d) => (
                  <button
                    type="button"
                    key={d}
                    className={`day-toggle${selectedDays.includes(d) ? ' selected' : ''}`}
                    onClick={() => toggleDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  className="form-input"
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  className="form-input"
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Service Image</div>
          <div className="form-section-sub">
            Upload a photo that represents your service.
          </div>

          <div 
            className="form-group"
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed var(--brand-blue)' : '2px dashed var(--border-color)',
              backgroundColor: isDragging ? 'var(--info-bg)' : 'transparent',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '2rem' }}>{selectedImage ? '🖼️' : '☁️'}</div>
            <h4 style={{ margin: 0, fontWeight: 600 }}>
              {selectedImage ? 'Change Image' : 'Click or Drag & Drop to Upload'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              PNG, JPG or WEBP • Max 5MB
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {selectedImage && (
              <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--success)', fontWeight: 600 }}>
                Selected: {selectedImage.name}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/provider/manage-services')}
            disabled={loading}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : '✅ Publish Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;