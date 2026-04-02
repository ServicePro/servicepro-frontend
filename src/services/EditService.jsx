import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import servicesApi from '../api/servicesApi';

const categories = [
  'Home Repair', 'Plumbing', 'Electrical', 'Cleaning',
  'Landscaping', 'Painting', 'HVAC', 'Carpentry', 'Moving', 'Other',
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);

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
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await servicesApi.getById(id);
        if (res.success && res.data.service) {
          const s = res.data.service;
          setForm({
            name: s.name || '',
            category: s.category || '',
            description: s.description || '',
            price: s.price || '',
            duration: s.duration_minutes || '',
            maxBookings: s.max_bookings_per_day || '',
            tags: s.tags || '',
            startTime: s.start_time || '08:00',
            endTime: s.end_time || '18:00',
          });
          if (s.available_days) {
            const daysArr = Array.isArray(s.available_days) 
              ? s.available_days 
              : s.available_days.split(',').map(d => d.trim()).filter(Boolean);
            setSelectedDays(daysArr);
          }
          if (s.image_url) {
            setExistingImage(s.image_url);
          }
        } else {
          setError('Service not found.');
        }
      } catch (err) {
        console.error("Failed to load service", err);
        setError("Could not load service data. Please try again.");
      } finally {
        setInitializing(false);
      }
    };

    fetchServiceData();
  }, [id]);

  const toggleDay = (day) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

      await servicesApi.update(id, formData);

      setSuccess(`Service #${id} updated successfully!`);
      setTimeout(() => {
        navigate('/provider/manage-services');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update service.');
      console.error('Update service error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return <div style={{padding:'2rem'}}>Loading service details...</div>;

  return (
    <div className="form-page-layout">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Edit Service</h1>
          <p>Update the details of your existing service listing.</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/provider/manage-services')}
        >
          ← Back to Services
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: '#ffe5e5', color: '#b42318', border: '1px solid #f5c2c7' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: '#e7f8ee', color: '#067647', border: '1px solid #b7ebc6' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Service Details */}
        <div className="form-section">
          <div className="form-section-title">Service Details</div>
          <div className="form-section-sub">Update the basic information about this service.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Service Name *</label>
              <input className="form-input" name="name" value={form.name}
                onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" name="category" value={form.category}
                  onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes) *</label>
                <input className="form-input" name="duration" type="number"
                  value={form.duration} onChange={handleChange} min="15" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description" value={form.description}
                onChange={handleChange} rows={4} required />
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input className="form-input" name="tags" value={form.tags}
                onChange={handleChange} placeholder="Comma-separated tags" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="form-section">
          <div className="form-section-title">Pricing</div>
          <div className="form-section-sub">Update your pricing and booking capacity.</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <div className="price-input-wrap">
                <span className="price-prefix">$</span>
                <input className="form-input" name="price" type="number" value={form.price}
                  onChange={handleChange} min="0" step="0.01" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Max Bookings per Day</label>
              <input className="form-input" name="maxBookings" type="number"
                value={form.maxBookings} onChange={handleChange} min="1" />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="form-section">
          <div className="form-section-title">Availability</div>
          <div className="form-section-sub">Update available days and hours for this service.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Available Days</label>
              <div className="days-grid">
                {days.map((d) => (
                  <button type="button" key={d}
                    className={`day-toggle${selectedDays.includes(d) ? ' selected' : ''}`}
                    onClick={() => toggleDay(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input className="form-input" type="time" name="startTime"
                  value={form.startTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input className="form-input" type="time" name="endTime"
                  value={form.endTime} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-section">
          <div className="form-section-title">Service Image</div>
          <div className="form-section-sub">Update the image for this service.</div>
          
          <div 
            className="upload-area"
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
              gap: '12px',
              marginTop: '10px'
            }}
          >
            {existingImage && !selectedImage && (
              <div style={{ marginBottom: '16px' }}>
                <img 
                  src={`http://localhost:5000${existingImage}`} 
                  alt="Current Service" 
                  style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <p style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>Current Image</p>
              </div>
            )}
            
            <div style={{ fontSize: '2rem' }}>{selectedImage ? '🖼️' : '☁️'}</div>
            <h4 style={{ margin: 0, fontWeight: 600 }}>
              {selectedImage ? 'Change Image' : existingImage ? 'Click or Drag & Drop to Replace' : 'Click or Drag & Drop to Upload'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              PNG, JPG or WEBP • Max 5MB
            </p>
            
            <input 
              ref={fileInputRef}
              className="form-input" 
              type="file" 
              accept=".png,.jpg,.jpeg,.webp" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
            {selectedImage && <div style={{ fontSize: '14px', color:'var(--success)', fontWeight: 600 }}>Selected: {selectedImage.name}</div>}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary"
            onClick={() => navigate('/provider/manage-services')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditService;
